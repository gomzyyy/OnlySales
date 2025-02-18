import {View, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Entypo';

type CreateButtomProps = {
  openCreateCustomer: () => void;
};

const CreateButton: React.FC<CreateButtomProps> = ({
  openCreateCustomer,
}): React.JSX.Element => {
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.8}
      onPress={openCreateCustomer}>
      <View>
        <Icon name="circle-with-plus" size={26} color={'white'} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 80,
    right: 40,
    padding: 18,
    zIndex:99,
    backgroundColor: 'purple',
    boxSizing: 'border-box',
    borderRadius: '40%',
  },
});

export default CreateButton;
