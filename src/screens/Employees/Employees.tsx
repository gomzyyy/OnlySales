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
import {deviceHeight} from '../../utils/Constants';

const Employees = () => {
  const {lightTap} = useHaptics();
  const {currentTheme} = useTheme();
  const [openCreateEmployee, setOpenCreateEmployee] = useState(false);
  const {owner} = useAnalytics();
  const employees = [...owner.employeeData].reverse();

  const handleCloseCreateEmployee = () => setOpenCreateEmployee(false);
  const handleOpenCreateEmployee = () => {
    setOpenCreateEmployee(true);
    lightTap();
  };

  return (
    <View style={[styles.container, {backgroundColor: currentTheme.baseColor}]}>
      <Header
        name="Employees"
        backButtom
        titleColor={currentTheme.header.textColor}
        customComponent
        renderItem={
          <Icon name="plus" size={22} color={currentTheme.header.textColor} />
        }
        customAction={handleOpenCreateEmployee}
      />

      <View style={styles.contentWrapper}>
        {!openCreateEmployee && (
          <CreateButton open={handleOpenCreateEmployee} />
        )}

        <View style={styles.innerContent}>
          <View style={styles.searchBarWrapper}>
            <SearchBar
              textColor={currentTheme.header.textColor}
              enable={employees.length > 0}
            />
          </View>

          {employees.length > 0 ? (
            <FlatList
              data={employees}
              keyExtractor={item => item._id}
              renderItem={({item}) => <Tab i={item} />}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <EmptyListMessage
                textColor={currentTheme.header.textColor}
                title="No Employee data available"
              />
            </View>
          )}
        </View>
      </View>

      <SlideUpContainer
        open={openCreateEmployee}
        close={handleCloseCreateEmployee}
        height={deviceHeight * 0.62}>
        <CreateEmployee callback={handleCloseCreateEmployee} />
      </SlideUpContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  innerContent: {
    flex: 1,
    backgroundColor: 'transparent',
    borderRadius: 16,
    paddingBottom: 10,
  },
  searchBarWrapper: {
    paddingVertical: 16,
  },
  listContainer: {
    gap: 10,
    paddingBottom: 20,
  },
  emptyState: {
    flex: 1,
    marginTop: 100,
  },
});

export default Employees;
