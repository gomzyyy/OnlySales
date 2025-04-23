import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {Dispatch, SetStateAction} from 'react';
import {colors, deviceHeight} from '../../../utils/Constants';
import Icon from 'react-native-vector-icons/AntDesign';
import {Customer, SoldProduct} from '../../../../types';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../../store/store';
import {useTheme} from '../../../hooks/index';
import {deleteSoldProductAPI} from '../../../api/api.soldproduct';
import {Confirm, showToast} from '../../../service/fn';
import {validateTokenAPI} from '../../../api/api.auth';
import {setUser} from '../../../../store/slices/business';

type TabLongPressOptionsProps = {
  soldProduct: SoldProduct;
  customer: Customer;
  close: () => void;
  actionType: 'PAID' | 'UNPAID';
  date: string;
};

const TabLongPressOptions: React.FC<TabLongPressOptionsProps> = ({
  soldProduct,
  date,
  close,
}): React.JSX.Element => {
  const {currentTheme} = useTheme();
  const user = useSelector((s: RootState) => s.appData.user)!;
  const dispatch = useDispatch<AppDispatch>();
  const handleDeleteProduct = async () => {
    const data = {
      query: {soldProductId: soldProduct._id, role: user.role},
    };
    const yes = await Confirm(
      'Are you sure?',
      'Are you sure you want to delete this sold product? This action cannot be undone.',
    );
    if (yes) {
      const res = await deleteSoldProductAPI(data);
      if (res.success) {
        const userRes = await validateTokenAPI({role: user.role});
        if (userRes.success && userRes.data && userRes.data.user) {
          dispatch(setUser(userRes.data.user));
        }
        showToast({type: 'success', text1: res.message});
        close();
        return;
      } else {
        showToast({type: 'error', text1: res.message});
        close();
        return;
      }
    } else {
      showToast({type: 'info', text1: 'action denied.'});
      close();
      return;
    }
  };
  return (
    <View
      style={[styles.parent, {backgroundColor: currentTheme.contrastColor}]}>
      <Text style={styles.label}>{soldProduct?.product?.name || ''}</Text>
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={styles.buttonDanger}
          activeOpacity={0.8}
          onPress={handleDeleteProduct}>
          <Text style={styles.buttonDangerText}>{'Delete'}</Text>
          <Icon name="delete" size={18} color={colors.danger} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    paddingTop: 20,
    height: deviceHeight * 0.18,
    borderRadius: 20,
    marginTop: 60,
    elevation: 30,
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
});

export default TabLongPressOptions;
