import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import {colors, deviceHeight} from '../../../utils/Constants';
import {Employee} from '../../../../types';
import {Confirm, showToast} from '../../../service/fn';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../../store/store';
// import {removeEmployee} from '../../../../store/slices/business';
import Icon from 'react-native-vector-icons/AntDesign';
import {useTheme} from '../../../hooks/index';
import {deleteEmployeeAPI} from '../../../api/api.employee';
import {validateTokenAPI} from '../../../api/api.auth';
import {setUser} from '../../../../store/slices/business';

type TabLongPressOptionsProps = {
  i: Employee;
  close: () => void;
  triggerEdit: () => void;
};

const TabLongPressOptions: React.FC<TabLongPressOptionsProps> = ({
  i,
  close,
  triggerEdit,
}): React.JSX.Element => {
  const user = useSelector((s: RootState) => s.appData.user)!;
  const {currentTheme} = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState<boolean>(false);

  const handleDeleteEmployee = async (): Promise<void> => {
    const res = await Confirm(
      'Are you sure you want to remove this Employee?',
      'Once Employee removed, cannot be reversed! be careful of miss-touching removal button.',
    );
    close();
    if (res) {
      const data = {
        query: {
          role: user.role,
          employeeId: i._id,
        },
      };
      const deleteRes = await deleteEmployeeAPI(data);
      if (deleteRes.success) {
        const userRes = await validateTokenAPI({role: user.role});
        if (userRes.success && userRes.data && userRes.data.user) {
          dispatch(setUser(userRes.data.user));
        }
      }
      showToast({
        type: deleteRes.success ? 'success' : 'info',
        text1: deleteRes.message,
      });
    }
    return;
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
            {loading ? 'deleting' : 'delete'}
          </Text>
          {loading ? (
            <ActivityIndicator size={18} color={colors.danger} />
          ) : (
            <Icon name="delete" size={18} color={colors.danger} />
          )}
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
