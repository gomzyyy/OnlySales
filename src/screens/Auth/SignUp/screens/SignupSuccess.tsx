import {View, Text, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/Feather';
import {navigate} from '../../../../utils/nagivationUtils';

const SignupSuccess = () => {
  const [count, setCount] = useState<number>(3);

  useEffect(() => {
    const intervalId: NodeJS.Timeout = setInterval(
      () =>
        setCount(p => {
          if (p === 0 || p < 0) return 0;
          return p - 1;
        }),
      1000,
    );
    if (count === 0) {
      navigate('Dashboard');
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [count]);
  return (
    <View style={styles.parent}>
      <View style={styles.container}>
        <Icon name="check-circle" size={80} color={'#02e202'} />
        <Text style={[styles.successText, {color: 'grey'}]}>
          Account created Successfully!
        </Text>
        <View>
          <Text>Redirecting in {count}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    gap: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 100,
  },
  successText: {
    textAlign: 'center',
    fontSize: 26,
    fontWeight: 'bold',
  },
});

export default SignupSuccess;
