import {View, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Entypo';
import {useTheme} from '../hooks/index';

type CreateButtomProps = {
  open: () => void;
};

const CreateButton: React.FC<CreateButtomProps> = ({
  open,
}): React.JSX.Element => {
  const {currentTheme} = useTheme();
  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: currentTheme.baseColor,
          borderColor: currentTheme.contrastColor,
        },
      ]}
      activeOpacity={0.8}
      onPress={open}>
      <View>
        <Icon
          name="circle-with-plus"
          size={26}
          color={currentTheme.contrastColor}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 80,
    right: 40,
    padding: 16,
    zIndex: 99,
    boxSizing: 'border-box',
    borderRadius: '40%',
    borderWidth: 3,
    elevation: 30,
  },
});

export default CreateButton;
