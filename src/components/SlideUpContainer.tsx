import {Modal, StyleSheet, Pressable} from 'react-native';
import React, {PropsWithChildren} from 'react';

type SlideUpContainerProps = PropsWithChildren<{
  open: boolean;
  close: () => void;
  opacity?: 0 | 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 1;
  padding?: boolean;
}>;

const SlideUpContainer: React.FC<SlideUpContainerProps> = ({
  children,
  open,
  close,
  opacity = 0.1,
  padding = false,
}): React.JSX.Element => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      statusBarTranslucent={true}
      visible={open}
      onRequestClose={close}
      hardwareAccelerated={true}>
      <Pressable
        style={[
          styles.childContainer,
          {
            backgroundColor: `rgba(0,0,0,${opacity})`,
            paddingHorizontal: padding ? 14 : 10,
          },
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
