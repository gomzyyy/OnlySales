import {View, Text, Modal, StyleSheet, Pressable} from 'react-native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import React from 'react';

type SlideUpContainerProps = {
  children: React.ReactNode;
  open: boolean;
  close: () => void;
};

const SlideUpContainer: React.FC<SlideUpContainerProps> = ({
  children,
  open,
  close,
}): React.JSX.Element => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{flex: 1}}>
        <Modal
          animationType="slide"
          transparent={true}
          statusBarTranslucent
          visible={open}
          onRequestClose={close}
          style={styles.modal}>
          <Pressable style={styles.childredContainer} onPress={close}>
            <Pressable onPress={e => e.stopPropagation()}>
              {children}
              </Pressable>
          </Pressable>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};
const styles = StyleSheet.create({
  modal: {
    margin: 20,
    borderRadius: 20,
    padding: 35,
  },
  childredContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
});

export default SlideUpContainer;
