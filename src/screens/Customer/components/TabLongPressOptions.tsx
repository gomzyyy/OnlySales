import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {colors, currentTheme, deviceHeight} from '../../../utils/Constants';
import Icon from 'react-native-vector-icons/AntDesign';

const TabLongPressOptions = () => {
  return (
    <View style={styles.parent}>
      <Text style={styles.label}>Options</Text>
      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.buttonDanger} activeOpacity={0.8}>
          <Text style={styles.buttonDangerText}>Delete</Text>
          <Icon name="delete" size={18} color={colors.danger} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    paddingTop: 20,
    backgroundColor: currentTheme.contrastColor,
    height: deviceHeight * 0.2,
    borderRadius: 20,
    marginTop: 60,
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  optionsContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 26,
    gap: 10,
  },
  buttonDanger: {
    backgroundColor: colors.dangerFade,
    paddingVertical: 14,
    borderRadius: 12,
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
    color: colors.danger,
    fontSize: 20,
  },
  buttonEdit: {
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 0.8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  buttonEditText: {
    textAlign: 'center',
    color: currentTheme.modal.inputText,
    fontSize: 20,
  },
});

export default TabLongPressOptions;
