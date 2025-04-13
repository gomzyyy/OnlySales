import {View, Text, StyleSheet, ScrollView} from 'react-native';
import React, {useState} from 'react';
import Header from '../../components/Header';
import Icon from 'react-native-vector-icons/AntDesign';
import {deviceHeight, deviceWidth} from '../../utils/Constants';
import {useSelector} from 'react-redux';
import {RootState} from '../../../store/store';
import Tab from './components/Tab';
import SlideUpContainer from '../../components/SlideUpContainer';
import AddProduct from './components/AddProduct';
import EmptyListMessage from '../../components/EmptyListMessage';
import {useAnalytics, useTheme} from '../../hooks/index';
import {AdminRole} from '../../../enums';
import {Employee, Owner, Partner} from '../../../types';

const MyInventory = () => {
  const {currentTheme} = useTheme();
  const {owner} = useAnalytics();
  const user = useSelector((s: RootState) => s.appData.user)!;

  const inventoryItems = owner?.inventory || [];
  const [openAddProduct, setOpenAddProduct] = useState<boolean>(false);
  const handleAddButton = () => setOpenAddProduct(true);

  const AddInventoryItemIcon = (): React.JSX.Element => {
    return (
      <View style={{flexDirection: 'row', gap: 4, alignItems: 'center'}}>
        <Icon name="plus" color={currentTheme.header.textColor} size={20} />
        <Text style={{fontSize: 16, color: currentTheme.header.textColor}}>
          Add Item
        </Text>
      </View>
    );
  };

  return (
    <View
      style={[styles.parent, {backgroundColor: currentTheme.contrastColor}]}>
      <Header
        name={`${user.name}`}
        backButtom
        customComponent={true}
        renderItem={<AddInventoryItemIcon />}
        customAction={handleAddButton}
        titleColor={currentTheme.header.textColor}
        headerBgColor={currentTheme.baseColor}
        curved={true}
      />
      <View style={styles.contentContainer}>
        {inventoryItems.length === 0 ? (
          <EmptyListMessage
            title="No Items in your inventory!"
            context="Click on PLUS button to add a new item."
            textColor={currentTheme.contrastColor}
          />
        ) : (
          <ScrollView
            contentContainerStyle={styles.listContainer}
            showsHorizontalScrollIndicator={false}
            nestedScrollEnabled={true}>
            {inventoryItems.map((s, i) => (
              <Tab i={s} key={i} />
            ))}
          </ScrollView>
        )}
      </View>
      <View style={styles.assistTextContainer}>
        <Text style={[styles.assistText, {color: currentTheme.contrastColor}]}>
          Click to edit Inventory item.
        </Text>
      </View>
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
    marginTop: 20,
  },
  listContainer: {
    // justifyContent: 'space-evenly',
    // flexWrap: 'wrap',
  },
  assistTextContainer: {
    position: 'absolute',
    bottom: 6,
    width: deviceWidth,
    paddingVertical: 20,
  },
  assistText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default MyInventory;
