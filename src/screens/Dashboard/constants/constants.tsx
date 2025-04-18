import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import Icon3 from 'react-native-vector-icons/AntDesign';
import {Text, View} from 'react-native';
import {ReactNode} from 'react';
import {useTheme} from '../../../hooks';

export const ToolsIconContainer = ({children}: {children: ReactNode}) => {
  const {currentTheme} = useTheme();
  return (
    <View style={{backgroundColor: currentTheme.baseColor}}>{children}</View>
  );
};

export const tools_data = [
  {
    id: 1,
    title: 'EMI Calculator',
    navigateTo: 'EMICalculator',
    icon: (
      <ToolsIconContainer>
        <Text></Text>
      </ToolsIconContainer>
    ),
    keyWords: ['emi', 'calculator', 'interest', 'loan'],
  },
];
