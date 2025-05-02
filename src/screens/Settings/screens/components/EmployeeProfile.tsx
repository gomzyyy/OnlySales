import {
  View,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import React from 'react';
import Header from '../../../../components/Header';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../../store/store';
import {useTheme} from '../../../../hooks/index';
import {Employee} from '../../../../../types';
import {Position} from '../../../../../enums';

const EmployeeProfile = () => {
  const {currentTheme} = useTheme();
  const user = useSelector((s: RootState) => s.appData.user) as Employee;
  const {currency} = useSelector((s: RootState) => s.appData.app);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.parent, {backgroundColor: currentTheme.contrastColor}]}>
      <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
        <Header
          name="Employee Details"
          backButtom
          headerBgColor={currentTheme.baseColor}
          titleColor={currentTheme.header.textColor}
          curved={true}
        />

        <View style={styles.contentContainer}>
          <View style={styles.profileContainer}>
            {user.image && (
              <Image
                source={{uri: user?.image}}
                style={styles.profileImage}
                resizeMode="cover"
              />
            )}
            <Text style={[styles.profileName, {color: currentTheme.baseColor}]}>
              {user?.name}
            </Text>
            <View style={styles.underlineAccent} />
            <Text style={[styles.subText, {color: currentTheme.baseColor}]}>
              {user.position === Position.OTHER
                ? user.positionDescription
                  ? user.positionDescription.toUpperCase()
                  : 'NOT DEFINED'
                : user.position.toUpperCase()}
            </Text>
          </View>

          <View style={styles.card}>
            <DataDisplay
              label="Phone Number"
              value={user?.phoneNumber?.value}
            />
            <DataDisplay label="Department" value={user?.department} />
            {user.departmentDescription && (
              <DataDisplay
                label="Department Description"
                value={user?.departmentDescription}
              />
            )}
            {user.positionDescription && (
              <DataDisplay
                label="Position Description"
                value={user?.positionDescription}
              />
            )}
            <DataDisplay label="Salary" value={`${currency} ${user?.salary}`} />
            <DataDisplay label="Shift" value={user?.shift} />
            <DataDisplay
              label="Shift Description"
              value={user?.shiftDescription}
            />
            <DataDisplay label="Skills" value={user?.skills?.join(', ')} />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const DataDisplay = ({label, value}: {label: string; value?: string}) => {
  return (
    <View style={styles.dataItem}>
      <Text style={styles.dataLabel}>{label}</Text>
      <Text style={styles.dataValue}>{value || 'N/A'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 32,
    padding: 16,
    backgroundColor: '#f7f9fc', // subtle card-like background
    borderRadius: 20,
    elevation: 3,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#3498db',
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2c3e50',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  subText: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1,
    color: '#7f8c8d',
  },
  underlineAccent: {
    width: 36,
    height: 3,
    backgroundColor: '#3498db',
    borderRadius: 2,
    marginTop: 6,
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 24,
  },
  dataItem: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
    paddingBottom: 12,
  },
  dataLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 2,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  dataValue: {
    fontSize: 16,
    color: '#2d3436',
    fontWeight: '500',
  },
});

export default EmployeeProfile;
