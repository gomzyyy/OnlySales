import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
} from 'react-native';
import React from 'react';
import {useAnalytics, useTheme} from '../../../hooks';
import Icon from 'react-native-vector-icons/Entypo';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../store/store';
import {TouchableNativeFeedback} from 'react-native';
import TodayBestSellerAnalyticsGraph from './graphs/TodayBestSellerAnalyticsGraph';

const NoProductImage = require('../../../assets/images/no_product_image.jpg');
const NoUserImage = require('../../../assets/image/no-profile.jpg');

const TodayAnalyticsCard = () => {
  const {currentTheme} = useTheme();
  const {todaysMostSoldProducts, todaySales, newReviews, customers} =
    useAnalytics();
  const {currency} = useSelector((s: RootState) => s.appData.app);

  const todayCustomerGain = customers.filter(c => {
    const createdDate = new Date(c.createdAt);
    const today = new Date();
    return (
      createdDate.getDate() === today.getDate() &&
      createdDate.getMonth() === today.getMonth() &&
      createdDate.getFullYear() === today.getFullYear()
    );
  }).length;

  const totalTodaySalesAmount = todaySales.reduce((acc, item) => {
    return (
      acc +
      (item.product.discountedPrice || item.product.basePrice) * item.count
    );
  }, 0);

  return (
    <View
      style={[styles.container, {backgroundColor: currentTheme.contrastColor}]}>
      <Text style={styles.headerText}>Today Sales 📈</Text>

      <ScrollView
        style={{borderRadius: 20}}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}>
        {/* Star Product Section */}
        <View style={[styles.section, {backgroundColor: currentTheme.bgColor}]}>
          <View style={styles.labelRow}>
            <Text style={styles.sectionTitle}>Star Product</Text>
            <Icon name="star" size={18} color={'#ffcc00'} />
          </View>

          {todaysMostSoldProducts.length > 0 ? (
            <View style={styles.productContainer}>
              <Image
                source={
                  todaysMostSoldProducts[0]?.product?.image
                    ? {uri: todaysMostSoldProducts[0]?.product?.image}
                    : NoProductImage
                }
                style={[styles.productImage, {borderColor: '#ffcc00'}]}
              />
              <Text style={styles.productName}>
                {todaysMostSoldProducts[0]?.product?.name || 'N/A'}
              </Text>
              <Text style={styles.productSold}>
                {todaysMostSoldProducts[0]?.count || 0}
                {` sale(s) in total`}
              </Text>
            </View>
          ) : (
            <Text style={styles.noDataText}>No sales recorded today.</Text>
          )}
        </View>

        {/* Total Sales Section */}
        <View style={[styles.section, {backgroundColor: currentTheme.bgColor}]}>
          <View style={styles.labelRow}>
            <Text style={styles.sectionTitle}>Total Sales</Text>
            <Icon name="shopping-cart" size={18} color={'green'} />
          </View>
          <Text style={styles.infoText}>
            {currency} {totalTodaySalesAmount.toFixed(2)}
          </Text>
        </View>

        {/* New Reviews Section */}
        <View style={[styles.section, {backgroundColor: currentTheme.bgColor}]}>
          <View style={styles.labelRow}>
            <Text style={styles.sectionTitle}>New Reviews</Text>
            <Icon name="chat" size={18} color={'#007AFF'} />
          </View>
          {newReviews.length === 0 ? (
            <Text style={styles.noDataText}>No new feedbacks today.</Text>
          ) : (
            <View style={styles.reviewRow}>
              <Text style={styles.infoText}>
                {newReviews.length} new review(s)
              </Text>
              <Pressable>
                <Text style={styles.seeAllText}>See all</Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* New Customers Section */}
        <View style={[styles.section, {backgroundColor: currentTheme.bgColor}]}>
          <View style={styles.labelRow}>
            <Text style={styles.sectionTitle}>New Customers</Text>
            <Icon name="add-user" size={18} color={'#ff6f00'} />
          </View>
          <Text style={styles.infoText}>
            {todayCustomerGain > 0
              ? `You gained ${todayCustomerGain} new customer(s) today`
              : 'No new customers today.'}
          </Text>
        </View>

        <View style={[styles.section, {backgroundColor: currentTheme.bgColor}]}>
          <View style={styles.labelRow}>
            <Text style={styles.sectionTitle}>
              Here are your top 5 products of today
            </Text>
            <Icon name="star" size={18} color={'#ffcc00'} />
          </View>
          <TodayBestSellerAnalyticsGraph />
        </View>
      </ScrollView>
    </View>
  );
};

export default TodayAnalyticsCard;

const styles = StyleSheet.create({
  container: {
    height: 450,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 10,
    overflow: 'hidden',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  section: {
    marginTop: 10,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingLeft: 10,
    gap: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  productContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  productImage: {
    height: 90,
    width: 90,
    borderRadius: 45,
    borderWidth: 2,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 5,
  },
  productSold: {
    marginTop: 4,
    fontSize: 14,
    color: '#666',
  },
  noDataText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  infoText: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '400',
    color: '#666',
  },
  reviewRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
  },
  seeAllText: {
    color: 'blue',
    fontSize: 16,
    fontWeight: '400',
  },
});
