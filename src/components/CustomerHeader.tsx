import {
    View,
    Text,
    TextInput,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
  } from 'react-native';
  import React from 'react';
  import {RootState} from '../../store/store';
  import {useSelector} from 'react-redux';
  import {Customer} from '../../types';
  import {currentTheme} from '../utils/Constants';
  import {dashboardHeaderTabs} from '../utils/Constants';
  import {ScrollView} from 'react-native-gesture-handler';
    
  type CustomerHeaderProps = {
    flex?: boolean;
  };
  
  const CustomerHeader: React.FC<CustomerHeaderProps> = ({
    flex = true,
  }): React.JSX.Element => {
    const app = useSelector((s: RootState) => s.shopkeeper.app);
    const c = useSelector((s: RootState) => s.shopkeeper.shopkeeper.customers);
    return (
      <KeyboardAvoidingView
        style={{flex: flex ? 1 : 0}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.parent}>
          <ScrollView
            horizontal={true}
            style={styles.container}
            contentContainerStyle={{gap:20}}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled
            >
            {dashboardHeaderTabs.map((t,i) => (
                <View key={t.name} style={styles.innerBox}>
                  <View style={styles.infoContainer}>
                    <Text style={styles.textLabel}>{t.name}</Text>
                    <Text
                      style={
                        styles.textInfo
                      }>{`${app.currency}${t.data.amount}`}</Text>
                  </View>
                </View>
            ))}
          </ScrollView>
          {/* </View> */}
        </View>
      </KeyboardAvoidingView>
    );
  };
  
  const styles = StyleSheet.create({
    parent: {marginBottom:20, gap: 6},
    container: {
      flexDirection: 'row',
    },
    innerBox: {
      height: 90,
      width: 160,
      backgroundColor: currentTheme.baseColor,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10,
    },
    infoContainer: {
      flex: 1,
      justifyContent: 'space-evenly',
      paddingVertical: 10,
    },
    textLabel: {
      color: currentTheme.contrastColor,
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    textInfo: {
      color: currentTheme.contrastColor,
      fontSize: 22,
      textAlign: 'center',
    },
  });
  
  export default CustomerHeader;
  