import {View, FlatList, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import EmptyListMessage from './components/EmptyListMessage';
import SlideUpContainer from '../../components/SlideUpContainer';
import CreateCustomer from '../../components/CreateCustomer';
import Tab from './components/Tab';
import CreateButton from '../../components/CreateButton';
import SearchBar from './components/SearchBar';
import Header from '../../components/Header';
import {useAnalytics, useTheme} from '../../hooks';
import Icon from 'react-native-vector-icons/Octicons';
import {useHaptics} from '../../hooks';
import {deviceHeight} from '../../utils/Constants';
import {useTranslation} from 'react-i18next';
import HeaderIcon from '../../components/HeaderIcon';
import FallbackMessage from '../../components/FallbackMessage';

const Customers = () => {
  const {t} = useTranslation('customers');
  const {lightTap} = useHaptics();
  const {currentTheme} = useTheme();
  const [openCreateCustomer, setopenCreateCustomer] = useState<boolean>(false);
  const {customers} = useAnalytics();
  const handleCloseCreateCustomer = () => setopenCreateCustomer(false);
  const handleOpenCreateCustomer = () => {
    setopenCreateCustomer(true);
    lightTap();
  };
  return (
    <View style={{flex: 1, backgroundColor: currentTheme.contrastColor}}>
      <Header
        name={t('header_title')}
        backButton={true}
        titleColor={currentTheme.header.textColor}
        customComponent={true}
        curved
        headerBgColor={currentTheme.baseColor}
        renderItem={
          <HeaderIcon label="Add">
            <Icon name="plus" color={currentTheme.baseColor} size={20} />
          </HeaderIcon>
        }
        customAction={() => {
          setopenCreateCustomer(true);
          lightTap();
        }}
      />
      <View style={styles.contentContainer}>
        {!openCreateCustomer && (
          <CreateButton open={handleOpenCreateCustomer} />
        )}
        <View style={{flex: 1}}>
          <View style={styles.searchBarContainer}>
            {customers.length !== 0 && (
              <SearchBar textColor={currentTheme.header.textColor} enable />
            )}
          </View>
          {customers.length !== 0 ? (
            <FlatList
              data={[...customers].reverse()}
              keyExtractor={s => s._id}
              nestedScrollEnabled
              renderItem={({item, index}) => (
                <Tab i={item} lastIndex={customers.length - 1 === index} />
              )}
              style={{flex: 1, paddingBottom: 90}}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <FallbackMessage
              text={"No Customers yet, Tap '+' to create customer"}
            />
          )}
        </View>
      </View>
      {openCreateCustomer && (
        <SlideUpContainer
          open={openCreateCustomer}
          close={handleCloseCreateCustomer}
          height={deviceHeight * 0.58}
          // height= {deviceHeight * 0.82}
        >
          {/* <CreateUnknownPayment callback={handleCloseCreateCustomer} /> */}
          <CreateCustomer callback={handleCloseCreateCustomer} />
        </SlideUpContainer>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchBarContainer: {paddingVertical: 20},
  contentContainer: {flex: 1, paddingHorizontal: 10},
});

export default Customers;
