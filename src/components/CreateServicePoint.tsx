import {
  View,
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Button,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import {deviceHeight} from '../utils/Constants';
import {modifyUserName, showToast} from '../service/fn';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../store/store';
import {useAnalytics, useHaptics, useTheme} from '../hooks/index';
import FilePicker from './FilePicker';
import SlideUpContainer from './SlideUpContainer';
import {AdminRole} from '../../enums';
import {Employee, Partner} from '../../types';
import {useStorage} from '../hooks';
import {global} from '../styles/global';
import {CreateServicePointAPIData} from '../api/types.api';

type CreateCustomerProps = {
  callback: () => void;
};

const CreateServicePoint: React.FC<CreateCustomerProps> = ({
  callback,
}): React.JSX.Element => {
  const {warning} = useHaptics();
  const {currentTheme} = useTheme();
  const user = useSelector((s: RootState) => s.appData.user)!;
  const {owner} = useAnalytics();
  const {user: u} = useStorage();
  const [spName, setSpName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [metaDataFields, setMetaDataFields] = useState<
    {key: string; value: string}[]
  >([{key: '', value: ''}]);

  const handleAddField = () => {
    setMetaDataFields(prev => [...prev, {key: '', value: ''}]);
  };

  const handleMetaChange = (
    index: number,
    field: 'key' | 'value',
    text: string,
  ) => {
    const updated = [...metaDataFields];
    updated[index][field] = text;
    setMetaDataFields(updated);
  };

  const handleSaveBtn = async () => {
    if (spName.trim().length === 0) {
      warning();
      showToast({
        type: 'info',
        text1: 'Some required fields are empty.',
        position: 'top',
      });
      return;
    }

    const metaObject: Record<string, string> = {};
    metaDataFields.forEach(({key, value}) => {
      if (key && value) {
        metaObject[key] = value;
      }
    });

    const spData: CreateServicePointAPIData = {
      query: {oid: owner._id, role: user.role},
      body: {
        pointName: spName.trim(),
        metadata: metaObject,
      },
    };

    const res = await u.createServicePoint(
      spData,
      setLoading,
    );
    if (res.success) {
      showToast({
        type: 'success',
        text1: res.message,
      });
      callback();
      return;
    }
    showToast({
      type: 'error',
      text1: res.message,
    });
    callback();
  };

  return (
    <KeyboardAvoidingView
      style={[
        styles.createCustomerContainer,
        {backgroundColor: currentTheme.contrastColor},
      ]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Text style={[styles.formTitle, {color: currentTheme.modal.title}]}>
        Add Service point
      </Text>
      <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <View style={styles.inputTitleContainer}>
            <Text
              style={[styles.inputLabel, {color: currentTheme.modal.title}]}>
              Name your service point
            </Text>
            <TextInput
              value={spName}
              onChangeText={setSpName}
              style={[
                global.inputText,
                {borderColor: currentTheme.modal.inputBorder},
              ]}
              placeholder="point name"
              placeholderTextColor={'grey'}
            />
          </View>

          <Text style={[styles.inputLabel, {color: currentTheme.modal.title}]}>
            {'Optional Info'}
          </Text>

          {metaDataFields.map((field, index) => (
            <View
              key={index}
              style={{flexDirection: 'row', gap: 6, marginBottom: 8}}>
              <TextInput
                placeholder="e.g. branch no."
                value={field.key}
                onChangeText={text => handleMetaChange(index, 'key', text)}
                style={[
                  global.inputText,
                  {
                    flex: 1,
                    borderColor: currentTheme.modal.inputBorder,
                  },
                ]}
                placeholderTextColor={'grey'}
              />
              <TextInput
                placeholder="e.g. branch add."
                value={field.value}
                onChangeText={text => handleMetaChange(index, 'value', text)}
                style={[
                  global.inputText,
                  {
                    flex: 1,
                    borderColor: currentTheme.modal.inputBorder,
                  },
                ]}
                placeholderTextColor={'grey'}
              />
            </View>
          ))}

          <TouchableOpacity
            onPress={handleAddField}
            activeOpacity={0.8}
            style={{
              alignSelf: 'flex-start',
            }}>
            <Text
              style={{
                color: currentTheme.baseColor,
                fontWeight: '600',
                fontSize: 14,
              }}>
              + Add more fields
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.saveButton,
              {backgroundColor: currentTheme.modal.saveBtnbg},
            ]}
            activeOpacity={0.8}
            onPress={handleSaveBtn}>
            {loading ? (
              <View
                style={{
                  flexDirection: 'row',
                  gap: 6,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={[
                    styles.saveButtonText,
                    {color: currentTheme.modal.saveBtnText},
                  ]}>
                  Please wait
                </Text>
                <ActivityIndicator
                  size={18}
                  color={currentTheme.contrastColor}
                />
              </View>
            ) : (
              <Text
                style={[
                  styles.saveButtonText,
                  {color: currentTheme.modal.saveBtnText},
                ]}>
                Save
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  createCustomerContainer: {
    paddingTop: 20,
    paddingHorizontal: 20,
    height: deviceHeight * 0.46,
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
    gap: 10,
    marginBottom: 16,
  },
  inputTitleContainer: {
    gap: 4,
  },
  inputLabel: {
    paddingLeft: 8,
    fontSize: 16,
    fontWeight: '600',
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

export default CreateServicePoint;
