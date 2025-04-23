import {View, Text, StyleSheet, TouchableOpacity, ActivityIndicator} from 'react-native';
import React, {useState} from 'react';
import {colors, deviceHeight} from '../../../utils/Constants';
import {Product} from '../../../../types';
import {Confirm, showToast} from '../../../service/fn';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../../store/store';
import Icon from 'react-native-vector-icons/AntDesign';
import {useTheme} from '../../../hooks/index';
import {deleteProductAPI} from '../../../api/api.product';
import {validateTokenAPI} from '../../../api/api.auth';
import {setUser} from '../../../../store/slices/business';
import { useTranslation } from 'react-i18next';

type TabLongPressOptionsProps = {
  i: Product;
  close: () => void;
};

const TabLongPressOptions: React.FC<TabLongPressOptionsProps> = ({
  i,
  close,
}): React.JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const {currentTheme} = useTheme();
  const {t} = useTranslation('inventory')
  const user = useSelector((s: RootState) => s.appData.user)!;

  const [loading, setLoading] = useState<boolean>(false);

  const handleDeleteCustomer = async (): Promise<void> => {
    const res = await Confirm(
      'Are you sure you want to remove this product?',
      'Once product removed, cannot be reversed! be careful of miss-touching removal button.',
    );
    const deleteProductData = {
      query: {
        uid: user._id,
        role: user.role,
        productId: i._id,
      },
    };
    if (res) {
      const res = await deleteProductAPI(deleteProductData, setLoading);
      if (res.success) {
        const data = {
          role: user.role,
        };
        const updatedUser = await validateTokenAPI(data, setLoading);
        if (updatedUser.success && updatedUser.data && updatedUser.data.user) {
          dispatch(setUser(updatedUser.data.user));
        }
      }
      showToast({type: 'success', text1: res.message});
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
          onPress={handleDeleteCustomer}>
          <Text style={[styles.buttonDangerText, {color: colors.danger}]}>
            {t('i_tab_options_delete')}
          </Text>
         {loading ? <ActivityIndicator color={colors.danger} size={16} />
         : <Icon name="delete" size={18} color={colors.danger} />}
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

    fontSize: 20,
  },
});

export default TabLongPressOptions;
