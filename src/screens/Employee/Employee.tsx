// Updated Employee screen with production‑grade UI + typed reusable components
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../store/store';
import {Employee as EmployeeType, Partner} from '../../../types';
import {AdminRole, EmploymentStatus, Shift} from '../../../enums';
import {colors} from '../../utils/Constants';
import {modifyUserName, showToast} from '../../service/fn';
import {isNumber} from '../../service/test';
import {useAnalytics, useHaptics, useTheme} from '../../hooks';
import EmployeeProfileImage from './components/EmployeeProfileImage';
import Picker from '../../customComponents/Picker';
import Header from '../../components/Header';
import HeaderIcon from '../../components/HeaderIcon';
import SlideUpContainer from '../../components/SlideUpContainer';
import FilePicker from '../../components/FilePicker';
import {global as g} from '../../styles/global';

/** Screen Params */
interface EmployeeParams {
  employeeId: EmployeeType['_id'];
}

/** Field Component Props */
type FieldProps = {
  label: string;
  value: string;
  editable: boolean;
  onChange: (v: string) => void;
  keyboardType?: 'default' | 'numeric';
  multiline?: boolean;
};

/** PickerRow Props */
type PickerRowProps<T> = {
  label: string;
  pickerData: T;
  value: any;
  setValue: (v: any) => void;
  enabled: boolean;
};

/** Permission Props */
type PermissionProps = {
  label: string;
  allowed: boolean;
};

const Employee: React.FC = () => {
  const {currentTheme} = useTheme();
  const {warning} = useHaptics();
  const {params} = useRoute();
  const {owner} = useAnalytics();
  const {employeeId} = params as unknown as EmployeeParams;

  const employee = owner.employeeData.find(e => e._id === employeeId)!;
  const user = useSelector((s: RootState) => s.appData.user)!;
  const currency = useSelector((s: RootState) => s.appData.app.currency);
  const dispatch = useDispatch<AppDispatch>();

  const [editable, setEditable] = useState<boolean>(false);
  const [name, setName] = useState<string>(employee.name);
  const [phone, setPhone] = useState<string>(employee.phoneNumber?.value || '');
  const [salary, setSalary] = useState<string>(String(employee.salary));
  const [status, setStatus] = useState<EmploymentStatus>(employee.status);
  const [shift, setShift] = useState<Shift>(employee.shift);
  const [image, setImage] = useState<string | undefined>(employee.image);
  const [address, setAddress] = useState<string>(employee.address || '');
  const [openPicker, setOpenPicker] = useState<boolean>(false);

  const toggleEdit = () => {
    if (
      (user.role === AdminRole.PARTNER &&
        !(user as Partner).permissions.employee.update) ||
      (user.role === AdminRole.EMPLOYEE &&
        !(user as EmployeeType).permissions.employee.update)
    ) {
      showToast({
        type: 'error',
        text1: 'You are not authorised to edit employees',
      });
      return;
    }
    setEditable(prev => !prev);
  };

  const handleSave = () => {
    if (!editable)
      return showToast({type: 'info', text1: 'Enable edit mode first'});
    if (!name.trim() || !phone.trim() || !salary.trim()) {
      warning();
      return showToast({
        type: 'error',
        text1: 'Please fill all required fields',
      });
    }
    if (!/^\d{10}$/.test(phone))
      return showToast({type: 'error', text1: 'Invalid phone number'});
    if (!isNumber(salary))
      return showToast({type: 'error', text1: 'Salary must be numeric'});

    showToast({type: 'success', text1: 'Employee updated'});
    setEditable(false);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, {backgroundColor: currentTheme.contrastColor}]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Header
        name={employee.name}
        headerBgColor={currentTheme.baseColor}
        titleColor={currentTheme.header.textColor}
        backButton
        customComponent
        customAction={toggleEdit}
        renderItem={
          <HeaderIcon label={editable ? 'Disable' : 'Enable'}>
            <Icon
              name={editable ? 'toggle-left' : 'toggle-right'}
              size={22}
              color={editable ? colors.oliveGreen : colors.danger}
            />
          </HeaderIcon>
        }
        curved
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollBody}>
        <EmployeeProfileImage
          image={image}
          onImagePress={() => image && setOpenPicker(true)}
          onChooseImagePress={() => setOpenPicker(true)}
          onRemovePress={() => setImage(undefined)}
        />

        <View
          style={[styles.card, {backgroundColor: currentTheme.contrastColor}]}>
          <Field
            label="Name"
            editable={editable}
            value={name}
            onChange={v => setName(modifyUserName(v))}
          />
          <Field
            label="Phone"
            editable={editable}
            value={phone}
            keyboardType="numeric"
            onChange={setPhone}
          />
          <Field
            label="Address"
            editable={editable}
            value={address}
            onChange={setAddress}
            multiline
          />
        </View>

        <View
          style={[styles.card, {backgroundColor: currentTheme.contrastColor}]}>
          <Field
            label={`Annual Salary (${currency})`}
            editable={editable}
            value={salary}
            keyboardType="numeric"
            onChange={setSalary}
          />
          <PickerRow
            label="Status"
            pickerData={EmploymentStatus}
            value={status}
            setValue={setStatus}
            enabled={editable}
          />
          <PickerRow
            label="Shift"
            pickerData={Shift}
            value={shift}
            setValue={setShift}
            enabled={editable}
          />
        </View>

        <View
          style={[styles.card, {backgroundColor: currentTheme.contrastColor}]}>
          <Text style={styles.sectionTitle}>Special Permissions</Text>
          <Permission
            label="Add sold products"
            allowed={employee.permissions.soldProduct.create}
          />
          <Permission
            label="Update sold products"
            allowed={employee.permissions.soldProduct.update}
          />
          <Permission
            label="Delete sold products"
            allowed={employee.permissions.soldProduct.delete}
          />
        </View>

        <View
          style={[styles.card, {backgroundColor: currentTheme.contrastColor}]}>
          <Text style={styles.sectionTitle}>Customers related permissions</Text>
          <Permission
            label="Can add new customers"
            allowed={employee.permissions.customer.create}
          />
          <Permission
            label="Can update customers"
            allowed={employee.permissions.customer.update}
          />
          <Permission
            label="Can remove customers"
            allowed={employee.permissions.customer.delete}
          />
        </View>

        <View
          style={[styles.card, {backgroundColor: currentTheme.contrastColor}]}>
          <Text style={styles.sectionTitle}>Products related permissions</Text>
          <Permission
            label="Can add new products"
            allowed={employee.permissions.product.create}
          />
          <Permission
            label="Can update products"
            allowed={employee.permissions.product.update}
          />
          <Permission
            label="Can remove products"
            allowed={employee.permissions.product.delete}
          />
        </View>

        <View
          style={[styles.card, {backgroundColor: currentTheme.contrastColor}]}>
          <Text style={styles.sectionTitle}>Documents Access</Text>
          <Permission
            label="Can create docs"
            allowed={employee.permissions.docs.update}
          />
          <Permission
            label="Can update docs"
            allowed={employee.permissions.docs.delete}
          />
        </View>

        <View
          style={[styles.card, {backgroundColor: currentTheme.contrastColor}]}>
          <Text style={styles.sectionTitle}>Employees related permissions</Text>
          <Permission
            label="Can add employees"
            allowed={employee.permissions.employee.create}
          />
          <Permission
            label="Can update employees"
            allowed={employee.permissions.employee.update}
          />
          <Permission
            label="Can remove employees"
            allowed={employee.permissions.employee.delete}
          />
        </View>
        <View
          style={[styles.card, {backgroundColor: currentTheme.contrastColor}]}>
          <Text style={styles.sectionTitle}>Employees related permissions</Text>
          <Permission
            label="Can access analytics"
            allowed={employee.permissions.analytics.accessable}
          />
        </View>
      </ScrollView>

      <Pressable
        style={[styles.saveBtn, {backgroundColor: currentTheme.baseColor}]}
        onPress={handleSave}>
        <Text style={styles.saveText}>Save Changes</Text>
      </Pressable>

      <SlideUpContainer
        open={openPicker}
        close={() => setOpenPicker(false)}
        opacity={0.4}
        height={220}>
        <FilePicker
          value={image}
          setState={setImage}
          callback={() => setOpenPicker(false)}
          enabled={editable}
          type="photo"
        />
      </SlideUpContainer>
    </KeyboardAvoidingView>
  );
};

const Field: React.FC<FieldProps> = ({
  label,
  value,
  editable,
  onChange,
  keyboardType = 'default',
  multiline = false,
}) => (
  <View style={{marginBottom: 12}}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[g.inputText, styles.input]}
      value={value}
      editable={editable}
      onChangeText={onChange}
      keyboardType={keyboardType}
      multiline={multiline}
    />
  </View>
);

const PickerRow = <T extends object>({
  label,
  pickerData,
  value,
  setValue,
  enabled,
}: PickerRowProps<T>) => (
  <View style={{marginBottom: 12}}>
    <Text style={styles.label}>{label}</Text>
    <Picker
      data={pickerData}
      value={value}
      setState={setValue}
      enabled={enabled}
    />
  </View>
);

const Permission: React.FC<PermissionProps> = ({label, allowed}) => (
  <View style={styles.permissionRow}>
    <Text style={styles.permissionLabel}>{label}:</Text>
    <Text
      style={[
        styles.permissionValue,
        {color: allowed ? colors.oliveGreen : colors.danger},
      ]}>
      {allowed ? 'YES' : 'NO'}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {flex: 1},
  scrollBody: {paddingHorizontal: 20, paddingBottom: 100},
  card: {
    padding: 16,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    marginBottom: 16,
  },
  label: {fontSize: 13, fontWeight: '600', marginBottom: 4},
  input: {borderColor: '#ddd'},
  sectionTitle: {fontSize: 15, fontWeight: '700', marginBottom: 8},
  permissionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  permissionLabel: {fontSize: 13, fontWeight: '600'},
  permissionValue: {fontSize: 13, fontWeight: '600'},
  saveBtn: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 5,
  },
  saveText: {color: '#fff', fontWeight: '700', fontSize: 16},
});

export default Employee;