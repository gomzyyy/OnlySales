import {FlatList, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {Customer, Product} from '../../../types';
import Icon from 'react-native-vector-icons/AntDesign';
import {navigate} from '../../utils/nagivationUtils';
import {useTheme} from '../../hooks/index';

type ProductsByDateProps = {
  ArrWithDate: Product[];
  customer: Customer;
  onTabPressNavigate:string;
};
type TabProps = {
  i: Product[];
  lastIndex?: boolean;
  date: string;
};
export const ProductsByDate: React.FC<ProductsByDateProps> = ({
  ArrWithDate,
  customer,
  onTabPressNavigate
}): React.JSX.Element => {
  const {currentTheme} = useTheme();
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
  const groupedArr = Object.keys(groupedObject)
    .map(m => ({
      date: m.split(' ').join(', '),
      products: groupedObject[m],
    }))
    .reverse();
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
        onPress={() => navigate(onTabPressNavigate, {products: i, customer, date})}>
        <Text style={[styles.date,{color: currentTheme?.tab?.value || "#000"}]}>
          {date}
        </Text>
        <TouchableOpacity>
          <Icon name="right" color={currentTheme.tab.icon} size={22} />
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
