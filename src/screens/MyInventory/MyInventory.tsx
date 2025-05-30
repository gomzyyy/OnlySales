import {View, Text, StyleSheet, ScrollView} from 'react-native';
import React, {useState} from 'react';
import Header from '../../components/Header';
import Icon from 'react-native-vector-icons/Octicons';
import {deviceHeight} from '../../utils/Constants';
import {useSelector} from 'react-redux';
import {RootState} from '../../../store/store';
import Tab from './components/Tab';
import SlideUpContainer from '../../components/SlideUpContainer';
import AddProduct from './components/AddProduct';
import {useAnalytics, useTheme} from '../../hooks/index';
import {useTranslation} from 'react-i18next';

const MyInventory = () => {
  const {currentTheme} = useTheme();
  const {t} = useTranslation('inventory');
  const {owner} = useAnalytics();
  const user = useSelector((s: RootState) => s.appData.user)!;

  const inventoryItems =
    owner?.inventory.filter(s => s.disabled === false) || [];
  const [openAddProduct, setOpenAddProduct] = useState<boolean>(false);
  const handleAddButton = () => setOpenAddProduct(true);

  const AddInventoryItemIcon = (): React.JSX.Element => {
    return (
      <View style={{flexDirection: 'row', gap: 4, alignItems: 'center'}}>
        <Icon name="plus-circle" color={currentTheme.header.textColor} size={24} />
        {/* <Text style={{fontSize: 16, color: currentTheme.header.textColor}}>
          {t('i_add_item')}
        </Text> */}
      </View>
    );
  };

  return (
    <View
      style={[styles.parent, {backgroundColor: currentTheme.contrastColor}]}>
      <Header
        name={'Inventory'}
        backButton
        customComponent={true}
        renderItem={<AddInventoryItemIcon />}
        customAction={handleAddButton}
        titleColor={currentTheme.header.textColor}
        headerBgColor={currentTheme.baseColor}
        curved={true}
      />
      <View style={styles.contentContainer}>
        {inventoryItems.length > 0 && (
          <ScrollView
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            nestedScrollEnabled={true}
            style={{flex: 1}}>
            {inventoryItems.map((s, i) => (
              <Tab i={s} key={i} />
            ))}
          </ScrollView>
        )}
      </View>
      {/* <View style={[styles.assistTextContainer, {backgroundColor: currentTheme.fadeColor}]}>
        <Text style={[styles.assistText, {color: currentTheme.contrastColor}]}>
          {inventoryItems.length === 0
            ? t('i_inventory_empty')
            : t('i_inventory_edit_hint')}
        </Text>
      </View> */}
      {openAddProduct && (
        <SlideUpContainer
          open={openAddProduct}
          close={() => setOpenAddProduct(false)}
          height={deviceHeight * 0.62}>
          <AddProduct close={() => setOpenAddProduct(false)} />
        </SlideUpContainer>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 10,
    marginTop: 10,
    flex: 1,
  },
  listContainer: {
    // justifyContent: 'space-evenly',
    // flexWrap: 'wrap',
  },
  assistTextContainer: {
    position: 'absolute',
    bottom: 12,
    paddingVertical: 4,
    paddingHorizontal:8,
    borderRadius: 10,
    alignSelf:'center'
  },
  assistText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default MyInventory;
