import {FlatList, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {Customer, SoldProduct} from '../../../types';
import Icon from 'react-native-vector-icons/AntDesign';
import {navigate} from '../../utils/nagivationUtils';
import {useTheme} from '../../hooks/index';
import {useMemo} from 'react';

type ProductsByDateProps = {
  ArrWithDate: SoldProduct[];
  customer: Customer;
  // onTabPressNavigate: string;
  onTabPress: ({
    products,
    customer,
    date,
  }: {
    products: SoldProduct[];
    customer: Customer;
    date: string;
  }) => void;
};
type TabProps = {
  i: SoldProduct[];
  lastIndex?: boolean;
  date: string;
};
export const ProductsByDate: React.FC<ProductsByDateProps> = ({
  ArrWithDate,
  customer,
  onTabPress,
}): React.JSX.Element => {
  const {currentTheme} = useTheme();
  const groupedObject = ArrWithDate.reduce<Record<string, SoldProduct[]>>(
    (acc, product) => {
      const creationDate: string = new Date(
        new Date(product.createdAt).setHours(0, 0, 0, 0),
      ).toDateString();

      if (!acc[creationDate]) {
        acc[creationDate] = [];
      }

      const existingProductIndex = acc[creationDate].findIndex(
        p => p._id === product._id && p.createdAt === product.createdAt,
      );

      if (existingProductIndex !== -1) {
        acc[creationDate][existingProductIndex].count += product.count;
      } else {
        acc[creationDate].push(product);
      }

      return acc;
    },
    {} as Record<string, SoldProduct[]>,
  );
  const groupedArr = useMemo(() => {
    return Object.keys(groupedObject)
      .map(m => ({
        date: m.split(' ').join(', '),
        products: groupedObject[m],
      }))
      .reverse();
  }, [ArrWithDate]);
  const Tab: React.FC<TabProps> = ({
    lastIndex = false,
    i,
    date,
  }): React.JSX.Element => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={[
          styles.container,
          {
            marginBottom: lastIndex ? 70 : 6,
            backgroundColor: currentTheme.tab.bg,
          },
        ]}
        onPress={() => onTabPress({products: i, date, customer})}>
        <Text style={[styles.date, {color: currentTheme.tab.label || '#000'}]}>
          {date}
        </Text>
        <Icon name="right" color={currentTheme.tab.icon} size={22} />
      </TouchableOpacity>
    );
  };
  return (
    <FlatList
      data={groupedArr}
      keyExtractor={s => s.date}
      renderItem={({item}) => <Tab date={item.date} i={item.products} />}
      nestedScrollEnabled
    />
  );
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
