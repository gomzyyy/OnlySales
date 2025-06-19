import {ReactNode} from 'react';
import {useTheme} from '../hooks';
import {Text, View} from 'react-native';
import {colors} from '../utils/Constants';

const HeaderIcon = ({
  children,
  label,
  show = true,
  showAlertDot = false,
  alertContent,
}: {
  children: ReactNode;
  label?: string;
  show?: boolean;
  showAlertDot?: boolean;
  alertContent?: number;
}) => {
  console.log(alertContent)
  const {currentTheme} = useTheme();
  if (show) {
    return (
      <View
        style={{
          backgroundColor: currentTheme.contrastColor,
          paddingVertical: 3,
          paddingHorizontal: 5,
          borderRadius: 10,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
        }}>
        {children}
        <Text
          style={{
            fontSize: 8,
            fontWeight: '900',
            color: currentTheme.baseColor,
          }}>
          {label}
        </Text>
        {showAlertDot && (
          <View
            style={{
              position: 'absolute',
              borderRadius: 20,
              top: 3,
              right: 3,
              backgroundColor: colors.danger,
              elevation: 10,
              height: 10,
              width: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {typeof alertContent === 'number' && (
              <Text style={{fontSize: 6,fontWeight:'600', color: '#fff'}}>{alertContent}</Text>
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
