import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {ReactNode} from 'react';
import {deviceHeight} from '../utils/Constants';
import {useTheme} from '../hooks/index';

type PopupContainerProps = {
  children: ReactNode;
  open: boolean;
  close: () => void;
  bgcolor?: string;
  padding?: boolean;
};

const PopupContainer: React.FC<PopupContainerProps> = ({
  children,
  open,
  close,
  bgcolor = 'rgba(0,0,0,0.1)',
  padding = false,
}): React.JSX.Element => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      statusBarTranslucent={true}
      visible={open}
      onRequestClose={close}
      hardwareAccelerated={true}>
      <Pressable
        style={[
          styles.childContainer,
          {backgroundColor: bgcolor, paddingHorizontal: padding ? 20 : 10},
        ]}
        onPress={close}>
        <Pressable onPress={e => e.stopPropagation()}>{children}</Pressable>
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
        ]}>
        {' '}
      </View>
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
