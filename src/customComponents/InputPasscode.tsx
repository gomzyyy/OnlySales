import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
  TextInputProps,
} from 'react-native';
import React, {Dispatch, SetStateAction, useState, forwardRef} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';

export type InputPasscodeProps = {
  value: string;
  setState: Dispatch<SetStateAction<string>>;
  toogleHiddenText?: boolean;
  placeholder?: string;
  fill?: boolean;
} & TextInputProps;

const InputPasscode = forwardRef<TextInput, InputPasscodeProps>(
  (
    {
      value,
      setState,
      toogleHiddenText = true,
      fill = false,
      placeholder = 'passcode',
      placeholderTextColor = '#ababab',
      ...rest
    },
    ref,
  ) => {
    const [show, setShow] = useState<boolean>(true);

    return (
      <View
        style={{
          flexDirection: 'row',
          borderColor: fill ? 'rgba(0,0,0,0)' : '#ccc',
          borderWidth: 1.6,
          borderRadius: 10,
          paddingHorizontal: 16,
          paddingVertical: 4,
          alignItems: 'center',
          backgroundColor: fill ? '#f2f2f2' : 'rgba(0,0,0,0)',
        }}>
        <TextInput
          ref={ref}
          value={value}
          onChangeText={setState}
          style={styles.passcodeInput}
          secureTextEntry={toogleHiddenText ? show : false}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          numberOfLines={1}
          {...rest}
        />
        {toogleHiddenText && (
          <Pressable
            onPress={() => setShow(!show)}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {!show ? (
              <Icon name="eye" size={20} color={'#ababab'} />
            ) : (
              <Icon name="eye-off" size={20} color={'#ababab'} />
            )}
          </Pressable>
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  passcodeInput: {
    fontSize: 18,
    color: '#000',
    flex: 1,
  },
});

export default InputPasscode;
