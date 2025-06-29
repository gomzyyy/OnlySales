import {ReactNode,PropsWithChildren} from 'react';
import {useTheme} from '../hooks';
import {Text, View} from 'react-native';
import {colors} from '../utils/Constants';

type HeaderIconProps=PropsWithChildren<{
  label?: string;
  show?: boolean;
  showAlertDot?: boolean;
  alertContent?: number;
  paddingHorizontal?:number;
   paddingVertical?:number;
   horizontal?:boolean;
}>

const HeaderIcon:React.FC<HeaderIconProps> = ({
  children,
  label,
  show = true,
  showAlertDot = false,
  alertContent,
  paddingHorizontal=5,
  paddingVertical=3,
  horizontal=false
} ) => {
  const {currentTheme} = useTheme();
  if (show) {
    return (
      <View
        style={{
          backgroundColor: currentTheme.contrastColor,
          paddingVertical,
          paddingHorizontal,
          borderRadius: 10,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          maxWidth:60,
          flexDirection: horizontal ? 'row' : 'column'
        }}>
        {children}
        <Text
          style={{
            fontSize: 8,
            fontWeight: '900',
            color: currentTheme.baseColor,
            textAlign:'center'
          }}
          numberOfLines={2}
          >
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
