import {Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import {useTheme} from '../../../../hooks/index';

type TabProps = {
  title: string;
  onPress?:()=>void
};

const Tab: React.FC<TabProps> = ({title,onPress}): React.JSX.Element => {
  const {currentTheme} = useTheme();

  const handleOnPress=()=>{
    if(onPress){
      onPress()
    }else{
      return;
    }
  }

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.container, {marginBottom: 6,    backgroundColor: currentTheme.tab.bg,
      }]}
      onPress={handleOnPress}
      >
      <Text style={[styles.label,{color: currentTheme.tab.label,
}]}>{title}</Text>
      <Icon name="right" color={currentTheme.tab.icon} size={22} />
    </TouchableOpacity>
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
  label: {
    fontSize: 22,
    fontWeight: '400',
  },
});

export default Tab;
