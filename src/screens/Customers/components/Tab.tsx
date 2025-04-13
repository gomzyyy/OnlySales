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
import { deviceHeight } from '../../../utils/Constants';
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
    paddingVertical: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 8,
  },
  absolute: {
    position: 'absolute',
  },
  customerName: {
    fontSize: 20,
    fontWeight: '400',
  },
});

export default Tab;
