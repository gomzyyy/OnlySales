import {View, Text, Modal, StyleSheet, Pressable} from 'react-native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import React from 'react';

type SlideUpContainerProps = {
  children: React.ReactNode;
  open: boolean;
  close: () => void;
  bgcolor?: string;
  padding?: boolean;
};

const SlideUpContainer: React.FC<SlideUpContainerProps> = ({
  children,
  open,
  close,
  bgcolor = 'rgba(0,0,0,0.8)',
  padding = false,
}): React.JSX.Element => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      statusBarTranslucent={true}
      visible={open}
      onRequestClose={close}
      hardwareAccelerated={true}
      >
      <Pressable
        style={[
          styles.childContainer,
          {backgroundColor: bgcolor, paddingHorizontal: padding ? 14 : 10},
        ]}
        onPress={close}>
        <Pressable onPress={e => e.stopPropagation()}>{children}</Pressable>
      </Pressable>
    </Modal>
  );
};
const styles = StyleSheet.create({
  childContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 10,
  },
});

export default SlideUpContainer;
