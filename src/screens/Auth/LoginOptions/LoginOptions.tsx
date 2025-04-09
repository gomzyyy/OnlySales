import {View, Text, StyleSheet, FlatList} from 'react-native';
import React from 'react';
import {deviceHeight} from '../../../utils/Constants';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../store/store';
import Tab from './components/Tab';

const LoginOptions = () => {
  const recentUsers = useSelector(
    (s: RootState) => s.appData.app.previousOwners,
  );
  return (
    <View style={styles.parent}>
      <Text style={styles.title}>{`Saved Accounts`}</Text>
      <Text style={styles.subTitle}>{`Please choose your Account below:`}</Text>
      <View style={styles.accountsListContainer}>
        <FlatList
          data={(recentUsers as any)}
          keyExtractor={s => s.userId}
          renderItem={({item}) => (
            <Tab i={item}/>
          )}
          showsVerticalScrollIndicator={false}
          style={{}}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {flex: 1,paddingHorizontal:20},
  title: {
    fontSize: 28,
    fontStyle: 'italic',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: deviceHeight * 0.22,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 40,
    paddingHorizontal: 18,
  },
  accountsListContainer:{
    height:deviceHeight*0.4,
    maxHeight:300,
    marginTop:30,
    padding:20,
    borderRadius:20,
  }
});

export default LoginOptions;
