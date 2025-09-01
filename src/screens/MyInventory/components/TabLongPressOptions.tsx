import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import {colors, deviceHeight} from '../../../utils/Constants';
import {Product} from '../../../../types';
import {Confirm, showToast} from '../../../service/fn';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../../store/store';
import Icon from 'react-native-vector-icons/AntDesign';
import {useStorage, useTheme} from '../../../hooks/index';
import {useTranslation} from 'react-i18next';
import PopupContainer from '../../../components/PopUp';
import EditProduct from './EditProduct';

type TabLongPressOptionsProps = {
  i: Product;
  close: () => void;
};

const TabLongPressOptions: React.FC<TabLongPressOptionsProps> = ({
  i,
  close,
}): React.JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const {product} = useStorage();
  const {currentTheme} = useTheme();
  const {t} = useTranslation('inventory');
  const user = useSelector((s: RootState) => s.appData.user)!;

  const [loading, setLoading] = useState<boolean>(false);
  const [openEditing, setOpenEditing] = useState<boolean>(false);

  const handleCloseEditing = () => setOpenEditing(false);

  const handleDeleteProduct = async (): Promise<void> => {
    const r = await Confirm(
      'Are you sure you want to remove this product?',
      'this action cannot be reversed, records will remain in history only.',
    );

    if (!r) return;
    const deleteProductData = {
      query: {
        uid: user._id,
        role: user.role,
        productId: i._id,
      },
    };
    const res = await product.delete(deleteProductData, setLoading);
    showToast({type: res.success ? 'success' : 'error', text1: res.message});
  };

  return (
    <View
      style={[styles.parent, {backgroundColor: currentTheme.contrastColor}]}>
      <Text style={styles.label}>{i.name}</Text>
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[styles.buttonDanger, {backgroundColor: colors.dangerFade}]}
          activeOpacity={0.8}
          onPress={handleDeleteProduct}>
          <Text style={[styles.buttonDangerText, {color: colors.danger}]}>
            {t('i_tab_options_delete')}
          </Text>
          {loading ? (
            <ActivityIndicator color={colors.danger} size={16} />
          ) : (
            <Icon name="delete" size={18} color={colors.danger} />
          )}
        </TouchableOpacity>
      </View>
      <PopupContainer open={openEditing} close={handleCloseEditing}>
        <EditProduct product={i} close={handleCloseEditing} />
      </PopupContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    paddingTop: 20,
    height: 140,
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
