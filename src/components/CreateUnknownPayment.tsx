import {
  View,
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Pressable, // Ensure this is imported for scrolling
} from 'react-native';
import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {deviceHeight} from '../utils/Constants';
import {showToast} from '../service/fn';
import {useTheme, useHaptics} from '../hooks';
import {UnknownPaymentType, PaymentState} from '../../enums';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/store';

type PartyInfo = {
  name: string;
  phoneNumber: string;
  address: string;
  email: string;
};

type Item = {
  name: string;
  price: string;
  quantity: string;
};

type UnknownPayment = {
  type: UnknownPaymentType;
  paymentDescription: string;
  details: {
    to: PartyInfo;
    from: PartyInfo;
    paymentInfo: {
      items: {
        name: string;
        price: number;
        quantity: number;
      }[];
    };
  };
  state: PaymentState;
};

interface CreateUnknownPaymentProps {
  callback: () => void;
}

const CreateUnknownPayment: React.FC<CreateUnknownPaymentProps> = ({
  callback,
}) => {
  const {currentTheme} = useTheme();
  const {warning} = useHaptics();
  const user = useSelector((s: RootState) => s.appData.user)!;

  const [type, setType] = useState<UnknownPaymentType>(
    UnknownPaymentType.CREDIT,
  );
  const [state, setState] = useState<PaymentState>(PaymentState.UNPAID);
  const [paymentDescription, setPaymentDescription] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const [selectedRole, setSelectedRole] = useState<'payee' | 'paying' | null>(
    null,
  );
  const [isPaying, setIsPaying] = useState<boolean | null>(null);
  const [addDescription, setAddDescription] = useState<boolean>(false);

  const [to, setTo] = useState<PartyInfo>({
    name: '',
    phoneNumber: '',
    address: '',
    email: '',
  });
  const [from, setFrom] = useState<PartyInfo>({
    name: '',
    phoneNumber: '',
    address: '',
    email: '',
  });
  const [items, setItems] = useState<Item[]>([
    {name: '', price: '', quantity: ''},
  ]);

  const handleAddItem = () => {
    setItems(prev => [...prev, {name: '', price: '', quantity: ''}]);
  };

  const handleChangeItem = (index: number, key: keyof Item, value: string) => {
    setItems(prev =>
      prev.map((item, i) => (i === index ? {...item, [key]: value} : item)),
    );
  };

  const handleSave = async () => {
    if (!paymentDescription.trim()) {
      warning();
      showToast({
        type: 'info',
        text1: 'Payment description is required',
        position: 'top',
      });
      return;
    }

    const unknownPayment: UnknownPayment = {
      type,
      paymentDescription,
      details: {
        to,
        from,
        paymentInfo: {
          items: items.map(item => ({
            name: item.name,
            price: parseFloat(item.price),
            quantity: parseInt(item.quantity, 10),
          })),
        },
      },
      state,
    };

    setLoading(true);
    try {
      // await createUnknownPaymentAPI(unknownPayment);
      showToast({type: 'success', text1: 'Payment saved successfully'});
      callback();
    } catch (error) {
      showToast({type: 'error', text1: 'Failed to save payment'});
    } finally {
      setLoading(false);
    }
  };

  const RadioButton = ({
    label,
    value,
    setValue,
  }: {
    label: string;
    value: boolean;
    setValue: Dispatch<SetStateAction<boolean>>;
  }) => {
    return (
      <Pressable
        style={{
          marginBottom: 16,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        }}
        onPress={() => setValue(!value)}>
        <Text
          style={[
            styles.inputLabel,
            {
              color: currentTheme.modal.title,
              fontStyle: 'italic',
              fontWeight: '600',
              fontSize: 16,
            },
          ]}>
          {label}
        </Text>
        <View
          style={{
            height: 14,
            width: 14,
            borderRadius: 7,
            borderWidth: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {value && (
            <View
              style={{
                backgroundColor: currentTheme.baseColor,
                height: '70%',
                width: '70%',
                borderRadius: 50,
              }}
            />
          )}
        </View>
      </Pressable>
    );
  };

  const RadioButtonTooglePayee = ({
    label,
    value,
  }: {
    label: string;
    value: 'payee' | 'paying';
  }) => {
    const selected = selectedRole === value;
    return (
      <Pressable
        style={{
          marginBottom: 16,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        }}
        onPress={() => setSelectedRole(value)}>
        <Text
          style={[
            styles.inputLabel,
            {
              color: currentTheme.modal.title,
              fontStyle: 'italic',
              fontWeight: '600',
              fontSize: 16,
            },
          ]}>
          {label}
        </Text>
        <View
          style={{
            height: 14,
            width: 14,
            borderRadius: 7,
            borderWidth: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {selected && (
            <View
              style={{
                backgroundColor: currentTheme.baseColor,
                height: '70%',
                width: '70%',
                borderRadius: 50,
              }}
            />
          )}
        </View>
      </Pressable>
    );
  };

  useEffect(() => {
    if (selectedRole === null) return;
    if (selectedRole === 'payee') {
      setTo({
        phoneNumber: user.phoneNumber?.value || '',
        address: user.address || '',
        email: user.email?.value || '',
        name: user.name,
      });
      setFrom({
        phoneNumber: '',
        address: '',
        email: '',
        name: '',
      });
    } else if (selectedRole === 'paying') {
      setFrom({
        phoneNumber: user.phoneNumber?.value || '',
        address: user.address || '',
        email: user.email?.value || '',
        name: user.name,
      });
      setTo({
        phoneNumber: '',
        address: '',
        email: '',
        name: '',
      });
    }
  }, [selectedRole]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, {backgroundColor: currentTheme.contrastColor}]}>
      <Text style={[styles.title, {color: currentTheme.modal.title}]}>
        Unknown Payment
      </Text>
      <View style={{flexDirection: 'row', gap: 12}}>
        <RadioButtonTooglePayee label="I am the payee.." value="payee" />
        <RadioButtonTooglePayee label="no, I am paying.." value="paying" />
      </View>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}>
        {/* To */}
        <Text style={[styles.sectionTitle, {color: currentTheme.modal.title}]}>
          To:
        </Text>
        {Object.keys(to)
          .reverse()
          .map(field => (
            <View style={styles.inputTitleContainer} key={field}>
              <Text
                style={[styles.inputLabel, {color: currentTheme.modal.title}]}>
                {field}:
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {borderColor: currentTheme.modal.inputBorder},
                ]}
                placeholder={`enter ${field}`}
                placeholderTextColor={'#999'}
                value={to[field as keyof PartyInfo]}
                onChangeText={val => setTo(prev => ({...prev, [field]: val}))}
              />
            </View>
          ))}

        {/* From */}
        <Text style={[styles.sectionTitle, {color: currentTheme.modal.title}]}>
          From:
        </Text>
        {Object.keys(from)
          .reverse()
          .map(field => (
            <View style={styles.inputTitleContainer} key={field}>
              <Text
                style={[styles.inputLabel, {color: currentTheme.modal.title}]}>
                {field}:
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {borderColor: currentTheme.modal.inputBorder},
                ]}
                placeholder={`enter ${field}`}
                placeholderTextColor={'#999'}
                value={from[field as keyof PartyInfo]}
                onChangeText={val => setFrom(prev => ({...prev, [field]: val}))}
              />
            </View>
          ))}

        {/* Items */}
        <Text style={[styles.sectionTitle, {color: currentTheme.modal.title}]}>
          Items:
        </Text>
        {items.map((item, idx) => (
          <View key={idx}>
            <Text
              style={[styles.sectionTitle, {color: currentTheme.modal.title}]}>
              Item {idx + 1}:
            </Text>
            {(['name', 'price', 'quantity'] as (keyof Item)[]).map(field => (
              <View style={styles.inputTitleContainer} key={field}>
                <Text
                  style={[
                    styles.inputLabel,
                    {color: currentTheme.modal.title},
                  ]}>{`${field} (Item ${idx + 1})`}</Text>
                <TextInput
                  style={[
                    styles.input,
                    {borderColor: currentTheme.modal.inputBorder},
                  ]}
                  placeholder={`enter ${field}`}
                  placeholderTextColor={'#999'}
                  value={item[field]}
                  keyboardType={field === 'name' ? 'default' : 'numeric'}
                  onChangeText={val => handleChangeItem(idx, field, val)}
                />
              </View>
            ))}
          </View>
        ))}
        <View
          style={{
            alignItems: 'flex-end',
          }}>
          <TouchableOpacity onPress={handleAddItem}>
            <Text
              style={[
                styles.addItemBtn,
                {
                  color: currentTheme.baseColor,
                  backgroundColor: currentTheme.fadeColor,
                  paddingHorizontal: 4,
                  paddingVertical: 2,
                  borderRadius: 8,
                },
              ]}>
              + Add Item
            </Text>
          </TouchableOpacity>
        </View>

        {/* Payment Description */}
        <RadioButton
          label="Add description"
          value={addDescription}
          setValue={setAddDescription}
        />
        {addDescription && (
          <View style={[styles.inputTitleContainer]}>
            <Text
              style={[styles.inputLabel, {color: currentTheme.modal.title}]}>
              Payment Description
            </Text>
            <TextInput
              style={[
                styles.descriptionInput,
                {borderColor: currentTheme.modal.inputBorder},
              ]}
              placeholder="describe here."
              placeholderTextColor={'#999'}
              textAlignVertical="top"
              textAlign="left"
              value={paymentDescription}
              onChangeText={setPaymentDescription}
              maxLength={100}
            />
          </View>
        )}

        {/* Save Button */}
        <TouchableOpacity
          onPress={handleSave}
          style={[
            styles.saveButton,
            {backgroundColor: currentTheme.modal.saveBtnbg},
          ]}>
          {loading ? (
            <ActivityIndicator
              size="small"
              color={currentTheme.contrastColor}
            />
          ) : (
            <Text
              style={[
                styles.saveText,
                {color: currentTheme.modal.saveBtnText},
              ]}>
              Save
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: deviceHeight * 0.82,
    padding: 20,
    borderRadius: 16,
    marginBottom: 10,
  },
  scroll: {
    paddingBottom: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    marginTop: 16,
    fontWeight: '600',
    fontSize: 18,
    fontStyle: 'italic',
  },
  inputTitleContainer: {
    marginBottom: 12,
    gap: 4,
  },
  inputLabel: {
    paddingLeft: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  input: {
    borderWidth: 2,
    borderRadius: 8,
    height: 50,
    fontSize: 18,
    paddingHorizontal: 12,
  },
  descriptionInput: {
    borderWidth: 2,
    borderRadius: 8,
    height: 160,
    fontSize: 18,
    paddingHorizontal: 12,
  },
  saveButton: {
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 10,
  },
  saveText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  addItemBtn: {
    marginTop: 10,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CreateUnknownPayment;
