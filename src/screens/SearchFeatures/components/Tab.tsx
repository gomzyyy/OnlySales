import {Text, StyleSheet, View, Image} from 'react-native';
import React, {useState} from 'react';
import {Customer, Employee} from '../../../../types';
import Icon from 'react-native-vector-icons/AntDesign';
import {navigate} from '../../../utils/nagivationUtils';
import {useTheme} from '../../../hooks/index';
import LongPressEnabled from '../../../customComponents/LongPressEnabled';
import SlideUpContainer from '../../../components/SlideUpContainer';
import PopupContainer from '../../../components/PopUp';
import {deviceHeight} from '../../../utils/Constants';
const NoPhoto = require('../../../assets/images/no-profile.jpg');
import {ToolsData} from '../../SearchFeatures/SearchFeatures';

const EditCustomer = React.lazy(
  () => import('../../../components/EditCustomer'),
);

type TabProps = {
  i: ToolsData;
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
  const handleLongPressCancelAction = (route: string) =>
    navigate(route, {customer: i});

  return (
    <LongPressEnabled
      longPressCanceledAction={() => handleLongPressCancelAction(i.navigateTo)}
      longPressAction={handleOpenLongPressOptions}
      dummy={i.disabled}>
      <View
        style={[
          styles.container,
          {
            marginBottom: lastIndex ? 70 : 6,
            backgroundColor: currentTheme.tab.bg,
          },
        ]}>
        <View>{i.icon(currentTheme.contrastColor)}</View>
        <View>
          <Text
            style={{
              color: currentTheme.baseColor,
              fontSize: 18,
              fontWeight: '600',
            }}>
            {i.title}
          </Text>
        </View>
      </View>
    </LongPressEnabled>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    borderRadius: 8,
    alignItems: 'center',
    gap: 12,
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
    fontSize: 22,
    fontWeight: '500',
  },
});

export default Tab;