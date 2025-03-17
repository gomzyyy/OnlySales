import {Text, StyleSheet, View, ScrollView} from 'react-native';
import React, {useState} from 'react';
import {Product} from '../../../../types';
import {useTheme} from '../../../hooks/index';
import LongPressEnabled from '../../../customComponents/LongPressEnabled';
import EditProduct from '../components/EditCreateProduct';
import SlideUpContainer from '../../../components/SlideUpContainer';
import PopupContainer from '../../../components/PopUp';
import TabLongPressOptions from './TabLongPressOptions';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../store/store';
import {deviceWidth} from '../../../utils/Constants';

type TabProps = {
  i: Product;
  lastIndex?: boolean;
};

const Tab: React.FC<TabProps> = ({i, lastIndex = false}): React.JSX.Element => {
  const {currentTheme} = useTheme();
  const {currency} = useSelector((s: RootState) => s.appData.app);
  const [openEditing, setOpenEditing] = useState<boolean>(false);
  const [openLongPressOptions, setOpenLongPressOptions] =
    useState<boolean>(false);

  const handleClickingTab = () => {
    setOpenEditing(true);
  };
  const handleOpenLongPressOptions = () => setOpenLongPressOptions(true);
  const handleCloseLongPressOptions = () => setOpenLongPressOptions(false);
  const handleCloseEditing = () => setOpenEditing(false);
  return (
    <LongPressEnabled
      longPressCanceledAction={handleClickingTab}
      longPressAction={handleOpenLongPressOptions}>
      <View
        style={[
          styles.container,
          {
            marginBottom: lastIndex ? 70 : 6,
            backgroundColor: currentTheme.contrastColor,
          },
        ]}>
        <View
          style={[styles.tabLabel, {backgroundColor: currentTheme.baseColor}]}>
          <Text
            style={[styles.productName, {color: currentTheme.tab.text}]}>
            {i.name}
          </Text>
        </View>
        <View
          style={[
            styles.productInfoContainer,
            {backgroundColor: currentTheme.baseColor},
          ]}>
          <View style={styles.infoContainer}>
            <Text style={[styles.infoText, {color: currentTheme.tab.text}]}>
              Price: {`${currency}${i.basePrice}`}
            </Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={[styles.infoText, {color: currentTheme.tab.text}]}>
              Discounted price: {`${currency} ${i.discountedPrice}`}
            </Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={[styles.infoText, {color: currentTheme.tab.text}]}>
              Includes: {i.quantity} {i.measurementType}
            </Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={[styles.infoText, {color: currentTheme.tab.text}]}>
              Total sold: {i.totalSold}
            </Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={[styles.infoText, {color: currentTheme.tab.text}]}>
              Stock: {i.stock}
            </Text>
          </View>

          <View style={styles.infoContainer}>
            <Text style={[styles.infoText, {color: currentTheme.tab.text}]}>
              Product cost: {`${currency} ${i.productCost}`}
            </Text>
          </View>
          {i.productCost && (
            <View style={styles.infoContainer}>
              <Text style={[styles.infoText, {color: currentTheme.tab.text}]}>
                Net Profit/sale:{' '}
                {`${
                 parseFloat(( i.discountedPrice && i.discountedPrice > 0
                    ? (i.discountedPrice / i.productCost) * 100
                    : (i.basePrice / i.productCost) * 100).toFixed(2))
                }%`}
              </Text>
            </View>
          )}
        </View>
        <SlideUpContainer open={openEditing} close={handleCloseEditing}>
          <EditProduct product={i} close={handleCloseEditing} />
        </SlideUpContainer>
        <PopupContainer
          open={openLongPressOptions}
          close={handleCloseLongPressOptions}
          padding={true}>
          <TabLongPressOptions i={i} close={handleCloseLongPressOptions} />
        </PopupContainer>
      </View>
    </LongPressEnabled>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 6,
    paddingVertical: 6,
    justifyContent: 'space-between',
    borderRadius: 8,
    height: 210,
    width: deviceWidth * 0.45,
    maxWidth: 300,
  },
  tabLabel: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: 6,
  },
  productName: {
    fontSize: 20,
    fontWeight: '400',
  },
  productInfoContainer: {
    flex: 1,
    marginTop: 4,
    borderRadius: 6,
    padding: 4,
  },
  infoContainer: {
    marginTop: 6,
  },
  infoText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Tab;
