import {
  View,
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Button,
  ScrollView,
} from 'react-native';
import React, { useState } from 'react';
import { modifyUserName, showToast } from '../service/fn';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { useHaptics, useTheme } from '../hooks/index';
import FilePicker from './FilePicker';
import SlideUpContainer from './SlideUpContainer';
import { EmploymentStatus, Gender, Shift, Department, Position, AdminRole } from '../../enums';
import { isNumber } from '../service/test';
import { deviceHeight } from '../utils/Constants';
import EmployementStatusPicker from './EmployementStatusPicker';
import ShiftPicker from './ShiftPicker';
import GenderPicker from './GenderPicker';
import { Employee, Owner, Partner, UserPermissions } from '../../types';

type CreateEmployeeProps = {
  callback: () => void;
};

const CreateEmployee: React.FC<CreateEmployeeProps> = ({ callback }): React.JSX.Element => {
  const { warning } = useHaptics();
  const { currentTheme } = useTheme();
  const currency = useSelector((s: RootState) => s.appData.app.currency);
  const dispatch = useDispatch<AppDispatch>();

  // New state for additional fields
  const [name, setName] = useState<string>('');
  const [phoneNumber, setphoneNumber] = useState<string>('');
  const [salary, setSalary] = useState<string>('');
  const [status, setStatus] = useState<EmploymentStatus>(EmploymentStatus.ACTIVE);
  const [gender, setGender] = useState<Gender>(Gender.MALE);
  const [shift, setShift] = useState<Shift>(Shift.MORNING);
  const [image, setImage] = useState<string | undefined>();
  const [address, setAddress] = useState<string>('');
  const [businessOwner, setBusinessOwner] = useState<Owner | undefined>();
  const [department, setDepartment] = useState<Department | undefined>();
  const [departmentDescription, setDepartmentDescription] = useState<string | undefined>();
  const [position, setPosition] = useState<Position | undefined>();
  const [positionDescription, setPositionDescription] = useState<string | undefined>();
  const [hireDate, setHireDate] = useState<Date | undefined>();
  const [skills, setSkills] = useState<string[]>([]);
  const [role, setRole] = useState<AdminRole | undefined>();
  const [reportsTo, setReportsTo] = useState<Owner | Employee | Partner | undefined>();
  const [permissions, setPermissions] = useState<UserPermissions | undefined>();

  const [openImagePicker, setOpenImagePicker] = useState<boolean>(false);

  const handleSaveBtn = () => {
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
      salary.trim().length === 0 ||
      status.trim().length === 0 ||
      shift.trim().length === 0 ||
      address.trim().length === 0 ||
      !hireDate ||
      !businessOwner ||
      !department ||
      !position ||
      !role ||
      !reportsTo ||
      !permissions
    ) {
      warning();
      showToast({
        type: 'info',
        text1: 'Some required fields are empty.',
        position: 'top',
      });
      return;
    }

    const employeeData = {
      name,
      salary: Number(salary),
      phoneNumber,
      gender,
      address,
      image,
      status,
      shift,
      businessOwner,
      department,
      departmentDescription,
      position,
      positionDescription,
      hireDate,
      skills,
      role,
      reportsTo,
      permissions,
    };

    // dispatch(createEmployee(employeeData));
    showToast({
      type: 'success',
      text1: 'Employee created Successfully.',
      text2: 'Please add products to create Udhars.',
    });
    callback();
  };

  const closeImagePicker = () => setOpenImagePicker(false);

  return (
    <KeyboardAvoidingView
      style={[styles.createEmployeeContainer, { backgroundColor: currentTheme.contrastColor }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Text style={[styles.formTitle, { color: currentTheme.modal.title }]}>Add Employee</Text>
      <ScrollView style={{ flex: 1 }} nestedScrollEnabled>
        <View style={styles.formContainer}>
          <View style={styles.inputTitleContainer}>
            <Text style={[styles.inputLabel, { color: currentTheme.modal.title }]}>What's the name?</Text>
            <TextInput
              value={name}
              onChangeText={val => setName(modifyUserName(val))}
              style={[styles.inputText, { borderColor: currentTheme.modal.inputBorder }]}
              placeholder="Enter name"
              placeholderTextColor={'grey'}
            />
          </View>

          <View style={styles.inputTitleContainer}>
            <Text style={[styles.inputLabel, { color: currentTheme.modal.title }]}>Employee's phone number...</Text>
            <TextInput
              value={phoneNumber}
              onChangeText={setphoneNumber}
              style={[styles.inputText, { borderColor: currentTheme.modal.inputBorder }]}
              placeholder="Enter phone number"
              placeholderTextColor={'grey'}
            />
          </View>

          <View style={styles.inputTitleContainer}>
            <Text style={[styles.inputLabel, { color: currentTheme.modal.title }]}>Employee's address?</Text>
            <TextInput
              value={address}
              onChangeText={setAddress}
              style={[styles.inputText, { borderColor: currentTheme.modal.inputBorder }]}
              placeholder="Enter address"
              placeholderTextColor={'grey'}
            />
          </View>

          <View style={styles.inputTitleContainer}>
            <Text style={[styles.inputLabel, { color: currentTheme.modal.title }]}>Annual salary in {currency}?</Text>
            <TextInput
              value={salary}
              onChangeText={setSalary}
              style={[styles.inputText, { borderColor: currentTheme.modal.inputBorder }]}
              placeholder="Enter salary"
              placeholderTextColor={'grey'}
              keyboardType="numeric"
            />
          </View>

          {/* Gender Picker */}
          <View style={styles.inputTitleContainer}>
            <Text style={[styles.inputLabel, { color: currentTheme.modal.title }]}>Choose Gender:</Text>
            <GenderPicker value={gender} setState={setGender} enabled />
          </View>

          {/* Shift Picker */}
          <View style={styles.inputTitleContainer}>
            <Text style={[styles.inputLabel, { color: currentTheme.modal.title }]}>What about Shift?</Text>
            <ShiftPicker value={shift} setState={setShift} enabled />
          </View>

          {/* Employment Status Picker */}
          <View style={styles.inputTitleContainer}>
            <Text style={[styles.inputLabel, { color: currentTheme.modal.title }]}>Employment status?</Text>
            <EmployementStatusPicker value={status} setState={setStatus} enabled />
          </View>

          {/* Date Picker for Hire Date */}
          <View style={styles.inputTitleContainer}>
            <Text style={[styles.inputLabel, { color: currentTheme.modal.title }]}>Hire Date</Text>
            <TextInput
              value={hireDate ? hireDate.toLocaleDateString() : ''}
              onFocus={() => {
                // Open Date Picker and update hireDate state
              }}
              style={[styles.inputText, { borderColor: currentTheme.modal.inputBorder }]}
              placeholder="Select hire date"
            />
          </View>

          {/* Department and Description */}
          <View style={styles.inputTitleContainer}>
            <Text style={[styles.inputLabel, { color: currentTheme.modal.title }]}>Department</Text>
            {/* <Picker selectedValue={department} onValueChange={setDepartment}>
            </Picker> */}
            <TextInput
              value={departmentDescription}
              onChangeText={setDepartmentDescription}
              style={[styles.inputText, { borderColor: currentTheme.modal.inputBorder }]}
              placeholder="Enter department description"
              placeholderTextColor={'grey'}
            />
          </View>

          {/* Position and Description */}
          <View style={styles.inputTitleContainer}>
            <Text style={[styles.inputLabel, { color: currentTheme.modal.title }]}>Position</Text>
            {/* <Picker selectedValue={position} onValueChange={setPosition}>
            </Picker> */}
            <TextInput
              value={positionDescription}
              onChangeText={setPositionDescription}
              style={[styles.inputText, { borderColor: currentTheme.modal.inputBorder }]}
              placeholder="Enter position description"
              placeholderTextColor={'grey'}
            />
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: currentTheme.modal.saveBtnbg }]}
            activeOpacity={0.8}
            onPress={handleSaveBtn}>
            <Text style={[styles.saveButtonText, { color: currentTheme.modal.saveBtnText }]}>Save</Text>
          </TouchableOpacity>

          {/* Image Picker */}
          <SlideUpContainer
            opacity={0.4}
            open={openImagePicker}
            close={closeImagePicker}
            height={image ? 300 : 116}>
            <FilePicker value={image} setState={setImage} callback={closeImagePicker} type='image' />
          </SlideUpContainer>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  createEmployeeContainer: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    height: deviceHeight * 0.6,
    borderRadius: 20,
    marginBottom: 10,
    elevation: 30,
  },
  formTitle: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  formContainer: {
    marginTop: 10,
    gap: 16,
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

export default CreateEmployee;
