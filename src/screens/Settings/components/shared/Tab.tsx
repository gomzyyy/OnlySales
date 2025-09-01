import {Text, StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import {useTheme} from '../../../../hooks/index';

type TabProps = {
  title: string;
  description?: string;
  onPressNavigate?: () => void;
  onPress?: () => void | Promise<void>;
};

const Tab: React.FC<TabProps> = ({
  title,
  onPress,
  description,
  onPressNavigate,
}): React.JSX.Element => {
  const {currentTheme} = useTheme();

  const handleOnPress = () => {
    if (onPress) {
      onPress();
      return;
    } else if (onPressNavigate) {
      onPressNavigate();
    } else {
      return;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.container, {marginBottom: 6, backgroundColor: '#f2f2f2'}]}
      onPress={handleOnPress}>
      <View style={{width: '80%', gap: 1}}>
        <Text style={[styles.label, {color: currentTheme.tab.label}]}>
          {title}
        </Text>
        <Text
          style={[styles.description, {color: currentTheme.tab.label}]}
          numberOfLines={1}>
          {description}
        </Text>
      </View>
      <Icon name="right" color={currentTheme.tab.icon} size={22} />
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 8,
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
  },
  description: {
    fontSize: 12,
    fontWeight: '400',
  },
});

export default Tab;
