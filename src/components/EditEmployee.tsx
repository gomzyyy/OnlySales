import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Button,
} from 'react-native';
import React, {useState} from 'react';
import {deviceHeight} from '../utils/Constants';
import {Employee} from '../../types';
import {AppDispatch, RootState} from '../../store/store';
import {useDispatch, useSelector} from 'react-redux';
import {showToast} from '../service/fn';
import {updateEmployee} from '../../store/slices/business';
import {useTheme} from '../hooks/index';
import EmployementStatusPicker from './EmployementStatusPicker';
import ShiftPicker from './ShiftPicker';
import {EmploymentStatus, Shift} from '../../enums';
import SlideUpContainer from './SlideUpContainer';
import GetImage from './GetImage';
import {isNumber} from '../service/test';

type EditCustomerProps = {
  i: Employee;
  close: () => void;
};

const EditCustomer: React.FC<EditCustomerProps> = ({
  i,
  close,
}): React.JSX.Element => {
  const {currentTheme} = useTheme();
  const currency = useSelector((s: RootState) => s.appData.app.currency);

  const dispatch = useDispatch<AppDispatch>();
  const [name, setName] = useState<string>(i.name);
  const [phoneNumber, setphoneNumber] = useState<string>(i.phoneNumber || '');
  const [image, setImage] = useState<string | undefined>(undefined);
  const [address, setAddress] = useState<string>(i.address || '');
  const [salary, setSalary] = useState<string>(i.salary.toString());
  const [status, setStatus] = useState<EmploymentStatus>(i.status);
  const [shift, setShift] = useState<Shift>(i.shift);
  const [openImagePicker, setOpenImagePicker] = useState<boolean>(false);

  const SaveUpdatedCustomer = () => {
    if (name.trim().length === 0) {
      showToast({type: 'info', text1: "Name can't be empty"});
      close();
      return;
    }
    if (!isNumber(salary)) {
      showToast({
        type: 'error',
        text1: "Can't include Characters in Number input.",
      });
      return;
    }
    dispatch(
      updateEmployee({
        ...i,
        name,
        salary: Number(salary),
        status,
        shift,
        image,
        phoneNumber,
        address,
      }),
    );
    close();
  };
  const closeImagePicker = () => setOpenImagePicker(false);

  return (
    <KeyboardAvoidingView
      style={[
        styles.createCustomerContainer,
        {backgroundColor: currentTheme.contrastColor},
      ]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Text style={[styles.formTitle, {color: currentTheme.modal.title}]}>
        Update {i.name}?
      </Text>
      <ScrollView style={{flex: 1}} nestedScrollEnabled>
        <View style={styles.formContainer}>
          <View style={styles.inputTitleContainer}>
            <Text
              style={[styles.inputLabel, {color: currentTheme.modal.title}]}>
              Employee name
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
              Phone number changed?
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
              Address changed?
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
            onPress={SaveUpdatedCustomer}>
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
  createCustomerContainer: {
    paddingHorizontal: 20,
    height: deviceHeight * 0.52,
    borderRadius: 20,
    marginBottom: 10,
    paddingVertical: 20,
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

export default EditCustomer;
