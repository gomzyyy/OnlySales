import {View, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Entypo';
import {useTheme} from '../hooks/index';

type CreateButtomProps = {
  openCreateCustomer: () => void;
};

const CreateButton: React.FC<CreateButtomProps> = ({
  openCreateCustomer,
}): React.JSX.Element => {
  const {currentTheme} = useTheme();
  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: currentTheme.contrastColor,
          borderColor: currentTheme.baseColor,
        },
      ]}
      activeOpacity={0.8}
      onPress={openCreateCustomer}>
      <View>
        <Icon
          name="circle-with-plus"
          size={26}
          color={currentTheme.baseColor}
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
    elevation:30,
  },
});

export default CreateButton;
