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
import {dashboardHeaderTabs} from '../utils/Constants';
import {ScrollView} from 'react-native-gesture-handler';
import {useTheme} from '../hooks/index';

type CustomerHeaderProps = {
  flex?: boolean;
};

const CustomerHeader: React.FC<CustomerHeaderProps> = ({
  flex = true,
}): React.JSX.Element => {
  const {currentTheme} = useTheme();
  const app = useSelector((s: RootState) => s.appData.app);
  const c = useSelector((s: RootState) => s.appData.BusinessOwner.customers);
  return (
    <KeyboardAvoidingView
      style={{flex: flex ? 1 : 0}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.parent}>
        <ScrollView
          horizontal={true}
          style={styles.container}
          contentContainerStyle={{gap: 20}}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled>
          {dashboardHeaderTabs.map((t, i) => (
            <View
              key={t.name}
              style={[
                styles.innerBox,
                {backgroundColor: currentTheme.baseColor},
              ]}>
              <View style={styles.infoContainer}>
                <Text
                  style={[
                    styles.textLabel,
                    {color: currentTheme.contrastColor},
                  ]}>
                  {t.name}
                </Text>
                <Text
                  style={[
                    styles.textInfo,
                    {color: currentTheme.contrastColor},
                  ]}>{`${app.currency}${t.data.amount}`}</Text>
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
  parent: {marginBottom: 20, gap: 6},
  container: {
    flexDirection: 'row',
  },
  innerBox: {
    height: 90,
    width: 160,
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
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textInfo: {
    fontSize: 22,
    textAlign: 'center',
  },
});

export default CustomerHeader;
