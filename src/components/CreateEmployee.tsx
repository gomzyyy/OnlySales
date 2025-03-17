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
import React, {useState} from 'react';
import {showToast} from '../service/fn';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../store/store';
import {createEmployee} from '../../store/slices/business';
import {useHaptics, useTheme} from '../hooks/index';
import GetImage from './GetImage';
import SlideUpContainer from './SlideUpContainer';
import {EmploymentStatus, Shift} from '../../enums';
import {isNumber} from '../service/test';
import {deviceHeight} from '../utils/Constants';
import EmployementStatusPicker from './EmployementStatusPicker';
import ShiftPicker from './ShiftPicker';

type CreateEmployeeProps = {
  callback: () => void;
};

const CreateEmployee: React.FC<CreateEmployeeProps> = ({
  callback,
}): React.JSX.Element => {
  const {warning} = useHaptics();
  const {currentTheme} = useTheme();
  const currency = useSelector((s: RootState) => s.appData.app.currency);
  const dispatch = useDispatch<AppDispatch>();
  const [name, setName] = useState<string>('');
  const [phoneNumber, setphoneNumber] = useState<string>('');
  const [salary, setSalary] = useState<string>('');
  const [status, setStatus] = useState<EmploymentStatus>(
    EmploymentStatus.ACTIVE,
  );
  const [shift, setShift] = useState<Shift>(Shift.MORNING);
  const [image, setImage] = useState<string | undefined>();
  const [address, setAddress] = useState<string>('');
  const [openImagePicker, setOpenImagePicker] = useState<boolean>(false);

  const handleSaveBtn = () => {
    if (!isNumber(salary)) {
      showToast({
        type: 'error',
        text1: "Can't include Characters in Number input.",
      });
      return;
    }
    const employeeData = {
      name: name,
      salary: Number(salary),
      phoneNumber,
      address,
      image,
      status,
      shift,
    };
    if (name.trim().length === 0) {
      warning();
      showToast({
        type: 'info',
        text1: 'Some required fields are empty.',
        position: 'top',
      });
      return;
    }
    dispatch(createEmployee(employeeData));
    showToast({
      type: 'success',
      text1: 'Employee created Successfully.',
      text2: 'Pleas add products to create Udhars.',
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
      <ScrollView style={{flex: 1}} nestedScrollEnabled>
        <View style={styles.formContainer}>
          <View style={styles.inputTitleContainer}>
            <Text
              style={[styles.inputLabel, {color: currentTheme.modal.title}]}>
              What's the name?
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              style={[
                styles.inputText,
                {borderColor: currentTheme.modal.inputBorder},
              ]}
              placeholder="Enter name"
              placeholderTextColor={'grey'}
            />
          </View>
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
          <View style={styles.inputTitleContainer}>
            <Text
              style={[styles.inputLabel, {color: currentTheme.modal.title}]}>
              what would be the annual salary in {`${currency}`}?
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
          <View style={styles.inputTitleContainer}>
            <Text
              style={[styles.inputLabel, {color: currentTheme.modal.title}]}>
              Employment status?
            </Text>
            <EmployementStatusPicker
              value={status}
              setState={setStatus}
              enabled
            />
          </View>
          <View style={styles.inputTitleContainer}>
            <Text
              style={[styles.inputLabel, {color: currentTheme.modal.title}]}>
              What about Shift?
            </Text>
            <ShiftPicker value={shift} setState={setShift} enabled />
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
            opacity={0.2}
            open={openImagePicker}
            close={closeImagePicker}>
            <GetImage
              value={image}
              setState={setImage}
              callback={closeImagePicker}
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
    height: deviceHeight * 0.58,
    borderRadius: 20,
    marginBottom: 10,
    elevation: 30,
  },
  formTitle: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  formContainer: {
    marginTop: 20,
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
