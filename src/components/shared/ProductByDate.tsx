import {FlatList, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {Customer, Product} from '../../../types';
import {Theme} from '../../utils/Constants';
import Icon from 'react-native-vector-icons/AntDesign';
import {navigate} from '../../utils/nagivationUtils';
const currentTheme = Theme[0];

type ProductsByDateProps = {
  ArrWithDate: Product[];
  customer: Customer;
};
type TabProps = {
  i: Product[];
  lastIndex?: boolean;
  date: string;
};
export const ProductsByDate: React.FC<ProductsByDateProps> = ({
  ArrWithDate,
  customer,
}): React.JSX.Element => {
  const groupedObject = ArrWithDate.reduce<Record<string, Product[]>>(
    (acc, product) => {
      const creationDate: string = new Date(product.createdAt).toDateString();
      if (!acc[creationDate]) {
        acc[creationDate] = [];
      }
      acc[creationDate].push(product);
      return acc;
    },
    {} as Record<string, Product[]>,
  );
  const groupedArr = Object.keys(groupedObject).map(m => ({
    date: m,
    products: groupedObject[m],
  }));
  const Tab: React.FC<TabProps> = ({
    lastIndex = false,
    i,
    date,
  }): React.JSX.Element => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.container, {marginBottom: lastIndex ? 70 : 6}]}
        onPress={() => navigate('UnpaidUdhars', {products: i, customer, date})}>
        <Text style={styles.date}>{date}</Text>
        <TouchableOpacity>
          <Icon name="right" color={'#fff'} size={22} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };
  return (
    <FlatList
      data={groupedArr}
      keyExtractor={s => s.date}
      renderItem={({item}) => (
        <Tab date={item.date} i={item.products} key={item.date} />
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    paddingVertical: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: currentTheme.tabColor,
    borderRadius: 8,
  },
  date: {
    fontSize: 20,
    fontWeight: '400',
    color: currentTheme.contrastColor,
  },
});
