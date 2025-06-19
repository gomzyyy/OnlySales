import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useRoute} from '@react-navigation/native';
import {Employee as EmployeeType, Partner} from '../../../types';
import Header from '../../components/Header';
import {useAnalytics, useHaptics, useTheme} from '../../hooks';
import {colors} from '../../utils/Constants';
import {modifyUserName, showToast} from '../../service/fn';
import {isNumber} from '../../service/test';
import {AdminRole, EmploymentStatus, Shift} from '../../../enums';
import {AppDispatch, RootState} from '../../../store/store';
import {useDispatch, useSelector} from 'react-redux';
import SlideUpContainer from '../../components/SlideUpContainer';
import FilePicker from '../../components/FilePicker';
import {Pressable, ScrollView} from 'react-native-gesture-handler';
const NoProfile = require('../../assets/images/no-profile.jpg');
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Picker from '../../customComponents/Picker';
import EmployeeProfileImage from './components/EmployeeProfileImage';

type EmployeeParams = {
  employeeId: EmployeeType['_id'];
};

type EmployeeProps = {};
const Employee: React.FC<EmployeeProps> = ({}): React.JSX.Element => {
  const {currentTheme} = useTheme();
  const {warning} = useHaptics();
  const {params} = useRoute();
  const {owner} = useAnalytics();
  const {employeeId} = params as EmployeeParams;
  const [editable, setEditable] = useState<boolean>(false);
  const currency = useSelector((s: RootState) => s.appData.app.currency);
  const user = useSelector((s: RootState) => s.appData.user)!;

  const employee = owner.employeeData.find(s => s._id === employeeId)!;

  const dispatch = useDispatch<AppDispatch>();
  const [name, setName] = useState<string>(employee.name || '');
  const [phoneNumber, setphoneNumber] = useState<string>(
    employee.phoneNumber?.value || '',
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
      id: employee._id,
      name,
      salary: Number(salary),
      phoneNumber,
      address,
      image,
      status,
      shift,
    };
    // dispatch(updateEmployee(employeeData));
    // if (image && image.trim().length !== 0) {
    //   setImageAPI({img: image, role: employee.role});
    // }
    showToast({
      type: 'success',
      text1: 'Employee updated Successfully.',
    });
  };

  const handleCloseImagePicker = () => setOpenImagePicker(false);
  const handleOpenImagePicker = () => setOpenImagePicker(true);

  const ToggleEditMode = (): JSX.Element => {
    const knobOffset = useSharedValue(20);

    useEffect(() => {
      if (!editable) {
        knobOffset.value = withTiming(0, {
          duration: 200,
          easing: Easing.inOut(Easing.ease),
        });
      } else {
        knobOffset.value = withTiming(20, {
          duration: 200,
          easing: Easing.inOut(Easing.ease),
        });
      }
    }, [editable]);

    const knobStyle = useAnimatedStyle(() => ({
      transform: [{translateX: knobOffset.value}],
    }));

    return (
      <View
        style={[
          toogleBtnStyles.toggleContainer,
          {
            borderColor: currentTheme.header.textColor,
            backgroundColor: currentTheme.contrastColor,
          },
        ]}>
        <Animated.View
          style={[
            toogleBtnStyles.knob,
            {
              backgroundColor: editable ? colors.oliveGreen : colors.danger,
            },
            knobStyle,
          ]}>
          {/* <ActivityIndicator size={12} color={'white'} /> */}
        </Animated.View>
      </View>
    );
  };
  const PermissionTab = ({
    label,
    allowed,
  }: {
    label: string;
    allowed: boolean;
  }) => {
    return (
      <View style={[styles.inputTitleContainer, {flexDirection: 'row'}]}>
        <Text
          style={[
            {
              fontWeight: '600',
              fontStyle: 'normal',
              fontSize: 14,
              backgroundColor: currentTheme.bgColor,
              paddingHorizontal: 3,
              paddingVertical: 1,
              borderRadius: 6,
            },
            {color: currentTheme.baseColor},
          ]}>
          {label}
        </Text>
        <Text
          style={{
            color: allowed ? colors.oliveGreen : colors.danger,
            fontWeight: '600',
            fontStyle: 'italic',
            fontSize: 12,
            backgroundColor: allowed
              ? colors.oliveGreenFade
              : colors.dangerFade,
            paddingHorizontal: 4,
            paddingVertical: 1,
            borderRadius: 6,
          }}>
          {allowed ? 'YES' : 'NO'}
        </Text>
      </View>
    );
  };
  const toogleEditState = () => {
    if (
      (user.role === AdminRole.PARTNER &&
        !(user as Partner).permissions.employee.update) ||
      (user.role === AdminRole.EMPLOYEE &&
        !(user as EmployeeType).permissions.employee.update)
    ) {
      showToast({
        type: 'error',
        text1: 'You are not authorised of editing employees',
      });
      return;
    }
    setEditable(p => !p);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.parent,{backgroundColor:currentTheme.contrastColor}]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Header
        name={employee.name}
        headerBgColor={currentTheme.baseColor}
        titleColor={currentTheme.header.textColor}
        backButton
        customComponent={true}
        renderItem={<ToggleEditMode />}
        customAction={toogleEditState}
        customComponentActiveOpacity={1}
        curved
      />
      <ScrollView
        style={{flex: 1, marginBottom: 10}}
        showsVerticalScrollIndicator={false}>
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
          <EmployeeProfileImage
            image={image}
            onChooseImagePress={() => setOpenImagePicker(true)}
            onImagePress={handleOpenImagePicker}
            onRemovePress={() => setImage(undefined)}
          />

          <View style={styles.inputTitleContainer}>
            <Text
              style={[styles.inputLabel, {color: currentTheme.modal.title}]}>
              {`Employee's name: `}
              <Text
                style={[
                  styles.inputLabel,
                  {color: currentTheme.modal.title, fontWeight: '400'},
                ]}>
                {name}
              </Text>
            </Text>

            {editable && (
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
            )}
          </View>
          <View style={styles.inputTitleContainer}>
            <Text
              style={[styles.inputLabel, {color: currentTheme.modal.title}]}>
              {`Contact number: `}
              <Text
                style={[
                  styles.inputLabel,
                  {color: currentTheme.modal.title, fontWeight: '400'},
                ]}>
                {`+91-${phoneNumber}`}
              </Text>
            </Text>

            {editable && (
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
            )}
          </View>
          <View style={styles.inputTitleContainer}>
            <Text
              style={[styles.inputLabel, {color: currentTheme.modal.title}]}>
              {`Address: `}
              <Text
                style={[
                  styles.inputLabel,
                  {color: currentTheme.modal.title, fontWeight: '400'},
                ]}>
                {address}
              </Text>
            </Text>

            {editable && (
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
            )}
          </View>
          <View style={styles.inputTitleContainer}>
            <Text
              style={[styles.inputLabel, {color: currentTheme.modal.title}]}>
              Annual salary in {`${currency}: `}
              <Text
                style={[
                  styles.inputLabel,
                  {color: currentTheme.modal.title, fontWeight: '400'},
                ]}>
                {salary}
              </Text>
            </Text>
            {editable && (
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
            )}
          </View>
          <View style={styles.inputTitleContainer}>
            <Text
              style={[styles.inputLabel, {color: currentTheme.modal.title}]}>
              {`Employment status: `}
              <Text
                style={[
                  styles.inputLabel,
                  {color: currentTheme.modal.title, fontWeight: '400'},
                ]}>
                {status}
              </Text>
            </Text>

            {editable && (
              <Picker
                value={status}
                setState={setStatus}
                enabled={editable}
                data={EmploymentStatus}
              />
            )}
          </View>
          <View style={styles.inputTitleContainer}>
            <Text
              style={[styles.inputLabel, {color: currentTheme.modal.title}]}>
              {`What about Shift: `}
              <Text
                style={[
                  styles.inputLabel,
                  {color: currentTheme.modal.title, fontWeight: '400'},
                ]}>
                {shift}
              </Text>
            </Text>
            {editable && (
              <Picker
                value={shift}
                setState={setShift}
                enabled={editable}
                data={Shift}
              />
            )}
          </View>
          <Text
            style={[
              styles.inputLabel,
              {
                color: currentTheme.contrastColor,
                backgroundColor: currentTheme.baseColor,
                padding: 6,
                borderRadius: 8,
              },
            ]}>
            Special Permissions:
          </Text>

          {/* Sold Product Section */}
          <Text style={[styles.sectionLabel, {color: '#000'}]}>
            Sold Products related permissions
          </Text>
          <PermissionTab
            label="Can add sold products: "
            allowed={employee.permissions.soldProduct.create}
          />
          <PermissionTab
            label="Can update sold products: "
            allowed={employee.permissions.soldProduct.update}
          />
          <PermissionTab
            label="Can delete sold products: "
            allowed={employee.permissions.soldProduct.delete}
          />

          {/* Customer Section */}
          <Text style={[styles.sectionLabel, {color: '#000'}]}>
            Customers related permissions
          </Text>
          <PermissionTab
            label="Can add new customers: "
            allowed={employee.permissions.customer.create}
          />
          <PermissionTab
            label="Can update customers: "
            allowed={employee.permissions.customer.update}
          />
          <PermissionTab
            label="Can remove customers: "
            allowed={employee.permissions.customer.delete}
          />

          {/* Product Section */}
          <Text style={[styles.sectionLabel, {color: '#000'}]}>
            Products related permissions
          </Text>
          <PermissionTab
            label="Can add new products: "
            allowed={employee.permissions.product.create}
          />
          <PermissionTab
            label="Can update products: "
            allowed={employee.permissions.product.update}
          />
          <PermissionTab
            label="Can remove products: "
            allowed={employee.permissions.product.delete}
          />

          {/* Docs Section */}
          <Text style={[styles.sectionLabel, {color: '#000'}]}>
            Documents Access
          </Text>
          <PermissionTab
            label="Can create docs: "
            allowed={employee.permissions.docs.create}
          />
          <PermissionTab
            label="Can update docs: "
            allowed={employee.permissions.docs.update}
          />
          <PermissionTab
            label="Can delete docs: "
            allowed={employee.permissions.docs.delete}
          />

          {/* Employee Section */}
          <Text style={[styles.sectionLabel, {color: '#000'}]}>
            Employees related permissions
          </Text>
          <PermissionTab
            label="Can add employees: "
            allowed={employee.permissions.employee.create}
          />
          <PermissionTab
            label="Can update employees: "
            allowed={employee.permissions.employee.update}
          />
          <PermissionTab
            label="Can remove employees: "
            allowed={employee.permissions.employee.delete}
          />
          {/* Analytics Section */}
          <Text style={[styles.sectionLabel, {color: '#000'}]}>
            Analytics related permissions
          </Text>
          <PermissionTab
            label="Can access analytics: "
            allowed={employee.permissions.analytics.accessable}
          />

          <SlideUpContainer
            opacity={0.4}
            open={openImagePicker}
            close={handleCloseImagePicker}
            height={220}>
            <FilePicker
              value={image}
              setState={setImage}
              callback={handleCloseImagePicker}
              enabled={editable}
              type="photo"
            />
          </SlideUpContainer>
        </View>
      </ScrollView>
      <Pressable
        style={[
          styles.saveButton,
          {backgroundColor: currentTheme.modal.saveBtnbg},
        ]}
        onPress={handleSaveBtn}>
        <Text
          style={[
            styles.saveButtonText,
            {color: currentTheme.modal.saveBtnText},
          ]}>
          Save
        </Text>
      </Pressable>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  parent: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 20,
  },
  profileImageContainer: {
    alignSelf: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  inputTitleContainer: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  inputText: {
    borderWidth: 1.5,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 15,
    backgroundColor: '#fff',
  },
  buttonStyle: {
    marginTop: 10,
    backgroundColor: colors.oliveGreen,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginTop: 10,
    marginBottom: 10,
    marginHorizontal: 20,
  },

  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
  },
});

const toogleBtnStyles = StyleSheet.create({
  toggleContainer: {
    width: 50,
    height: 25,
    borderRadius: 20,
    borderWidth: 1,
    padding: 3,
    justifyContent: 'center',
  },
  knob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default Employee;
