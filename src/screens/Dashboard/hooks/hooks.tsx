import React, {FunctionComponent, useEffect, useMemo, useState} from 'react';
import {useAnalytics, useTheme} from '../../../hooks';
import {Customer, SoldProduct} from '../../../../types';
import {TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native';
import {StyleSheet} from 'react-native';
import Tab from '../../Customers/components/Tab';
import Icon from 'react-native-vector-icons/AntDesign';
import SlideUpContainer from '../../../components/SlideUpContainer';
import {deviceHeight} from '../../../utils/Constants';
import UnPaidPayments from '../../Customer/components/UnPaidPayments';

export type useQueryReturnType = {
  customersByQuery: Customer[];
  soldProductsByQueryDate: {date: string; products: SoldProduct[]}[];
  CustomerTab: FunctionComponent<CustomerTababProps>;
  DateWithSoldProductTab: FunctionComponent<DateWithSoldProductTabProps>;
};
type useQueryProps = {
  query: string;
};

type CustomerTababProps = {
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

const useQuery = ({query}: useQueryProps): useQueryReturnType => {
  const [customerResult, setCustomerResult] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<
    Customer | undefined
  >(undefined);

  const [soldProductByDateQueryResult, setSoldProductByDateQueryResult] =
    useState<{date: string; products: SoldProduct[]}[]>([]);

  const {customers} = useAnalytics();

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

  const handleQuery = () => {
    if (query.length < 3) {
      setCustomerResult([]);
      return;
    }
    if (query.trim().startsWith('$')) {
      const cleanQuery = query.slice(1);
      const cusDetArr = cleanQuery.split('&');
      setCustomerResult(
        customers.filter(s => {
          return s.name
            .trim()
            .toLowerCase()
            .includes(cusDetArr[0].trim().toLowerCase());
        }),
      );
      if (cusDetArr[1]) {
        const queryDateArr = cusDetArr[1].split('/');
        const soldProductsByQueryDate = groupedSoldProductArr.filter(x => {
          const dateArr = x.date.split(', ').map(s => s.toLowerCase());
          const y = dateArr[3];
          const d = dateArr[2];
          const m = dateArr[1];
          const qy = queryDateArr[0];
          const qd = queryDateArr[2];
          const qm = queryDateArr[1];
          if (y === qy && d === qd && m === qm) {
            console.log('x', x);
            return x;
          }
        });
        setSoldProductByDateQueryResult(soldProductsByQueryDate);
      }
    }
  };

  useEffect(() => {
    if (query.trim().length >= 5) {
      handleQuery();
    }
  }, [query]);

  const {currentTheme} = useTheme();

  const CustomerTab: React.FC<CustomerTababProps> = ({
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

// $rohit&yyyy/mm/dd
