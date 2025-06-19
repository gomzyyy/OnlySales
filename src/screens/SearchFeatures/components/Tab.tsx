import {Text, StyleSheet, View} from 'react-native';
import React from 'react';
import {Customer, Employee} from '../../../../types';
import {navigate} from '../../../utils/nagivationUtils';
import {useTheme} from '../../../hooks/index';
import LongPressEnabled from '../../../customComponents/LongPressEnabled';
const NoPhoto = require('../../../assets/images/no-profile.jpg');
import {ToolsData} from '../../SearchFeatures/SearchFeatures';
import LinearGradient from 'react-native-linear-gradient';

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

  const handleLongPressCancelAction = (route: string) => navigate(route);

  return (
    <LongPressEnabled
      longPressCanceledAction={() => handleLongPressCancelAction(i.navigateTo)}
      longPressAction={() => {}}
      dummy={i.disabled}>
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
      </LinearGradient>
    </LongPressEnabled>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    paddingVertical: 12,
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
    fontSize: 22,
    fontWeight: '500',
  },
});

export default Tab;
