import {PropsWithChildren} from 'react';
import {useTheme} from '../hooks';
import {Text, View} from 'react-native';
import {colors} from '../utils/Constants';

type HeaderIconProps = PropsWithChildren<{
  label?: string;
  labelColor?: string;
  iconColor?: string;
  show?: boolean;
  showAlertDot?: boolean;
  alertDotColor?: string;
  alertContent?: number | string;
  paddingHorizontal?: number;
  paddingVertical?: number;
  horizontal?: boolean;
}>;

const HeaderIcon: React.FC<HeaderIconProps> = ({
  children,
  label,
  labelColor,
  iconColor,
  show = true,
  showAlertDot = false,
  alertDotColor,
  alertContent,
  paddingHorizontal = 5,
  paddingVertical = 3,
  horizontal = false,
}) => {
  const {currentTheme} = useTheme();
  if (show) {
    return (
      <View
        style={{
          backgroundColor: iconColor || currentTheme.contrastColor,
          paddingVertical,
          paddingHorizontal,
          borderRadius: 10,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          maxWidth: 60,
          flexDirection: horizontal ? 'row' : 'column',
        }}>
        {children}
        {label && label.trim().length !== 0 && (
          <Text
            style={{
              fontSize: 8,
              fontWeight: '900',
              color: labelColor || currentTheme.baseColor,
              textAlign: 'center',
            }}
            numberOfLines={2}>
            {label}
          </Text>
        )}
        {showAlertDot && (
          <View
            style={{
              position: 'absolute',
              borderRadius: 20,
              top: 3,
              right: 3,
              backgroundColor: alertDotColor || colors.danger,
              elevation: 10,
              height: 12,
              width: 12,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {(typeof alertContent === 'number' ||
              typeof alertContent === 'string') && (
              <Text style={{fontSize: 6, fontWeight: '600', color: '#fff'}}>
                {alertContent}
              </Text>
            )}
          </View>
        )}
      </View>
    );
  } else {
    return null;
  }
};
export default HeaderIcon;
