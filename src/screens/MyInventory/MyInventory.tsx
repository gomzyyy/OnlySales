import {View, StyleSheet, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../../components/Header';
import Icon from 'react-native-vector-icons/Octicons';
import {deviceHeight} from '../../utils/Constants';
import Tab from './components/Tab';
import SlideUpContainer from '../../components/SlideUpContainer';
import AddProduct from './components/AddProduct';
import {useAnalytics, useTheme, useTTS} from '../../hooks/index';
import {useTranslation} from 'react-i18next';
import HeaderIcon from '../../components/HeaderIcon';
import FallbackMessage from '../../components/FallbackMessage';

const MyInventory = () => {
  const {currentTheme} = useTheme();
  const {t} = useTranslation('inventory');
  const {getLanguages} = useTTS();
  const {owner} = useAnalytics();
  const [openAddProduct, setOpenAddProduct] = useState<boolean>(false);
  const handleAddButton = () => setOpenAddProduct(true);

  useEffect(() => {
    (async () => {
      const res = await getLanguages();
      console.log(res);
    })();
  }, []);

  return (
    <View
      style={[styles.parent, {backgroundColor: currentTheme.contrastColor}]}>
      <Header
        name={'Inventory'}
        backButton
        customComponent={true}
        renderItem={
          <HeaderIcon label="Add">
            <Icon name="plus" color={currentTheme.baseColor} size={20} />
          </HeaderIcon>
        }
        customAction={handleAddButton}
        titleColor={currentTheme.header.textColor}
        headerBgColor={currentTheme.baseColor}
        curved={true}
      />
      <View style={styles.contentContainer}>
        {owner.inventory.length !== 0 ? (
          <ScrollView
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            nestedScrollEnabled={true}
            style={{flex: 1}}>
            {owner.inventory.map((s, i) => (
              <Tab i={s} key={i} />
            ))}
          </ScrollView>
        ) : (
          <FallbackMessage text={t('i_inventory_empty')} />
        )}
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
    marginTop: 10,
    flex: 1,
    alignItems: 'center',
  },
  listContainer: {
    // justifyContent: 'space-evenly',
    // flexWrap: 'wrap',
  },
});

export default MyInventory;
