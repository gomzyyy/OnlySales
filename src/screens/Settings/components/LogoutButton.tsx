import {Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {colors} from '../../../utils/Constants';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../../../../store/store';
import {Confirm, showToast} from '../../../service/fn';
import {resetAndNavigate} from '../../../utils/nagivationUtils';
import {useTheme} from '../../../hooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {deleteUser} from '../../../../store/slices/business';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import {DrawerActions} from '@react-navigation/native';

type LogoutButtonProps = {
  theme?: 'red' | 'white';
};

const LogoutButton: React.FC<LogoutButtonProps> = ({
  theme = 'white',
}): React.JSX.Element => {
  const {currentTheme} = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const handleOnLogout = async () => {
    const res = await Confirm(
      'Are you sure?',
      'this will log you out of this session.',
    );
    if (!res) return;
    await AsyncStorage.removeItem('accessToken');
    dispatch(deleteUser());
    showToast({type: 'success', text1: 'Logout success.'});
    resetAndNavigate('GetStarted');
  };
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.button,
        {
          marginBottom: 6,
          backgroundColor:
            (theme === 'red' && colors.dangerFade) ||
            (theme === 'white' && currentTheme.contrastColor) ||
            '',
        },
      ]}
      onPress={handleOnLogout}>
      <Icon name="logout" size={20} color={colors.danger} />
      <Text style={[styles.buttonText, {color: colors.danger}]}>Logout</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
  },
  buttonText: {
    fontSize: 22,
    fontWeight: '400',
    textAlign: 'center',
  },
});

export default LogoutButton;
