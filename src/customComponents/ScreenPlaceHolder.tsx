import {
  Modal,
  Pressable,
  ModalProps,
  StyleSheet,
  FlexStyle,
} from 'react-native';
import React, {ReactNode} from 'react';
import Animated from 'react-native-reanimated';
import {deviceHeight} from '../utils/Constants';

type ScreenPlaceHolderProps = {
  children: ReactNode;
  open: boolean;
  close: () => void;
  bgcolor?: string;
  padding?: boolean;
  opacity?: 0 | 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 1;
  position?: FlexStyle['position'];
} & ModalProps;

const ScreenPlaceHolder: React.FC<ScreenPlaceHolderProps> = ({
  children,
  close,
  open,
  bgcolor = 'rgba(0,0,0,0.6)',
  position = 'relative',
  ...props
}) => {
  return (
    <Modal
      transparent={true}
      statusBarTranslucent={true}
      visible={open}
      onRequestClose={close}
      hardwareAccelerated={true}
      {...props}>
      <Pressable
        style={[styles.childContainer, {backgroundColor: bgcolor, position}]}
        onPress={close}>
        <Pressable onPress={e => e.stopPropagation()}>
          <Animated.View>{children}</Animated.View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
const styles = StyleSheet.create({
  childContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  InnerContainer: {
    minHeight: deviceHeight * 0.3,
    borderRadius: 20,
    padding: 16,
    gap: 10,
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
export default ScreenPlaceHolder;
