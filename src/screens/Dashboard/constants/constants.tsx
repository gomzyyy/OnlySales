import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import Icon3 from 'react-native-vector-icons/MaterialIcons';
import Icon5 from 'react-native-vector-icons/FontAwesome5';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {PropsWithChildren, ReactNode} from 'react';
import {useHaptics, useTheme} from '../../../hooks';
import {navigate} from '../../../utils/nagivationUtils';
import {DropDownOptionsType} from '../components/animated/DropDownMenu';

export const ToolsIconContainer = ({
  children,
  label,
}: {
  children?: ReactNode;
  label?: string;
}) => {
  const {currentTheme} = useTheme();
  return (
    <View
      style={[
        iconStyles.iconContainer,
        {backgroundColor: currentTheme.baseColor},
      ]}>
      {children ? (
        children
      ) : (
        <Text
          style={[iconStyles.iconText, {color: currentTheme.contrastColor}]}>
          {label}
        </Text>
      )}
    </View>
  );
};

const iconStyles = StyleSheet.create({
  iconContainer: {
    paddingVertical: 5,
    paddingHorizontal: 7,
    borderRadius: 4,
  },
  iconText: {
    fontSize: 20,
    fontWeight: '600',
  },
});

type ToolsData = {
  id: number;
  title: string;
  navigateTo: string;
  icon: (color?: string) => React.JSX.Element;
  keywords: string[];
  disabled: boolean;
};

type QuickStartTabProps = PropsWithChildren<{
  title: string;
  pressAction?: () => void;
}>;

export const QuickStartTab: React.FC<QuickStartTabProps> = ({
  pressAction,
  title,
  children,
}): React.JSX.Element => {
  const {currentTheme} = useTheme();
  const {lightTap} = useHaptics();
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.pressableContainer,
        {backgroundColor: currentTheme.baseColor},
      ]}
      onPress={() => {
        lightTap;
        pressAction && pressAction();
      }}>
      {children}
      <Text
        style={[styles.pressableText, {color: currentTheme.header.textColor}]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  pressableContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 16,
    height: 60,
    width: 150,
    justifyContent: 'center',
  },
  pressableText: {fontSize: 22, fontWeight: 'bold'},
});

export const pressAction = [
  {
    id: 1,
    title: 'Sell Product',
    navigateTo: 'EMICalculator',
    icon: (color: string) => <Icon2 name="sell" color={color} size={22} />,
    keyWords: ['emi', 'calculator', 'interest', 'loan'],
  },
];

export const dropDownOptions: DropDownOptionsType[] = [
  {
    id: 0,
    name: 'Run A Query',
    navigateTo: undefined,
    icon: (color: string = '#000', size: number = 16) => (
      <Icon5 color={color} name="code" size={size} />
    ),
    onPress: (cb?: () => void) => cb && cb(),
  },
  {
    id: 1,
    name: 'Help',
    navigateTo: 'Settings',
    icon: (color: string = '#000', size: number = 16) => (
      <Icon3 color={color} name="help" size={size} />
    ),
    onPress: (cb?: () => void) => cb && cb(),
  },
];
