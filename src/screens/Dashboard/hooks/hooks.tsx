import React, {
  FunctionComponent,
  useEffect,
  useMemo,
  useState,
  Dispatch,
  SetStateAction,
} from 'react';
import {useAnalytics, useTheme} from '../../../hooks';
import {
  AppTheme,
  Customer,
  Employee,
  Product,
  SoldProduct,
} from '../../../../types';
import {Pressable, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native';
import {StyleSheet} from 'react-native';
import Tab from '../../Customers/components/Tab';
import Icon from 'react-native-vector-icons/AntDesign';
import SlideUpContainer from '../../../components/SlideUpContainer';
import {deviceHeight} from '../../../utils/Constants';
import UnPaidPayments from '../../Customer/components/UnPaidPayments';
import {createCustomerAPI} from '../../../api/api.customer';
import {
  CreateCustomerAPIReturnType,
  createCustomerData,
} from '../../../api/types.api';
import {showToast} from '../../../service/fn';
import {validateTokenAPI} from '../../../api/api.auth';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../../store/store';
import {setUser} from '../../../../store/slices/business';
import {navigate} from '../../../utils/nagivationUtils';
import {AppThemeName} from '../../../../enums';

const months: any = {
  jan: ['january', 1, 'jan'],
  feb: ['february', 2, 'feb'],
  mar: ['march', 3, 'mar'],
  apr: ['april', 4, 'apr'],
  may: ['may', 5, 'may'],
  jun: ['june', 6, 'jun'],
  jul: ['july', 7, 'jul'],
  aug: ['august', 8, 'aug'],
  sep: ['september', 9, 'sep'],
  oct: ['october', 10, 'oct'],
  nov: ['november', 11, 'nov'],
  dec: ['december', 12, 'dec'],
};

export type useQueryReturnType = {
  customersByQuery: Customer[];
  soldProductsByQueryDate: {date: string; products: SoldProduct[]}[];
  CustomerTab: FunctionComponent<CustomerTabProps>;
  DateWithSoldProductTab: FunctionComponent<DateWithSoldProductTabProps>;
  InventoryProductTab: FunctionComponent<InventoryProductTabProps>;
  message: string | undefined;
  foundInventory: Product[];
};
type useQueryProps = {
  query: string;
  close?: any;
};

type CustomerTabProps = {
  customer: Customer;
};
type DateWithSoldProductTabProps = {
  data: {date: string; products: SoldProduct[]};
  lastIndex?: boolean;
  onTabPress?: ({
    products,
    customer,
    date,
  }: {
    products: SoldProduct[];
    customer: Customer;
    date: string;
  }) => void;
};

const useQuery = ({query, close}: useQueryProps): useQueryReturnType => {
  const {currentTheme} = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const [message, setMessage] = useState<string | undefined>();
  const [customerResult, setCustomerResult] = useState<Customer[]>([]);
  const [foundInventory, setFoundInventory] = useState<Product[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<
    Customer | undefined
  >(undefined);

  const [soldProductByDateQueryResult, setSoldProductByDateQueryResult] =
    useState<{date: string; products: SoldProduct[]}[]>([]);

  const {customers, owner} = useAnalytics();
  const user = useSelector((s: RootState) => s.appData.user)!;

  const soldProductsWithDates = (
    selectedCustomer || customerResult[0]
  )?.buyedProducts.reduce<Record<string, SoldProduct[]>>((acc, sp) => {
    const creationDate: string = new Date(
      new Date(sp.createdAt).setHours(0, 0, 0, 0),
    ).toDateString();
    if (!acc[creationDate]) {
      acc[creationDate] = [];
    }

    const existingProductIndex = acc[creationDate].findIndex(
      p => p._id === sp._id && p.createdAt === sp.createdAt,
    );

    if (existingProductIndex !== -1) {
      acc[creationDate][existingProductIndex].count += sp.count;
    } else {
      acc[creationDate].push(sp);
    }
    return acc;
  }, {});

  const groupedSoldProductArr = useMemo(() => {
    return Object.keys(soldProductsWithDates || []).map(k => ({
      date: k.split(' ').join(', '),
      products: soldProductsWithDates[k],
    }));
  }, [soldProductsWithDates]);

  const handleQuery = async () => {
    if (query.length < 3) {
      setCustomerResult([]);
      return;
    }
    if (query.trim().startsWith('find')) {
      const cleanQuery = query.split(' ').slice(1);
      const customerName = cleanQuery[0];
      if (cleanQuery.length === 1) {
        findCustomerByQuery(customerName, customers, setCustomerResult);
      }
    } else if (query.trim().startsWith('create')) {
      const cleanQuery = query.split(' ').slice(1);
      const customerName = cleanQuery[0];
      const executeCreateCustomer: boolean = cleanQuery[1]
        ? cleanQuery[1] === 'ex'
        : false;
      if (cleanQuery.length >= 1) {
        if (executeCreateCustomer) {
          const data = {
            query: {
              role: user.role,
              creatorId: user._id,
              createdBy: user.role,
            },
            body: {
              name: customerName,
              businessOwnerId: owner._id,
            },
            image: {},
          };
          const res = await createCustomerByNameWithQuery(data);
          if (res.success) {
            const userRes = await validateTokenAPI({role: user.role});
            if (userRes.success && userRes.data && userRes.data.user) {
              dispatch(setUser(userRes.data.user));
            }
            navigate('Customer', {
              customer: res.data.customer,
              openAddProduct: true,
            });
          }
          showToast({
            type: res.success ? 'success' : 'info',
            text1: res.success
              ? 'query executed successfully.'
              : 'query denied.',
          });
          close && close();
        }
      }
    }
  };

  useEffect(() => {
    if (query.trim().length >= 5) {
      handleQuery();
    }
    if (query.trim().startsWith('create') || query.trim().length < 4) {
      setCustomerResult([]);
    }
    setMessage("use 'find' or 'create' keywords for customer.");
    if (query.trim().startsWith('find')) {
      setMessage("'find' is helpful to find customers.");
    }
    if (query.trim().startsWith('create')) {
      setMessage("'create' is helpful to create customer on the go.");
      if (query.trim().split(' ')[1] && query.trim().split(' ')[1].length > 4) {
        setMessage("add 'ex' at the end to Execute creation.");
      }
    }
  }, [query]);

  const CustomerTab: React.FC<CustomerTabProps> = ({
    customer,
  }): React.JSX.Element => {
    return <Tab i={customer} />;
  };
  const DateWithSoldProductTab: React.FC<DateWithSoldProductTabProps> = ({
    data,
    lastIndex = false,
    onTabPress = () => {},
  }): React.JSX.Element => {
    const [openUnpaidSheet, setOpenUnpaidSheet] = useState(false);

    return (
      <>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            styles.container,
            {
              marginBottom: lastIndex ? 70 : 6,
              backgroundColor: currentTheme.tab.bg,
            },
          ]}
          onPress={() => setOpenUnpaidSheet(true)}>
          <Text
            style={[styles.date, {color: currentTheme.tab.label || '#000'}]}>
            {data.date}
          </Text>
          <Icon name="right" color={currentTheme.tab.icon} size={22} />
        </TouchableOpacity>

        <SlideUpContainer
          open={openUnpaidSheet}
          close={() => setOpenUnpaidSheet(false)}
          opacity={0.7}
          height={deviceHeight * 0.75}>
          <UnPaidPayments
            date={data.date}
            customer={selectedCustomer || customerResult[0]}
            products={data.products}
            close={() => setOpenUnpaidSheet(false)}
          />
        </SlideUpContainer>
      </>
    );
  };

  return {
    customersByQuery: customerResult,
    soldProductsByQueryDate: soldProductByDateQueryResult,
    CustomerTab,
    DateWithSoldProductTab,
    message,
    foundInventory,
    InventoryProductTab,
  };
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    paddingVertical: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 8,
  },
  date: {
    fontSize: 20,
    fontWeight: '400',
  },
});

export default useQuery;

const findCustomerByQuery = (
  query: string,
  arr: Customer[],
  setState: Dispatch<SetStateAction<Customer[]>>,
) => {
  setState(
    arr.filter(s => {
      return s.name
        .trim()
        .toLowerCase()
        .includes(query[0].trim().toLowerCase());
    }),
  );
};

const createCustomerByNameWithQuery = async (
  data: createCustomerData,
  setState?: Dispatch<SetStateAction<boolean>>,
): Promise<CreateCustomerAPIReturnType> => {
  const res = await createCustomerAPI(data, setState);
  return res;
};
type InventoryProductTabProps = {
  product: Product;
  onPress?: () => void;
  lastIndex?: false;
  theme: AppTheme;
};
const InventoryProductTab: React.FC<InventoryProductTabProps> = ({
  product,
  onPress = () => {},
  lastIndex = false,
  theme,
}): React.JSX.Element => {
  return (
    <Pressable
      style={[
        styles.container,
        {
          marginBottom: lastIndex ? 70 : 6,
          backgroundColor: theme.tab.bg,
        },
      ]}
      onPress={onPress}>
      <Text>{product.name}</Text>
    </Pressable>
  );
};

// $rohit&yyyy/mm/dd

// const cleanQuery = query.slice(1);
// const cusDetArr = cleanQuery.split(' ');
// setCustomerResult(
//   customers.filter(s => {
//     return s.name
//       .trim()
//       .toLowerCase()
//       .includes(cusDetArr[0].trim().toLowerCase());
//   }),
// );
// if (cusDetArr[1]) {
//   const queryDateArr = cusDetArr[1].split('/');
//   const soldProductsByQueryDate = groupedSoldProductArr.filter(x => {
//     const dateArr = x.date.split(', ').map(s => s.toLowerCase());
//     const y = dateArr[3];
//     const d = dateArr[2];
//     const m = dateArr[1];

//     const qy = queryDateArr[0];
//     const qd = queryDateArr[2];
//     const qm = queryDateArr[1];
//     if (y === qy && d === qd && m === qm) {
//       console.log('x', x);
//       return x;
//     }
//   });
//   setSoldProductByDateQueryResult(soldProductsByQueryDate);
// }
