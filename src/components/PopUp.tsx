import {
  Modal,
  ModalProps,
  Pressable,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {
  forwardRef,
  ReactNode,
  useEffect,
  useImperativeHandle,
} from 'react';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
// import { CircleCheck, Info, TriangleAlert } from 'lucide-react-native';
import TriangleAlert from 'react-native-vector-icons/Feather'
import Check from 'react-native-vector-icons/AntDesign'

const PopupAnimationTiming = {
  in: 200,
  out: 200,
};

const deviceHeight = Dimensions.get('window').height;

type PopupContainerProps = {
  children: ReactNode;
  open: boolean;
  close: () => void;
  bgcolor?: string;
  padding?: boolean;
  opacity?: 0 | 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 1;
  usepadding?: boolean;
} & ModalProps;

export type PopupContainerRef = {
  closeContainer: () => void;
};

const PopupContainer = forwardRef<PopupContainerRef, PopupContainerProps>(
  (
    {
      children,
      open,
      close,
      bgcolor = 'rgba(0,0,0,0.5)',
      padding = false,
      usepadding = true,
      ...props
    },
    ref
  ) => {
    const childScale = useSharedValue(0.8);
    const childY = useSharedValue(0);
    const childOpacity = useSharedValue(0);

    const childAnimation = useAnimatedStyle(() => ({
      transform: [{ scale: childScale.value }],
      opacity: childOpacity.value,
    }));

    const closeContainer = () => {
      childScale.value = withTiming(0.4, {
        duration: PopupAnimationTiming.out,
      });
      childOpacity.value = withTiming(0, {
        duration: PopupAnimationTiming.out,
      });
      childY.value = withTiming(
        deviceHeight * 0.6,
        { duration: PopupAnimationTiming.out },
        (isFinished) => {
          if (isFinished) {
            runOnJS(close)();
          }
        }
      );
    };

    useEffect(() => {
      if (open) {
        childScale.value = 0.8;
        childY.value = deviceHeight * 0.6;
        childOpacity.value = 0;

        childOpacity.value = withTiming(1, {
          duration: PopupAnimationTiming.in
        });
        childScale.value = withTiming(1, { duration: PopupAnimationTiming.in });
        childY.value = withTiming(0, { duration: PopupAnimationTiming.in });
      }
    }, [open]);

    // EXPOSED ANIMATED CLOSE METHOD
    useImperativeHandle(ref, () => ({
      closeContainer,
    }));

    return (
      <Modal
        transparent={true}
        statusBarTranslucent={true}
        visible={open}
        onRequestClose={closeContainer}
        hardwareAccelerated={true}
        {...props}
      >
        <Pressable
          style={[
            styles.childContainer,
            {
              backgroundColor: bgcolor,
              paddingHorizontal: usepadding ? (padding ? 20 : 10) : 0,
            },
          ]}
          onPress={closeContainer}
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            <Animated.View style={childAnimation}>{children}</Animated.View>
          </Pressable>
        </Pressable>
      </Modal>
    );
  }
);

interface AlertProps {
  title: string;
  body: string;
  open: boolean;
  closeAlert: PopupContainerProps['close'];
  onAgree: () => void;
  declineButton?: boolean;
  onDecline: () => void;
  loadingOnAgree?: boolean;
  loadingOnDecline?: boolean;
  // alertOptions?: AlertOptions;
  alertOptions?:any
}

const Alert = forwardRef<PopupContainerRef, AlertProps>(
  (
    {
      title,
      body,
      open,
      closeAlert,
      onAgree,
      declineButton,
      onDecline = () => {},
      loadingOnAgree,
      loadingOnDecline,
      alertOptions,
    },
    ref
  ) => {
    const IconsAsBehaiour: Record<string, ReactNode> = {
      error: <TriangleAlert name='alert-triangle' color={'#8B0000'} size={60} />,
      inform: <TriangleAlert name='info' color={'#0b80f5ff'} size={60} />,
      success: <Check name='check' color={'#60b461'} size={60} />,
    };
    return (
      <PopupContainer ref={ref} open={open} close={closeAlert} padding>
        <View style={alert.alertContainer}>
          <View style={alert.iconContainer}>
            {IconsAsBehaiour[
              (alertOptions?.config?.type ?? 'inform') as string
            ] ?? IconsAsBehaiour['inform']}
          </View>
          <Text style={alert.title}>{title}</Text>
          <Text style={alert.body}>{body}</Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent:'space-between',
              width:'100%',
              paddingHorizontal:20
            }}
          >
            {declineButton ? (
              <TouchableOpacity
                onPress={onDecline}
                style={[
                  alert.button,
                  {
                    backgroundColor: '#fff',
                    borderWidth: 2,
                    borderColor: '#8B0000',
                  },
                ]}
              >
                {loadingOnDecline ? (
                  <ActivityIndicator size={16} color={'#8B0000'} />
                ) : (
                  <Text style={[alert.buttonText, { color: '#8B0000' }]}>
                    {alertOptions?.decline
                      ? alertOptions.decline.text
                      : 'Cancel'}
                  </Text>
                )}
              </TouchableOpacity>
            ) : (
              <View />
            )}
            <TouchableOpacity
              onPress={onAgree}
              style={[
                alert.button,
                {
                  backgroundColor: '#8B0000',
                  borderWidth: 2,
                  borderColor: 'transparent',
                },
              ]}
            >
              {loadingOnAgree ? (
                <ActivityIndicator size={16} color={'#fff'} />
              ) : (
                <Text style={alert.buttonText}>
                  {alertOptions?.agree ? alertOptions.agree.text : 'Ok'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </PopupContainer>
    );
  }
);

// ===== STYLES =====
const alert = StyleSheet.create({
  alertContainer: {
    height: 280,
    minWidth:380,
    maxWidth:400,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 25,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  body: {
    fontSize: 16,
    flex: 1,
    textAlign: 'center',
  },
  button: {
    alignSelf: 'flex-end',
    marginTop: 15,
    paddingHorizontal: 20,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

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

export { Alert, PopupAnimationTiming };
export default PopupContainer;