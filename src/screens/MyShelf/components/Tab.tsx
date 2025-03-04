import {
  Text,
  StyleSheet,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {Product} from '../../../../types';
import useTheme from '../../../hooks/useTheme';
import LongPressEnabled from '../../../customComponents/LongPressEnabled';
import EditProduct from '../components/EditCreateProduct';
import SlideUpContainer from '../../../components/SlideUpContainer';
import PopupContainer from '../../../components/PopUp';
import TabLongPressOptions from './TabLongPressOptions';

type TabProps = {
  i: Product;
  lastIndex?: boolean;
};

const Tab: React.FC<TabProps> = ({i, lastIndex = false}): React.JSX.Element => {
  const {currentTheme} = useTheme();
  const [openEditing, setOpenEditing] = useState<boolean>(false);
  const [openLongPressOptions, setOpenLongPressOptions] = useState<boolean>(false);

  const handleClickingTab = () => {
    setOpenEditing(true);
    console.log('viveribriu');
  };
  const handleOpenLongPressOptions=()=>setOpenLongPressOptions(true)
  const handleCloseLongPressOptions=()=>setOpenLongPressOptions(false)
  const handleCloseEditing=()=>setOpenEditing(false)
  return (
    <LongPressEnabled
      longPressCanceledAction={handleClickingTab}
      longPressAction={handleOpenLongPressOptions}>
      <View
        style={[
          styles.container,
          {
            marginBottom: lastIndex ? 70 : 6,
            backgroundColor: currentTheme.tabColor,
          },
        ]}>
        <View
          style={[styles.tabLabel, {backgroundColor: currentTheme.baseColor}]}>
          <Text
            style={[styles.productName, {color: currentTheme.contrastColor}]}>
            {i.name}
          </Text>
        </View>
        <View
          style={[
            styles.productInfoContainer,
            {backgroundColor: currentTheme.baseColor},
          ]}>
          <View style={styles.infoContainer}>
            <Text style={[styles.infoText, {color: currentTheme.tab.label}]}>
              Price: {i.basePrice}
            </Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={[styles.infoText, {color: currentTheme.tab.label}]}>
              Discounted price: {i.discountedPrice}
            </Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={[styles.infoText, {color: currentTheme.tab.label}]}>
              Includes: {i.quantity} {i.measurementType}
            </Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={[styles.infoText, {color: currentTheme.tab.label}]}>
              Total sold: {i.totalSold}
            </Text>
          </View>
        </View>
        <SlideUpContainer
          open={openEditing}
          close={handleCloseEditing}>
          <EditProduct product={i} close={handleCloseEditing} />
        </SlideUpContainer>
        <PopupContainer open={openLongPressOptions} close={handleCloseLongPressOptions} padding={true}>
          <TabLongPressOptions i={i} close={handleCloseLongPressOptions} />
        </PopupContainer>
      </View>
    </LongPressEnabled>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    justifyContent: 'space-between',
    borderRadius: 8,
    height: 150,
    width: 150,
  },
  tabLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    paddingVertical: 4,
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
    height: 80,
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
