import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Button,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import {useRoute} from '@react-navigation/native';
import {Employee as EmployeeType} from '../../../types';
import Header from '../../components/Header';
import {useHaptics, useTheme} from '../../hooks';
import {colors} from '../../utils/Constants';
import EmployementStatusPicker from '../../components/EmployementStatusPicker';
import {updateEmployee} from '../../../store/slices/business';
import {modifyUserName, showToast} from '../../service/fn';
import {isNumber} from '../../service/test';
import {EmploymentStatus, Shift} from '../../../enums';
import {AppDispatch, RootState} from '../../../store/store';
import {useDispatch, useSelector} from 'react-redux';
import ShiftPicker from '../../components/ShiftPicker';
import SlideUpContainer from '../../components/SlideUpContainer';
import FilePicker from '../../components/FilePicker';
import {Pressable, ScrollView} from 'react-native-gesture-handler';
const NoProfile = require('../../assets/images/no-profile.jpg');
import Icon from 'react-native-vector-icons/AntDesign';
import {setImageAPI} from '../../api/api';

type EmployeeParams = {
  employeeId: EmployeeType['id'];
};

type EmployeeProps = {};
const Employee: React.FC<EmployeeProps> = ({}): React.JSX.Element => {
  const {currentTheme} = useTheme();
  const {warning} = useHaptics();
  const {params} = useRoute();
  const {employeeId} = params as EmployeeParams;
  const [editable, setEditable] = useState<boolean>(false);
  const currency = useSelector((s: RootState) => s.appData.app.currency);

  const employee = useSelector(
    (s: RootState) => s.appData.BusinessOwner.EmployeeData,
  ).find(d => d.id === employeeId)!;

  const dispatch = useDispatch<AppDispatch>();
  const [name, setName] = useState<string>(employee.name || '');
  const [phoneNumber, setphoneNumber] = useState<string>(
    employee.phoneNumber || '',
  );
  const [salary, setSalary] = useState<string>(
    employee.salary.toString() || '',
  );
  const [status, setStatus] = useState<EmploymentStatus>(
    employee.status || EmploymentStatus.INACTIVE,
  );
  const [shift, setShift] = useState<Shift>(employee.shift || Shift.MORNING);
  const [image, setImage] = useState<string | undefined>(employee.image);
  const [address, setAddress] = useState<string>(employee.address || '');
  const [openImagePicker, setOpenImagePicker] = useState<boolean>(false);

  const handleSaveBtn = () => {
    if (!editable) {
      showToast({
        type: 'info',
        text1: 'Cannot save or edit while Edit mode DISABLED.',
      });
      return;
    }
    if (!isNumber(salary)) {
      showToast({
        type: 'error',
        text1: "Can't include Characters in Number input.",
      });
      return;
    }
    if (
      name.trim().length === 0 ||
      phoneNumber.trim().length === 0 ||
      name.trim().length === 0 ||
      salary.trim().length === 0 ||
      status.trim().length === 0 ||
      shift.trim().length === 0 ||
      address.trim().length === 0
    ) {
      warning();
      showToast({
        type: 'info',
        text1: 'Some required fields are empty.',
        position: 'top',
      });
      return;
    }
    if (
      phoneNumber.trim().length === 0 ||
      phoneNumber.trim().length > 10 ||
      phoneNumber.trim().length < 10
    ) {
      warning();
      showToast({
        type: 'error',
        text1: 'Please enter a valid phone number.',
        position: 'top',
      });
      return;
    }
    const employeeData = {
      id: employee.id,
      name,
      salary: Number(salary),
      phoneNumber,
      address,
      image,
      status,
      shift,
    };
    dispatch(updateEmployee(employeeData));
    if (image && image.trim().length !== 0) {
      setImageAPI({img: image, role: employee.role});
    }
    showToast({
      type: 'success',
      text1: 'Employee updated Successfully.',
    });
  };

  const handleCloseImagePicker = () => setOpenImagePicker(false);
  const handleOpenImagePicker = () => setOpenImagePicker(true);

  const ToogleEditMode = (): React.JSX.Element => {
    return (
      <View
        style={{
          height: 20,
          borderWidth: 1,
          width: 40,
          borderRadius: 16,
          borderColor: currentTheme.header.textColor,
          backgroundColor: currentTheme.contrastColor,
        }}>
        <View
          style={{
            width: 20,
            borderRadius: 16,
            height: '100%',
            backgroundColor: editable ? colors.oliveGreen : colors.danger,
            position: 'absolute',
            left: !editable ? 0 : 'auto',
            right: editable ? 0 : 'auto',
          }}
        />
      </View>
    );
  };
  return (
    <KeyboardAvoidingView
      style={styles.parent}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView style={{flex: 1}}>
        <Header
          name={employee.name}
          headerBgColor={currentTheme.baseColor}
          titleColor={currentTheme.header.textColor}
          backButtom
          customComponent={true}
          renderItem={<ToogleEditMode />}
          customAction={() => setEditable(p => !p)}
          customComponentActiveOpacity={1}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            marginTop: 10,
          }}>
          <Text style={{fontSize: 16, fontWeight: 'bold'}}>Edit Mode:</Text>
          <Text style={{fontSize: 16, fontWeight: 'normal'}}>
            {editable ? 'enabled' : 'disabled'}
          </Text>
        </View>

        <View style={styles.formContainer}>
          <Pressable
            style={styles.profileImageContainer}
            onPress={handleOpenImagePicker}>
            <View style={styles.editIcon}>
              <Icon name="edit" size={16} color={currentTheme.baseColor} />
            </View>
            <Image
              source={
                image && image.trim().length !== 0 ? {uri: image} : NoProfile
              }
              style={styles.profileImage}
            />
          </Pressable>
          <View style={styles.inputTitleContainer}>
            <Text
              style={[styles.inputLabel, {color: currentTheme.modal.title}]}>
              Employee's name:
            </Text>
            <TextInput
              value={name}
              onChangeText={val => setName(p => (p = modifyUserName(val)))}
              style={[
                styles.inputText,
                {borderColor: currentTheme.modal.inputBorder},
              ]}
              placeholder="Enter name"
              placeholderTextColor={'grey'}
              editable={editable}
            />
          </View>
          <View style={styles.inputTitleContainer}>
            <Text
              style={[styles.inputLabel, {color: currentTheme.modal.title}]}>
              {`${name.split(' ')[0]}'s`} phone number
            </Text>
            <TextInput
              value={phoneNumber}
              onChangeText={setphoneNumber}
              style={[
                styles.inputText,
                {borderColor: currentTheme.modal.inputBorder},
              ]}
              placeholder="Enter phone number"
              placeholderTextColor={'grey'}
              editable={editable}
            />
          </View>
          <View style={styles.inputTitleContainer}>
            <Text
              style={[styles.inputLabel, {color: currentTheme.modal.title}]}>
              {`${name.split(' ')[0]}'s`} address?
            </Text>
            <TextInput
              value={address}
              onChangeText={setAddress}
              style={[
                styles.inputText,
                {borderColor: currentTheme.modal.inputBorder},
              ]}
              placeholder="Enter address"
              placeholderTextColor={'grey'}
              editable={editable}
            />
          </View>
          <View style={styles.inputTitleContainer}>
            <Text
              style={[styles.inputLabel, {color: currentTheme.modal.title}]}>
              {`${name.split(' ')[0]}'s`} annual salary in {`${currency}`}?
            </Text>
            <TextInput
              value={salary}
              onChangeText={setSalary}
              style={[
                styles.inputText,
                {borderColor: currentTheme.modal.inputBorder},
              ]}
              placeholder="Enter salary"
              placeholderTextColor={'grey'}
              keyboardType="numeric"
              editable={editable}
            />
          </View>
          <View style={styles.inputTitleContainer}>
            <Text
              style={[styles.inputLabel, {color: currentTheme.modal.title}]}>
              Employment status?
            </Text>
            <EmployementStatusPicker
              value={status}
              setState={setStatus}
              enabled={editable}
            />
          </View>
          <View style={styles.inputTitleContainer}>
            <Text
              style={[styles.inputLabel, {color: currentTheme.modal.title}]}>
              What about Shift?
            </Text>
            <ShiftPicker value={shift} setState={setShift} enabled={editable} />
          </View>
          {image && image.trim().length !== 0 ? (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{flex: 1}}>{`${image.slice(0, 40)}...`}</Text>
              <Button title="Remove" onPress={() => setImage(undefined)} />
            </View>
          ) : (
            <View
              style={{
                paddingHorizontal: 40,
                alignItems: 'center',
              }}>
              <Button
                title="Choose Profile Image"
                onPress={() => setOpenImagePicker(true)}
              />
            </View>
          )}
          <TouchableOpacity
            style={[
              styles.saveButton,
              {backgroundColor: currentTheme.modal.saveBtnbg},
            ]}
            activeOpacity={0.8}
            onPress={handleSaveBtn}>
            <Text
              style={[
                styles.saveButtonText,
                {color: currentTheme.modal.saveBtnText},
              ]}>
              Save
            </Text>
          </TouchableOpacity>
          <SlideUpContainer
            opacity={0.4}
            open={openImagePicker}
            close={handleCloseImagePicker}>
            <FilePicker
              value={image}
              setState={setImage}
              callback={handleCloseImagePicker}
              enabled={editable}
              type='image'
            />
          </SlideUpContainer>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  parent: {flex: 1},
  formContainer: {
    paddingHorizontal: 10,
    marginVertical: 20,
    gap: 16,
  },
  profileImageContainer: {
    height: 90,
    width: 90,
    borderRadius: 45,
    elevation: 10,
  },
  editIcon: {position: 'absolute', zIndex: 20, right: 0, bottom: 0},
  profileImage: {
    height: '100%',
    width: 'auto',
    resizeMode: 'cover',
    borderRadius: 45,
  },
  inputTitleContainer: {
    gap: 4,
  },
  inputLabel: {
    paddingLeft: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  inputText: {
    borderWidth: 2,
    borderRadius: 8,
    height: 50,
    fontSize: 18,
    paddingHorizontal: 12,
  },
  saveButton: {
    paddingVertical: 16,
    borderRadius: 8,
  },
  saveButtonText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
  },
});
export default Employee;
