import {
  View,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React, {useState} from 'react';
import {colors, deviceHeight} from '../../../utils/Constants';
import {global} from '../../../styles/global';
import Icon2 from 'react-native-vector-icons/Feather';
import { useTheme } from '../../../hooks';

const Options = () => {
  const {currentTheme} = useTheme();
  const [loading, setLoading] = useState(false);

  return (
    <View
      style={[
        global.modalContainerCommonStyles,
        global.modalContainerBottomLifted,
        global.modalContainerRounded,
        {
          backgroundColor: currentTheme.contrastColor,
          height: deviceHeight * 0.3,
          padding: 20,
        },
      ]}>
      <TouchableOpacity
        style={[styles.buttonDanger, {backgroundColor: colors.danger}]}
        activeOpacity={0.8}
        // onPress={handleDeleteTimeSlot}
      >
        {loading ? (
          <ActivityIndicator size={22} color={currentTheme.contrastColor} />
        ) : (
          <Icon2 name="delete" size={22} color={currentTheme.contrastColor} />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {flex: 1},
  contentContainer: {flex: 1, marginTop: 2, paddingHorizontal: 10},
  loader: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  infoBar: {borderRadius: 20, padding: 2, gap: 10, marginBottom: 10},
  infoText: {
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonDanger: {
    borderRadius: 12,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  buttonIconContainer: {
    alignItems: 'center',
  },
  buttonDangerText: {
    textAlign: 'center',
    fontSize: 20,
  },
});

export default Options;
