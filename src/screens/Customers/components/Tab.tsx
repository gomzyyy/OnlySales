import {Text, StyleSheet, View, Image} from 'react-native';
import React, {useState} from 'react';
import {Customer, Employee} from '../../../../types';
import Icon from 'react-native-vector-icons/AntDesign';
import {navigate} from '../../../utils/nagivationUtils';
import {useTheme} from '../../../hooks/index';
import LongPressEnabled from '../../../customComponents/LongPressEnabled';
import SlideUpContainer from '../../../components/SlideUpContainer';
import PopupContainer from '../../../components/PopUp';
import TabLongPressOptions from './TabLongPressOptions';
import {deviceHeight} from '../../../utils/Constants';
const NoPhoto = require('../../../assets/images/no-profile.jpg');

const EditCustomer = React.lazy(
  () => import('../../../components/EditCustomer'),
);

type TabProps = {
  i: Customer;
  lastIndex?: boolean;
  handleOpenLongPressOptions?: (customer: Customer) => void;
  dummy?: boolean;
};

const Tab: React.FC<TabProps> = ({
  i,
  lastIndex = false,
  dummy = false,
}): React.JSX.Element => {
  const {currentTheme} = useTheme();
  const [openTabOptions, setOpenTabOptions] = useState<boolean>(false);
  const [openEditCustomer, setOpenEditCustomer] = useState<boolean>(false);

  const handleOpenLongPressOptions = () => {
    setOpenTabOptions(true);
  };
  const handleCloseLongPressOptions = () => setOpenTabOptions(false);
  const handleOpenEditCustomer = () => {
    setOpenTabOptions(false);
    setOpenEditCustomer(true);
  };
  const handleCloseEditCustomer = () => setOpenEditCustomer(false);
  const handleLongPressCancelAction = () => navigate('Customer', {customer: i});

  return (
    <LongPressEnabled
      longPressCanceledAction={handleLongPressCancelAction}
      longPressAction={handleOpenLongPressOptions}
      dummy={dummy}>
      <View
        style={[
          styles.container,
          {
            marginBottom: lastIndex ? 70 : 6,
            backgroundColor: currentTheme.tab.bg,
          },
        ]}>
        <View style={{height: 50, width: 50, overflow: 'hidden'}}>
          <Image
            source={
              i.image && i.image.trim().length !== 0 ? {uri: i.image} : NoPhoto
            }
            style={[styles.profileImage,{borderColor:currentTheme.baseColor}]}
          />
        </View>
        <View style={styles.innerContainer}>
          <Text style={[styles.customerName, {color: currentTheme.tab.label}]}>
            {i.name}
          </Text>

          <Icon name="right" color={currentTheme.tab.icon} size={22} />
          {openTabOptions && i && (
            <PopupContainer
              open={openTabOptions}
              close={handleCloseLongPressOptions}
              padding>
              <TabLongPressOptions
                triggerEdit={handleOpenEditCustomer}
                i={i}
                close={handleCloseLongPressOptions}
              />
            </PopupContainer>
          )}
        </View>

        {openEditCustomer && i && (
          <SlideUpContainer
            open={openEditCustomer}
            close={handleCloseEditCustomer}
            opacity={0.8}
            height={deviceHeight * 0.52}>
            <EditCustomer i={i} close={handleCloseEditCustomer} />
          </SlideUpContainer>
        )}
      </View>
    </LongPressEnabled>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    flexDirection: 'row',
    borderRadius: 8,
    alignItems: 'center',
    gap:12
  },
  profileImage: {
    height: 50,
    width: 50,
    resizeMode: 'cover',
    borderRadius: 16,
  },
  innerContainer:{
    flexDirection: 'row',
    justifyContent:'space-between',
    flex:1
  },
  absolute: {
    position: 'absolute',
  },
  customerName: {
    fontSize: 22,
    fontWeight: '500',
  },
});

export default Tab;
