import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
} from 'react-native';
import React from 'react';
import Header from '../../components/Header';
import {useAnalytics, useTheme} from '../../hooks';
import Icon from 'react-native-vector-icons/Entypo';
const NoProductImage = require('../../assets/images/no_product_image.jpg');
const NoUserImage = require('../../assets/image/no-profile.jpg');

const Analytics = () => {
  const {currentTheme} = useTheme();
  const {todaysMostSoldProducts, newReviews, todaySales} = useAnalytics();
  return (
    <View style={[styles.parent, {backgroundColor: currentTheme.baseColor}]}>
      <Header
        titleColor={currentTheme.header.textColor}
        name="Analytics"
        headerBgColor={currentTheme.baseColor}
        backButtom={true}
      />
      <View style={{flex: 1, paddingHorizontal: 10}}>
        <ScrollView
          style={{flex: 1}}
          contentContainerStyle={{paddingBottom: 90, gap: 20}}>
          <View
            style={{
              height: 400,
              borderRadius: 20,
              backgroundColor: currentTheme.contrastColor,
              paddingTop: 20,
              paddingHorizontal: 10,
            }}>
            <Text
              style={{
                fontSize: 22,
                fontWeight: '400',
                textAlign: 'center',
                fontStyle: 'italic',
              }}>
              This is what went today
            </Text>
{/* container started */}
{/* star product */}
 {/* label */}
            <View style={{flex: 1,marginTop:10}}>
              <View style={{flexDirection:'row',alignItems:'center'}}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '400',
                  paddingLeft:20
                }}>
                Star Product
              </Text>
              <Icon name='star' size={18} color={'#ffcc00'} />
              </View>
             {/* image and info */}
              <View>
                <View style={{height: 100, width: 100}}>
                  <Image
                    source={NoProductImage}
                    style={{height: 100, width: 100, borderRadius: 50,borderColor:currentTheme.bgColor,borderWidth:1}}
                  />
                </View>
                <View>
                  <Text>{todaysMostSoldProducts[0]?.product?.name || 'N/A'}</Text>
                </View>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                gap: 6,
                justifyContent: 'center',
                marginBottom: 10,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '400',
                  textAlign: 'center',
                }}>
                {newReviews.length === 0
                  ? 'No feedbacks today.'
                  : `You got ${newReviews.length} feedback(s) today`}
              </Text>
              {newReviews.length !== 0 && (
                <Pressable>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '400',
                      textAlign: 'center',

                      color: 'blue',
                    }}>
                    see all.
                  </Text>
                </Pressable>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {flex: 1},
  graphContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 30,
  },
  graphLabel: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
  },
});

export default Analytics;

{
  /* <View style={styles.graphContainer}>
          <Text
            style={[styles.graphLabel, {color: currentTheme.contrastColor}]}>
            {t('d_todaybestseller_title')}
          </Text>
          <TodayBestSellerInfoGraph />
        </View>
        <View style={styles.graphContainer}>
          <Text
            style={[styles.graphLabel, {color: currentTheme.contrastColor}]}>
            {t('d_weeklysalesinfograph_title')}
          </Text>
          <WeeklySalesInfoGraph />
        </View> */
}
