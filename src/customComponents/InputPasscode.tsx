import {
  View,
  StyleSheet,
  TextInput,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from 'react-native';
import React, {SetStateAction, useRef} from 'react';
import {colors} from '../utils/Constants';
import {isNumber} from '../service/test';

type InputPasscodeProps = {
  state: [string, string, string, string];
  setState: React.Dispatch<SetStateAction<[string, string, string, string]>>;
  focused?: boolean;
  error?: boolean;
};

const InputPasscode: React.FC<InputPasscodeProps> = ({
  state,
  setState,
  focused = false,
  error = false,
}): React.JSX.Element => {
  const refs = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ];
  const handleOnChangeText = (index: number, value: string) => {
    if (!isNumber(value)) return;
    if (value.trim().length > 1) return;
    const newVal: [string, string, string, string] = [...state];
    newVal[index] = value;
    setState(newVal);
    if (value && index < refs.length - 1) {
      refs[index + 1].current?.focus();
    }
  };
  const handleOnKeyChange = (
    index: number,
    event: NativeSyntheticEvent<TextInputKeyPressEventData>,
  ) => {
    if (event.nativeEvent.key === 'Backspace' && !state[index] && index > 0) {
      refs[index - 1].current?.focus();
    }
  };
  return (
    <View style={styles.container}>
      {state.map((s, i) => (
        <View
          style={[
            styles.inputContainer,
            {borderColor: error ? colors.danger : '#000'},
          ]}
          key={i}>
          <TextInput
            ref={refs[i]}
            style={styles.input}
            value={s}
            autoFocus={i === 0 && focused}
            onChangeText={v => handleOnChangeText(i, v)}
            onKeyPress={e => handleOnKeyChange(i, e)}
            keyboardType="numeric"
            secureTextEntry={true}
          />
        </View>
      ))}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 18,
    alignSelf: 'center',
  },
  inputContainer: {
    borderBottomWidth: 4,
    borderColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    width: 50,
    // borderRadius: 20,
  },
  input: {
    color: 'black',
    fontSize: 28,
  },
});

export default InputPasscode;
