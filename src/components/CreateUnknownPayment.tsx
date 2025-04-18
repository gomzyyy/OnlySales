import {
  View,
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView, // Ensure this is imported for scrolling
} from 'react-native';
import React, {useState} from 'react';
import {deviceHeight} from '../utils/Constants';
import {showToast} from '../service/fn';
import {useTheme, useHaptics} from '../hooks';
import {UnknownPaymentType, PaymentState} from '../../enums';

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

  const [type, setType] = useState<UnknownPaymentType>(
    UnknownPaymentType.CREDIT,
  );
  const [state, setState] = useState<PaymentState>(PaymentState.UNPAID);
  const [paymentDescription, setPaymentDescription] = useState<string>('');
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
  const [loading, setLoading] = useState<boolean>(false);

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
      // API call here
      // await createUnknownPaymentAPI(unknownPayment);
      showToast({type: 'success', text1: 'Payment saved successfully'});
      callback();
    } catch (error) {
      showToast({type: 'error', text1: 'Failed to save payment'});
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, {backgroundColor: currentTheme.contrastColor}]}>
      <Text style={[styles.title, {color: currentTheme.modal.title}]}>
        Unknown Payment
      </Text>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Payment Description */}
        <View style={styles.inputTitleContainer}>
          <Text style={[styles.inputLabel, {color: currentTheme.modal.title}]}>
            Payment Description
          </Text>
          <TextInput
            style={[
              styles.input,
              {borderColor: currentTheme.modal.inputBorder},
            ]}
            placeholder="Enter payment description"
            value={paymentDescription}
            onChangeText={setPaymentDescription}
          />
        </View>

        {/* To */}
        <Text style={[styles.sectionTitle, {color: currentTheme.modal.title}]}>
          To
        </Text>
        {Object.keys(to).map(field => (
          <View style={styles.inputTitleContainer} key={field}>
            <Text
              style={[styles.inputLabel, {color: currentTheme.modal.title}]}>
              To {field}
            </Text>
            <TextInput
              style={[
                styles.input,
                {borderColor: currentTheme.modal.inputBorder},
              ]}
              placeholder={`Enter ${field}`}
              value={to[field as keyof PartyInfo]}
              onChangeText={val => setTo(prev => ({...prev, [field]: val}))}
            />
          </View>
        ))}

        {/* From */}
        <Text style={[styles.sectionTitle, {color: currentTheme.modal.title}]}>
          From
        </Text>
        {Object.keys(from).map(field => (
          <View style={styles.inputTitleContainer} key={field}>
            <Text
              style={[styles.inputLabel, {color: currentTheme.modal.title}]}>
              From {field}
            </Text>
            <TextInput
              style={[
                styles.input,
                {borderColor: currentTheme.modal.inputBorder},
              ]}
              placeholder={`Enter ${field}`}
              value={from[field as keyof PartyInfo]}
              onChangeText={val => setFrom(prev => ({...prev, [field]: val}))}
            />
          </View>
        ))}

        {/* Items */}
        <Text style={[styles.sectionTitle, {color: currentTheme.modal.title}]}>
          Items
        </Text>
        {items.map((item, idx) => (
          <View key={idx}>
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
                  placeholder={`Enter ${field}`}
                  value={item[field]}
                  keyboardType={field === 'name' ? 'default' : 'numeric'}
                  onChangeText={val => handleChangeItem(idx, field, val)}
                />
              </View>
            ))}
          </View>
        ))}
        <TouchableOpacity onPress={handleAddItem}>
          <Text style={[styles.addItemBtn, {color: currentTheme.modal.title}]}>
            + Add Item
          </Text>
        </TouchableOpacity>

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
