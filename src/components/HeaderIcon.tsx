import {ReactNode} from 'react';
import {useTheme} from '../hooks';
import {Text, View} from 'react-native';

const HeaderIcon = ({
  children,
  label,
  show = true,
}: {
  children: ReactNode;
  label?: string;
  show?: boolean;
}) => {
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
      </View>
    );
  } else {
    return null;
  }
};
export default HeaderIcon;
