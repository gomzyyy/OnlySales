import {View, Text, Modal, StyleSheet} from 'react-native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import React from 'react';

type CreateCustomerProps = {
  open: boolean;
  close: () => void;
};

const CreateCustomer: React.FC<CreateCustomerProps> = ({
  open,
  close,
}): React.JSX.Element => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{flex: 1}}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={open}
          onRequestClose={close}
          style={styles.modal}>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>Modal</Text>
          </View>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};
const styles = StyleSheet.create({
  modal: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
});

export default CreateCustomer;
