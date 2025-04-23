import {View, StyleSheet, TouchableOpacity} from 'react-native';
import React, { useEffect } from 'react';
import Icon from 'react-native-vector-icons/Entypo';
import {useTheme} from '../hooks/index';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {transform} from '@babel/core';

type CreateButtomProps = {
  open: () => void;
};

const CreateButton: React.FC<CreateButtomProps> = ({
  open,
}): React.JSX.Element => {
  const {currentTheme} = useTheme();

  const fromRight = useSharedValue(-60);

  const btnAnimatedStyles = useAnimatedStyle(() => ({
    bottom: 90,
    right: fromRight.value,
  }));

  useEffect(()=>{
    fromRight.value = withTiming(22,{duration:500});
    return ()=>{
      fromRight.value = withTiming(-60,{duration:100})
    }
  },[])

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: currentTheme.baseColor,
          borderColor: currentTheme.contrastColor,
        },
        btnAnimatedStyles,
      ]}>
      <TouchableOpacity activeOpacity={0.8} onPress={open}>
        <View>
          <Icon
            name="circle-with-plus"
            size={26}
            color={currentTheme.contrastColor}
          />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    padding: 16,
    zIndex: 99,
    boxSizing: 'border-box',
    borderRadius: '40%',
    borderWidth: 3,
    elevation: 30,
  },
});

export default CreateButton;
