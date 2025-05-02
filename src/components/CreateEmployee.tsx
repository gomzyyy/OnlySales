import {
  View,
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
  Button,
  Image,
  Pressable,
} from 'react-native';
import React, {useState} from 'react';
import {modifyUserName, showToast} from '../service/fn';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../store/store';
import {useAnalytics, useHaptics, useTheme} from '../hooks/index';
import FilePicker from './FilePicker';
import SlideUpContainer from './SlideUpContainer';
import {
  EmploymentStatus,
  Gender,
  Shift,
  Department,
  Position,
  AdminRole,
} from '../../enums';
import {isNumber} from '../service/test';
import {deviceHeight} from '../utils/Constants';
import EmployementStatusPicker from './EmployementStatusPicker';
import ShiftPicker from './ShiftPicker';
import GenderPicker from './GenderPicker';
import {Employee, Owner, Partner, UserPermissions} from '../../types';
import PositionPicker from './PositionPicker';
import DepartmentPicker from './DepartmentPicker';
import {createEmployeeAPI} from '../api/api.employee';
import RolePicker from './RolePicker';
import {validateTokenAPI} from '../api/api.auth';
import {setUser} from '../../store/slices/business';
import {ActivityIndicator} from 'react-native';

type CreateEmployeeProps = {
  callback: () => void;
};

const CreateEmployee: React.FC<CreateEmployeeProps> = ({
  callback,
}): React.JSX.Element => {
  const {warning} = useHaptics();
  const {currentTheme} = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const currency = useSelector((s: RootState) => s.appData.app.currency);
  const user = useSelector((s: RootState) => s.appData.user)!;
  const {owner} = useAnalytics();
  const [name, setName] = useState<string>('');
  const [phoneNumber, setphoneNumber] = useState<string>('');
  const [salary, setSalary] = useState<string>('');
  const [status, setStatus] = useState<EmploymentStatus>(
    EmploymentStatus.ACTIVE,
  );
  const [statusDescription, setStatusDescription] = useState<string>('');
  const [gender, setGender] = useState<Gender>(Gender.MALE);
  const [shift, setShift] = useState<Shift>(Shift.MORNING);
  const [shiftDescription, setShiftDescription] = useState<string>('');
  const [image, setImage] = useState<string | undefined>();
  const [address, setAddress] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [department, setDepartment] = useState<Department>(Department.SALES);
  const [departmentDescription, setDepartmentDescription] = useState<
    string | undefined
  >();
  const [position, setPosition] = useState<Position>(Position.SALES_EXECUTIVE);
  const [positionDescription, setPositionDescription] = useState<
    string | undefined
  >();
  const [skills, setSkills] = useState<string[]>([]);
  const [employeeId, setEmployeeId] = useState<string>('');
  const [reportsTo, setReportsTo] = useState<AdminRole>(AdminRole.OWNER);
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [openImagePicker, setOpenImagePicker] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSaveBtn = async () => {
    if (!isNumber(salary)) {
      showToast({
        type: 'error',
        text1: "Can't include Characters in Number input.",
      });
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      showToast({
        type: 'error',
        text1: 'Passwords do not match!',
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
      !department ||
      !position ||
      !reportsTo ||
      !password ||
      !confirmPassword
    ) {
      warning();
      showToast({
        type: 'info',
        text1: 'Some required fields are empty.',
        position: 'top',
      });
      return;
    }
    if (password !== confirmPassword) {
      warning();
      showToast({
        type: 'error',
        text1: 'Password not matched.',
        position: 'top',
      });
      return;
    }
    if (employeeId.trim().length < 4 || employeeId.trim().length > 16) {
      warning();
      showToast({
        type: 'error',
        text1: 'Employee ID should be 4-16 characters long.',
        position: 'top',
      });
      return;
    }

    const employeeData = {
      query: {
        createdBy: user.role,
        creatorId: user._id,
        role: user.role,
      },
      body: {
        name: name.trim(),
        userId: employeeId,
        phoneNumber,
        password,
        position,
        positionDescription,
        email,
        address,
        gender,
        department,
        departmentDescription,
        salary: Number(salary),
        status,
        statusDescription,
        skills,
        shift,
        shiftDescription,
        reportsToModel: reportsTo,
        businessOwnerId: owner._id,
        hrUid:
          user.role === AdminRole.EMPLOYEE &&
          (user as Employee).permissions.employee.create
            ? user._id
            : undefined,
      },
      media: {
        image: undefined,
      },
    };
    const res = await createEmployeeAPI(employeeData, setLoading);
    if (res.success) {
      const userRes = await validateTokenAPI({role: user.role});
      if (userRes.success && userRes.data && userRes.data.user) {
        dispatch(setUser(userRes.data.user));
      }
    }
    showToast({
      type: res.success ? 'success' : 'error',
      text1: res.message,
    });
    callback();
  };

  const closeImagePicker = () => setOpenImagePicker(false);

  return (
    <KeyboardAvoidingView
      style={[
        styles.createEmployeeContainer,
        {backgroundColor: currentTheme.contrastColor},
      ]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Text style={[styles.formTitle, {color: currentTheme.modal.title}]}>
        Add Employee
      </Text>
      <ScrollView
        style={{flex: 1}}
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          {/* Name Field */}
          <View style={styles.inputTitleContainer}>
            <Text
              style={[styles.inputLabel, {color: currentTheme.modal.title}]}>
              What's the name?
            </Text>
            <TextInput
              value={name}
              onChangeText={val => setName(modifyUserName(val))}
              style={[
                styles.inputText,
                {borderColor: currentTheme.modal.inputBorder},
              ]}
              placeholder="Enter name"
              placeholderTextColor={'grey'}
            />
          </View>

          {/* Phone Number Field */}
          <View style={styles.inputTitleContainer}>
            <Text
              style={[styles.inputLabel, {color: currentTheme.modal.title}]}>
              Employee's phone number...
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
            />
          </View>

          <View style={styles.inputTitleContainer}>
            <Text
              style={[styles.inputLabel, {color: currentTheme.modal.title}]}>
              Assign your employee an ID...
            </Text>
            <TextInput
              value={employeeId}
              onChangeText={setEmployeeId}
              style={[
                styles.inputText,
                {borderColor: currentTheme.modal.inputBorder},
              ]}
              placeholder="Enter email"
              placeholderTextColor={'grey'}
            />
          </View>

          <View style={styles.inputTitleContainer}>
            <Text
              style={[styles.inputLabel, {color: currentTheme.modal.title}]}>
              Employee's email...
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              style={[
                styles.inputText,
                {borderColor: currentTheme.modal.inputBorder},
              ]}
              placeholder="Enter email"
              placeholderTextColor={'grey'}
            />
          </View>

          {/* Address Field */}
          <View style={styles.inputTitleContainer}>
            <Text
              style={[styles.inputLabel, {color: currentTheme.modal.title}]}>
              Employee's address?
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
            />
          </View>

          {/* Salary Field */}
          <View style={styles.inputTitleContainer}>
            <Text
              style={[styles.inputLabel, {color: currentTheme.modal.title}]}>
              Annual salary in {currency}?
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
            />
          </View>

          {/* Password Field */}
          <View style={styles.inputTitleContainer}>
            <Text
              style={[styles.inputLabel, {color: currentTheme.modal.title}]}>
              Password
            </Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              style={[
                styles.inputText,
                {borderColor: currentTheme.modal.inputBorder, color: '#000'},
              ]}
              placeholder="Enter password"
              placeholderTextColor={'grey'}
              secureTextEntry // Sensitive field
            />
          </View>

          {/* Confirm Password Field */}
          <View style={styles.inputTitleContainer}>
            <Text
              style={[styles.inputLabel, {color: currentTheme.modal.title}]}>
              Confirm Password
            </Text>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              style={[
                styles.inputText,
                {borderColor: currentTheme.modal.inputBorder, color: '#000'},
              ]}
              placeholder="Confirm password"
              placeholderTextColor={'grey'}
              secureTextEntry
            />
          </View>

          {/* Gender Picker */}
          <View style={styles.inputTitleContainer}>
            <Text
              style={[styles.inputLabel, {color: currentTheme.modal.title}]}>
              Choose Gender:
            </Text>
            <GenderPicker value={gender} setState={setGender} enabled />
          </View>

          {/* Shift Picker */}
          <View style={styles.inputTitleContainer}>
            <Text
              style={[styles.inputLabel, {color: currentTheme.modal.title}]}>
              What about Shift?
            </Text>
            <ShiftPicker value={shift} setState={setShift} enabled />
          </View>

          <View style={styles.inputTitleContainer}>
            <Text
              style={[styles.inputLabel, {color: currentTheme.modal.title}]}>
              {'(Active by default)'}
            </Text>
            <EmployementStatusPicker
              value={status}
              setState={setStatus}
              enabled
            />
          </View>

          {/* Position Picker */}
          <View style={styles.inputTitleContainer}>
            <Text
              style={[styles.inputLabel, {color: currentTheme.modal.title}]}>
              What about Position?
            </Text>
            <PositionPicker
              value={position}
              setState={setPosition}
              enabled={true}
            />
          </View>

          {/* Department Picker */}
          <View style={styles.inputTitleContainer}>
            <Text
              style={[styles.inputLabel, {color: currentTheme.modal.title}]}>
              Department
            </Text>
            <DepartmentPicker
              value={department}
              setState={setDepartment}
              enabled={true}
            />
          </View>
          <View style={[styles.inputTitleContainer, {alignItems: 'center'}]}>
            <Text
              style={[
                styles.inputLabel,
                {color: currentTheme.modal.title, marginBottom: 10},
              ]}>
              {image ? 'Click to change image' : 'Set profile image'}
            </Text>
            {image ? (
              <Pressable onPress={() => setOpenImagePicker(true)}>
                <Image
                  source={{uri: image}}
                  style={{height: 70, width: 70, borderRadius: 35}}
                />
              </Pressable>
            ) : (
              <Button
                title="CHOOSE IMAGE"
                onPress={() => setOpenImagePicker(true)}
              />
            )}
          </View>
          {/* Save Button */}
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
              {loading ? 'Saving' : 'Save'}
            </Text>
            {loading && (
              <ActivityIndicator size={20} color={currentTheme.contrastColor} />
            )}
          </TouchableOpacity>

          {/* Image Picker */}
          <SlideUpContainer
            opacity={0.4}
            open={openImagePicker}
            close={closeImagePicker}
            height={220}>
            <FilePicker
              value={image}
              setState={setImage}
              callback={closeImagePicker}
              type="image"
            />
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
    flex: 1,
    marginTop: 10,
  },
  inputTitleContainer: {
    marginVertical: 10,
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
    marginTop: 15,
    paddingVertical: 15,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  saveButtonText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CreateEmployee;

// name,
// salary: Number(salary),
// phoneNumber,
// gender,
// address,
// image,
// status,
// shift,
// businessOwner,
// department,
// departmentDescription:
//   department === Department.OTHER ? departmentDescription : undefined,
// position,
// positionDescription:
//   position === Position.OTHER ? positionDescription : undefined,
// skills,
// role,
// reportsTo,
// password,
// userId:'',
// email:'',
// reportsToModel:reportsTo,
// businessOwnerId:owner._id,
