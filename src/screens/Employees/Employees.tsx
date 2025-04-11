import {View, StyleSheet, FlatList} from 'react-native';
import React, {useState} from 'react';
import Header from '../../components/Header';
import {useAnalytics, useHaptics, useTheme} from '../../hooks';
import SlideUpContainer from '../../components/SlideUpContainer';
import CreateEmployee from '../../components/CreateEmployee';
import EmptyListMessage from '../../components/EmptyListMessage';
import SearchBar from './components/SearchBar';
import CreateButton from '../../components/CreateButton';
import {useSelector} from 'react-redux';
import {RootState} from '../../../store/store';
import Icon from 'react-native-vector-icons/AntDesign';
import Tab from './components/tab';

const Employees = () => {
  const {lightTap} = useHaptics();
  const {currentTheme} = useTheme();
  const [openCreateEmployee, setopenCreateEmployee] = useState<boolean>(false);
  const {owner} = useAnalytics();
  const employees = owner.employeeData;
  const handleCloseCreateEmployee = () => setopenCreateEmployee(false);
  const handleOpenCreateEmployee = () => {
    setopenCreateEmployee(true);
    lightTap();
  };
  return (
    <View style={{flex: 1, backgroundColor: currentTheme.baseColor}}>
      <Header
        name="Employees"
        backButtom={true}
        titleColor={currentTheme.header.textColor}
        customComponent={true}
        renderItem={
          <Icon name="plus" size={24} color={currentTheme.header.textColor} />
        }
        customAction={() => {
          setopenCreateEmployee(true);
          lightTap();
        }}
      />
      <View style={styles.contentContainer}>
        {!openCreateEmployee && (
          <CreateButton open={handleOpenCreateEmployee} />
        )}
        <View style={{flex: 1}}>
          <View style={styles.searchBarContainer}>
            <SearchBar
              textColor={currentTheme.header.textColor}
              enable={employees.length !== 0}
            />
          </View>
          {employees.length !== 0 ? (
            <FlatList
              data={employees}
              keyExtractor={s => s._id}
              nestedScrollEnabled
              renderItem={({item}) => <Tab i={item} />}
              style={{flex: 1}}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={{flex: 1}}>
              <EmptyListMessage
                textColor={currentTheme.header.textColor}
                title="No Employee data available"
              />
            </View>
          )}
        </View>
      </View>
      {openCreateEmployee && (
        <SlideUpContainer
          open={openCreateEmployee}
          close={handleCloseCreateEmployee}>
          <CreateEmployee callback={handleCloseCreateEmployee} />
        </SlideUpContainer>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchBarContainer: {paddingVertical: 20},
  contentContainer: {flex: 1, paddingHorizontal: 10},
});

export default Employees;
