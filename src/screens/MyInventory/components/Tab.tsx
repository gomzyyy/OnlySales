import {Text, StyleSheet, View, ScrollView, Image} from 'react-native';
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
const NoPhoto = require('../../../assets/images/no-profile.jpg');

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
            backgroundColor: currentTheme.baseColor,
          },
        ]}>
        <View
          style={[styles.tabLabel, {backgroundColor: currentTheme.baseColor}]}>
          <Text style={[styles.productName, {color: currentTheme.tab.text}]}>
            {i.name}
          </Text>
        </View>
        <View
          style={[
            styles.productInfoContainer,
            {backgroundColor: currentTheme.baseColor},
          ]}>
          <View style={styles.imageContainer}>
            <Image
              source={i.image ? {uri: i.image} : NoPhoto}
              height={120}
              width={120}
              style={{
                borderRadius: 20,
                borderWidth: 1,
                borderColor: currentTheme.contrastColor,
              }}
            />
          </View>
          <View>
            <View style={styles.infoContainer}>
              <Text style={[styles.infoText, {color: currentTheme.tab.text}]}>
                Price: {`${currency} ${i.basePrice}`}
              </Text>
            </View>
            {i.discounterPrice && (
              <View style={styles.infoContainer}>
                <Text style={[styles.infoText, {color: currentTheme.tab.text}]}>
                  Discounted price: {`${currency} ${i.discounterPrice}`}
                </Text>
              </View>
            )}
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
                  {`${parseFloat(
                    (i.discounterPrice && i.discounterPrice > 0
                      ? (i.discounterPrice / i.productCost) * 100 - 100
                      : (i.basePrice / i.productCost) * 100 - 100
                    ).toFixed(1),
                  )}%`}
                </Text>
              </View>
            )}
          </View>
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
    borderRadius: 16,
  },
  tabLabel: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: 10,
  },
  productName: {
    fontSize: 20,
    fontWeight: '400',
  },
  productInfoContainer: {
    flex: 1,
    marginTop: 4,
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
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
