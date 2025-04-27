import {SoldProduct} from '../../../../types';
import {View, Text, StyleSheet} from 'react-native';
import WeeklySalesAnalyticsGraph from './WeeklySalesAnalyticsGraph';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../store/store';

type WeeklySalesCardProps = {
  weeklySales: SoldProduct[];
};

const WeeklySalesAnalysisCard = ({weeklySales}: WeeklySalesCardProps) => {
  const totalProductsSold = weeklySales.reduce(
    (acc, soldProduct) => acc + soldProduct.count,
    0,
  );

  const {currency} = useSelector((s: RootState) => s.appData.app);

  const totalRevenue = weeklySales.reduce((acc, soldProduct) => {
    const product = soldProduct.product;
    const price = product.discountedPrice ?? product.basePrice;
    return acc + price * soldProduct.count;
  }, 0);

  const totalProfit = weeklySales.reduce((acc, soldProduct) => {
    const product = soldProduct.product;
    const sellingPrice = product.discountedPrice ?? product.basePrice;
    const profitPerItem = sellingPrice - product.productCost;
    return acc + profitPerItem * soldProduct.count;
  }, 0);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Weekly Sales 📈</Text>

      <Text style={styles.text}>
        <Text style={styles.label}>🛒 Total Products Sold: </Text>
        {totalProductsSold}
      </Text>

      <Text style={styles.text}>
        <Text style={styles.label}>💵 Total Revenue: </Text>
        {currency} {totalRevenue.toFixed(2)}
      </Text>

      <Text style={styles.text}>
        <Text style={styles.label}>📊 Total Profit: </Text>
        {currency} {totalProfit.toFixed(2)}
      </Text>
      <WeeklySalesAnalyticsGraph />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    minWidth: 250,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
  },
});

export default WeeklySalesAnalysisCard;
