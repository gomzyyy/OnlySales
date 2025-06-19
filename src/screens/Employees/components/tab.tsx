import {Text, StyleSheet, View} from 'react-native';
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
import {Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
const EditEmployee = React.lazy(
  () => import('../../../components/EditEmployee'),
);
const NoPhoto = require('../../../assets/images/no-profile.jpg');

type TabProps = {
  i: Employee;
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
  const handleLongPressCancelAction = () =>
    navigate('Employee', {employeeId: i._id});

  return (
    <LongPressEnabled
      longPressCanceledAction={handleLongPressCancelAction}
      longPressAction={handleOpenLongPressOptions}
      dummy={dummy}>
      <LinearGradient
        colors={[currentTheme.fadeColor, currentTheme.contrastColor]}
        start={{x: 0, y: 0}}
        style={[
          styles.container,
          {
            marginBottom: lastIndex ? 70 : 6,
            borderLeftColor: currentTheme.baseColor,
          },
        ]}>
        <View style={{height: 50, width: 50, overflow: 'hidden'}}>
          <Image
            source={
              i.image && i.image.trim().length !== 0 ? {uri: i.image} : NoPhoto
            }
            style={[styles.profileImage, {borderColor: currentTheme.baseColor}]}
          />
        </View>
        <View style={styles.innerContainer}>
          <View style={{flex: 7}}>
            <Text
              numberOfLines={1}
              style={[styles.customerName, {color: currentTheme.tab.label}]}>
              {i.name}
            </Text>
          </View>
          {openTabOptions && i && (
            <PopupContainer
              open={openTabOptions}
              close={handleCloseLongPressOptions}
              padding={true}>
              <TabLongPressOptions
                triggerEdit={handleOpenEditCustomer}
                i={i}
                close={handleCloseLongPressOptions}
              />
            </PopupContainer>
          )}
        </View>
      </LinearGradient>
    </LongPressEnabled>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderLeftWidth: 2,
  },
  profileImage: {
    height: 50,
    width: 50,
    resizeMode: 'cover',
    borderRadius: 16,
  },
  innerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  absolute: {
    position: 'absolute',
  },
  customerName: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default Tab;
