import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import {colors} from '../../../utils/Constants';
import {Customer} from '../../../../types';
import {Confirm, showToast} from '../../../service/fn';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../../store/store';
import {useAnalytics, useTheme} from '../../../hooks/index';
import {deleteCustomerAPI} from '../../../api/api.customer';
import {validateTokenAPI} from '../../../api/api.auth';
import {setUser} from '../../../../store/slices/business';
import {useTranslation} from 'react-i18next';
import {resetAndNavigate} from '../../../utils/nagivationUtils';
import PopupContainer,{Alert} from '../../../components/PopUp';
import { usePopup } from '../../../../context/popupContext';

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
  const {alert} = usePopup()
  const {currentTheme} = useTheme();
  const {owner} = useAnalytics();
  const {t} = useTranslation('customers');
  const user = useSelector((s: RootState) => s.appData.user);

  if (!user) {
    resetAndNavigate('GetStarted');
    return <></>;
  }

  const [loading, setLoading] = useState<boolean>(false);

  const handleDeleteEmployee = async (): Promise<void> => {
    // setOpenDelete(true)
     const res = await Confirm(
      'Are you sure?',
      `Do you really want to delete ${i.name}.`,
    );
    if (res) {
      const data = {
        query: {
          role: user.role,
          customerId: i._id,
          oid: owner._id,
        },
      };
      const apiRes = await deleteCustomerAPI(data, setLoading);
      if (apiRes.success) {
        showToast({type: 'success', text1: apiRes.message});
        const userData = {
          role: user.role,
        };
        const userRes = await validateTokenAPI(userData);
        console.log(userRes);
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
          style={[styles.buttonDanger, {backgroundColor: colors.danger}]}
          activeOpacity={0.8}
          onPress={handleDeleteEmployee}>
          {loading ? (
            <ActivityIndicator size={18} color={currentTheme.contrastColor} />
          ) : (
            <Text
              style={[
                styles.buttonDangerText,
                {color: currentTheme.contrastColor},
              ]}>
              Delete
            </Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.buttonEdit, {backgroundColor: currentTheme.baseColor}]}
          activeOpacity={0.8}
          onPress={triggerEdit}>
          {/* <Icon name="edit" size={18} color={currentTheme.contrastColor} /> */}
          <Text
            style={[
              styles.buttonEditText,
              {color: currentTheme.contrastColor},
            ]}>
            Edit
          </Text>
        </TouchableOpacity>
      </View>
        {/* <Alert title='Hello world' body='This is testing' open={openDelete} closeAlert={()=>{
          alert.close();
          setOpenDelete(false)
        }} onAgree={async()=>{
         await alert.close();
          setOpenDelete(false)
        }} onDecline={()=>{}} /> */}
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
    borderRadius: 8,
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
    fontSize: 16,
    fontWeight: '600',
  },
  buttonEdit: {
    height: 50,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  buttonEditText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TabLongPressOptions;
