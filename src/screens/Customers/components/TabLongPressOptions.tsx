import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import {colors, deviceHeight} from '../../../utils/Constants';
import {Customer, Employee} from '../../../../types';
import {Confirm, showToast} from '../../../service/fn';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../../store/store';
import Icon from 'react-native-vector-icons/AntDesign';
import {useTheme} from '../../../hooks/index';
import {deleteCustomerAPI} from '../../../api/api.customer';
import {validateTokenAPI} from '../../../api/api.auth';
import {setUser} from '../../../../store/slices/business';
import {useTranslation} from 'react-i18next';

type TabLongPressOptionsProps = {
  i: Customer;
  close: () => void;
  triggerEdit: () => void;
};

const TabLongPressOptions: React.FC<TabLongPressOptionsProps> = ({
  i,
  close,
  triggerEdit,
}): React.JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const {currentTheme} = useTheme();
  const {t} = useTranslation('customers');
  const user = useSelector((s: RootState) => s.appData.user)!;

  const [loading, setLoading] = useState<boolean>(false);

  const handleDeleteEmployee = async (): Promise<void> => {
    const res = await Confirm(
      'Are you sure?',
      `Do you really want to delete ${i.name}.`,
    );
    if (res) {
      const data = {
        query: {
          role: user.role,
          customerId: i._id,
        },
      };
      const apiRes = await deleteCustomerAPI(data, setLoading);
      if (apiRes.success) {
        showToast({type: 'success', text1: apiRes.message});
        const userData = {
          role: user.role,
        };
        const userRes = await validateTokenAPI(userData);
        if (userRes.success && userRes.data && userRes.data.user) {
          dispatch(setUser(userRes.data.user));
        }
      } else {
        showToast({type: 'error', text1: apiRes.message});
      }
      close();
      return;
    }
  };

  return (
    <View
      style={[styles.parent, {backgroundColor: currentTheme.contrastColor}]}>
      <Text style={styles.label}>{i.name}</Text>
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[styles.buttonDanger, {backgroundColor: colors.dangerFade}]}
          activeOpacity={0.8}
          onPress={handleDeleteEmployee}>
          <Text style={[styles.buttonDangerText, {color: colors.danger}]}>
            {loading ? t('cs_delete') : t('cs_deleting')}
          </Text>
          {loading ? (
            <ActivityIndicator size={18} color={colors.danger} />
          ) : (
            <Icon name="delete" size={18} color={colors.danger} />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonEdit}
          activeOpacity={0.8}
          onPress={triggerEdit}>
          <Text
            style={[
              styles.buttonEditText,
              {color: currentTheme.modal.inputText},
            ]}>
            {t('cs_edit')}
          </Text>
          <Icon name="edit" size={18} color={colors.iconBlack} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    paddingVertical: 14,
    height: 'auto',
    borderRadius: 20,
    marginBottom: 10,
    elevation: 30,
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  optionsContainer: {
    paddingHorizontal: 20,
    marginTop: 26,
    gap: 10,
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
  buttonEdit: {
    height: 50,
    borderRadius: 12,
    borderWidth: 0.8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  buttonEditText: {
    textAlign: 'center',

    fontSize: 20,
  },
});

export default TabLongPressOptions;
