import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Customer, SoldProduct} from '../../../types';
import Icon from 'react-native-vector-icons/AntDesign';
import {useTheme} from '../../hooks/index';
import {useMemo} from 'react';
import LongPressEnabled from '../../customComponents/LongPressEnabled';
import LinearGradient from 'react-native-linear-gradient';

type ProductsByDateProps = {
  ArrWithDate: SoldProduct[];
  customer: Customer;
  tabColor?: 'contrast' | 'colorful';
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
  placeHolder: string | undefined;
};
export const ProductsByDate: React.FC<ProductsByDateProps> = ({
  ArrWithDate,
  customer,
  onTabPress,
  tabColor = 'contrast',
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
        date: m.split(' ').slice(1).join(', '),
        products: groupedObject[m],
        placeHolder: undefined,
      }))
      .reverse();
  }, [ArrWithDate]);
  const Tab: React.FC<TabProps> = ({
    lastIndex = false,
    i,
    date,
    placeHolder,
  }): React.JSX.Element => {
    return (
      <LongPressEnabled
        longPressCanceledAction={() =>
          onTabPress({products: i, date: i[0].createdAt, customer})
        }
        longPressAction={() => {}}>
        <LinearGradient
          colors={[currentTheme.fadeColor, currentTheme.contrastColor]}
          start={{x: 0, y: 0}}
          style={[
            styles.container,
            {
              marginBottom: lastIndex ? 70 : 6,
              backgroundColor:
                tabColor === 'contrast'
                  ? currentTheme.tab.bg
                  : currentTheme.baseColor,
              borderLeftColor: currentTheme.baseColor,
            },
          ]}>
          <Text
            style={[
              styles.date,
              {
                color:
                  tabColor === 'contrast'
                    ? currentTheme.tab.label
                    : currentTheme.contrastColor,
              },
            ]}>
            {placeHolder || date}
          </Text>
        </LinearGradient>
      </LongPressEnabled>
    );
  };
  return (
    <FlatList
      data={groupedArr}
      keyExtractor={s => s.date}
      renderItem={({item, index}) => (
        <Tab
          date={item.date}
          i={item.products}
          lastIndex={groupedArr.length - 1 === index}
          placeHolder={item.placeHolder}
        />
      )}
      nestedScrollEnabled
      style={{flex: 1}}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    paddingVertical: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
     borderLeftWidth: 2,
  },
  date: {
    fontSize: 20,
    fontWeight: '400',
  },
});
