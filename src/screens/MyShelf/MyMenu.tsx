import {View, Text, StyleSheet, ScrollView} from 'react-native';
import React, {useState} from 'react';
import Header from '../../components/Header';
import Icon from 'react-native-vector-icons/AntDesign';
import {deviceWidth} from '../../utils/Constants';
import {useSelector} from 'react-redux';
import {RootState} from '../../../store/store';
import Tab from './components/Tab';
import SlideUpContainer from '../../components/SlideUpContainer';
import {Product} from '../../../types';
import EditProduct from './components/EditCreateProduct';
import AddProduct from './components/AddProduct';
import EmptyListMessage from '../../components/EmptyListMessage';
import useTheme from '../../hooks/useTheme';

const MyMenu = () => {
  const {currentTheme} = useTheme();

  const shopkeeper = useSelector((s: RootState) => s.shopkeeper.shopkeeper);
  const menuItems = useSelector((s: RootState) => s.shopkeeper.shopkeeper.menu);
  const [openEditing, setOpenEditing] = useState<boolean>(false);
  const [openAddProduct, setOpenAddProduct] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(
    undefined,
  );

  const handleClickingTab = (product: Product) => {
    setSelectedProduct(product);
    setOpenEditing(true);
  };
  const handleAddButton = () => {
    setOpenAddProduct(true);
  };
  return (
    <View
      style={[styles.parent, {backgroundColor: currentTheme.contrastColor}]}>
      <Header
        name={`${shopkeeper.name}`}
        backButtom
        customComponent={true}
        renderItem={
          <Icon name="plus" color={currentTheme.textColor} size={24} />
        }
        customAction={handleAddButton}
      />
      <View style={styles.contentContainer}>
        {menuItems.length === 0 ? (
          <EmptyListMessage
            title="No Items in your menu!"
            context="Click on PLUS button to add a new item."
          />
        ) : (
          <ScrollView
            contentContainerStyle={styles.listContainer}
            showsHorizontalScrollIndicator={false}
            nestedScrollEnabled={true}>
            {menuItems.map((s, i) => (
              <Tab i={s} key={i} onPress={handleClickingTab} />
            ))}
          </ScrollView>
        )}
      </View>
      <View style={styles.assistTextContainer}>
        <Text style={styles.assistText}>Click to edit Menu item.</Text>
      </View>
      {selectedProduct && (
        <SlideUpContainer
          open={openEditing}
          close={() => setOpenEditing(false)}>
          <EditProduct
            product={selectedProduct}
            close={() => setOpenEditing(false)}
          />
        </SlideUpContainer>
      )}
      {openAddProduct && (
        <SlideUpContainer
          open={openAddProduct}
          close={() => setOpenAddProduct(false)}>
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
  },
  listContainer: {
    // alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    flexWrap: 'wrap',
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

export default MyMenu;
