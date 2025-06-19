import {
  Modal,
  ModalProps,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {ReactNode, useEffect} from 'react';
import {deviceHeight} from '../utils/Constants';
import {useTheme} from '../hooks/index';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

type PopupContainerProps = {
  children: ReactNode;
  open: boolean;
  close: () => void;
  bgcolor?: string;
  padding?: boolean;
  opacity?: 0 | 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 1;
  usepadding?: boolean;
} & ModalProps;

const PopupContainer: React.FC<PopupContainerProps> = ({
  children,
  open,
  close,
  bgcolor = `rgba(0,0,0,${'0.5'})`,
  padding = false,
  opacity = 0.6,
  usepadding = true,
  ...props
}): React.JSX.Element => {
  const childScale = useSharedValue(0);
  const childY = useSharedValue(0);
  const childAnimation = useAnimatedStyle(() => ({
    transform: [{translateY: childY.value}, {scale: childScale.value}],
  }));
  const closeContainer = () => {
    childScale.value = withTiming(0, {duration: 260});
    childY.value = withTiming(
      deviceHeight * 0.6,
      {duration: 300},
      isFinished => {
        if (isFinished) {
          runOnJS(close)();
        }
      },
    );
  };
  useEffect(() => {
    childScale.value = withTiming(1, {duration: 260});
  }, []);
  return (
    <Modal
      transparent={true}
      statusBarTranslucent={true}
      visible={open}
      onRequestClose={closeContainer}
      hardwareAccelerated={true}
      {...props}>
      <Pressable
        style={[
          styles.childContainer,
          {
            backgroundColor: bgcolor,
            paddingHorizontal: usepadding ? (padding ? 20 : 10) : 0,
          },
        ]}
        onPress={closeContainer}>
        <Pressable onPress={e => e.stopPropagation()}>
          <Animated.View style={childAnimation}>{children}</Animated.View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

type CustomAlertProps = {open: boolean; close: () => void};

const Alert: React.FC<CustomAlertProps> = ({
  open,
  close,
}): React.JSX.Element => {
  const {currentTheme} = useTheme();

  return (
    <PopupContainer open={open} close={close} padding>
      <View
        style={[
          styles.InnerContainer,
          {backgroundColor: currentTheme.contrastColor},
        ]}></View>
    </PopupContainer>
  );
};

type CustomPromptProps = {open: boolean; close: () => void};

const Prompt: React.FC<CustomPromptProps> = ({
  open,
  close,
}): React.JSX.Element => {
  const {currentTheme} = useTheme();

  return (
    <PopupContainer open={open} close={close} padding>
      <View
        style={[
          styles.InnerContainer,
          {backgroundColor: currentTheme.contrastColor},
        ]}></View>
    </PopupContainer>
  );
};

type CustomConfirmProps = {
  open: boolean;
  close: () => void;
  label?: string;
  title: string;
  subTitle?: string;
  btnLabel1?: string;
  btnLabel2?: string;
  secondButton?: boolean;
};

const Confirm: React.FC<CustomConfirmProps> = ({
  open,
  close,
  label = 'Are you sure?',
  title,
  subTitle = '',
  btnLabel1 = 'OK',
  btnLabel2 = 'NO',
  secondButton = true,
}): React.JSX.Element => {
  const {currentTheme} = useTheme();

  return (
    <PopupContainer open={open} close={close} padding>
      <View
        style={[
          styles.InnerContainer,
          {backgroundColor: currentTheme.contrastColor},
        ]}>
        <Text style={styles.label}>{label}</Text>
        <View style={confirm.contentContainer}>
          <View style={confirm.titleContainer}>
            <Text style={confirm.title}>{title}</Text>
          </View>
          {subTitle.trim().length !== 0 && (
            <View style={confirm.subTitleContainer}>
              <Text style={confirm.subTitle}>{subTitle}</Text>
            </View>
          )}
        </View>
        <View style={confirm.submitContainer}>
          <TouchableOpacity style={confirm.actionButton}>
            <Text style={confirm.actionButtonText}>{btnLabel1}</Text>
          </TouchableOpacity>
          {secondButton && (
            <TouchableOpacity>
              <Text style={confirm.actionButtonText}>{btnLabel2}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </PopupContainer>
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
const confirm = StyleSheet.create({
  contentContainer: {
    flex: 1,
    marginTop: 10,
  },
  titleContainer: {paddingHorizontal: 18},
  title: {fontSize: 20, fontWeight: 'bold'},
  subTitleContainer: {},
  subTitle: {},
  submitContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    marginBottom: 15,
  },
  actionButton: {},
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export {Confirm, Alert, Prompt};

export default PopupContainer;
