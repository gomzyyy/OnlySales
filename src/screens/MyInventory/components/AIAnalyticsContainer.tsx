import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useTheme, useTTS} from '../../../hooks';
import {deviceHeight} from '../../../utils/Constants';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon1 from 'react-native-vector-icons/Feather';
import {AIResponseLengthType} from '../../../../enums';
import AILoader from '../../../components/shared/AILoader';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface Props {
  response: string | undefined;
  close: () => void;
  setResponse: Dispatch<SetStateAction<string | undefined>>;
  reload: ({rl}: {rl?: AIResponseLengthType}) => Promise<void>;
  changePrefrence: any;
}

const AIAnalyticsContainer: React.FC<Props> = ({
  response,
  close,
  setResponse,
  reload,
  changePrefrence,
}) => {
  const {currentTheme} = useTheme();
  const {isPlaying, speak, pause} =
    useTTS();

  const textContainerOpacity = useSharedValue(0);

  const textContainerAnimated = useAnimatedStyle(() => ({
    opacity: textContainerOpacity.value,
  }));

  const handleClose = () => {
    setResponse(undefined);
    close();
  };

  useEffect(() => {
    textContainerOpacity.value = withTiming(response ? 1 : 0, {duration: 800});
  }, [response]);

  return (
    <View
      style={[styles.container, {backgroundColor: currentTheme.contrastColor}]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleClose} activeOpacity={0.8}>
          {response ? (
            <Icon name="arrow-back" size={24} />
          ) : (
            <View style={{height: 22, width: 22}} />
          )}
        </TouchableOpacity>
        <Text style={[styles.label, {color: currentTheme.baseColor}]}>
          AI Analytics
        </Text>
        <View style={{flexDirection: 'row', gap: 6}}>
          <TouchableOpacity
            onPress={() =>
              isPlaying
                ? pause()
                : speak(
                    response || 'No Analytics report available at the moment.',
                  )
            }
            activeOpacity={0.8}>
            {response ? (
              isPlaying ? (
                <Icon1 name="pause" size={22} />
              ) : (
                <Icon1 name="play" size={22} />
              )
            ) : (
              <View style={{height: 22, width: 22}} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {response ? (
        <ScrollView
          style={[
            styles.contentWrapper,
            {backgroundColor: currentTheme.bgColor},
          ]}>
          <Animated.View style={textContainerAnimated}>
            <Text
              style={[
                styles.content,
                {
                  color: currentTheme.baseColor,
                  marginTop: 10,
                  marginBottom: 20,
                },
              ]}>
              {response}
            </Text>
          </Animated.View>
        </ScrollView>
      ) : (
        <AILoader show={typeof response === 'string'} mb={60} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: deviceHeight * 0.45,
    borderRadius: 20,
    padding: 20,
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  label: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  contentWrapper: {
    flex: 1,
    paddingHorizontal: 8,
    borderRadius: 16,
  },
  content: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
    fontWeight: '600',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AIAnalyticsContainer;
