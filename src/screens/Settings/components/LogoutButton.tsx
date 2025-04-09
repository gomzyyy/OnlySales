import {Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {colors} from '../../../utils/Constants';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../../store/store';
import {Confirm, showToast} from '../../../service/fn';
import {resetAndNavigate} from '../../../utils/nagivationUtils';
import {useTheme} from '../../../hooks';

const LogoutButton = () => {
  const {currentTheme} = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const {userId} = useSelector((s: RootState) => s.appData.user)!;
  const handleOnLogout = async () => {
    const res = await Confirm(
      'Are you sure?',
      'this will log you out of this session.',
    );
    if (!res) return;
    // dispatch(logout({userId}));
    showToast({type: 'success', text1: 'Logout success.'});
    resetAndNavigate('GetStarted');
  };
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.button,
        {marginBottom: 6, backgroundColor: currentTheme.contrastColor},
      ]}
      onPress={handleOnLogout}>
      <Text style={[styles.buttonText, {color: colors.danger}]}>Logout</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 14,
    paddingVertical: 18,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 22,
    fontWeight: '400',
    textAlign: 'center',
  },
});

export default LogoutButton;
