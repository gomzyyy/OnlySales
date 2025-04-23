import {View, StyleSheet, FlatList} from 'react-native';
import React, {ReactNode, useEffect, useState} from 'react';
import Header from './components/Header';
import EmptyListMessage from '../../components/EmptyListMessage';
import {useSelector} from 'react-redux';
import {RootState} from '../../../store/store';
import {useTheme} from '../../hooks';
import {Text} from 'react-native';
import {ToolsIconContainer} from '../Dashboard/constants/constants';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon1 from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import Icon3 from 'react-native-vector-icons/FontAwesome5';
import Icon4 from 'react-native-vector-icons/Entypo';
import Icon5 from 'react-native-vector-icons/FontAwesome6';
import Tab from './components/Tab';

export type ToolsData = {
  id: number;
  title: string;
  navigateTo: string;
  icon: (color?: string) => React.JSX.Element;
  keywords: string[];
  disabled: boolean;
};

const SearchFeatures = () => {
  const {currentTheme} = useTheme();

  const tools_data: ToolsData[] = [
    {
      id: 0,
      title: 'EMI Calculator',
      navigateTo: 'EMICalculator',
      icon: () => <ToolsIconContainer label="EMI" />,
      keywords: ['emi', 'calculator', 'interest', 'loan'],
      disabled: true,
    },
    {
      id: 1,
      title: 'Payment History',
      navigateTo: 'PaymentHistory',
      icon: color => (
        <ToolsIconContainer label="EMI">
          <Icon3 name="book" color={color} size={24} />
        </ToolsIconContainer>
      ),
      keywords: ['history', 'payment', 'payments', 'product', 'sell', 'p'],
      disabled: false,
    },
    {
      id: 2,
      title: 'Customers',
      navigateTo: 'Customers',
      icon: color => (
        <ToolsIconContainer>
          <Icon name="people-sharp" size={24} color={color} />
        </ToolsIconContainer>
      ),
      keywords: ['customer', 'sell', 'product', 'customers', 'c'],
      disabled: false,
    },
    {
      id: 3,
      title: 'Employees',
      navigateTo: 'Employees',
      icon: color => (
        <ToolsIconContainer>
          <Icon3 name="network-wired" color={color} size={24} />
        </ToolsIconContainer>
      ),
      keywords: ['employee', 'partner', 'worker', 'work', 'e'],
      disabled: false,
    },
    {
      id: 4,
      title: 'Analytics',
      navigateTo: 'Analytics',
      icon: color => (
        <ToolsIconContainer>
          <Icon2 name="analytics" color={color} size={24} />
        </ToolsIconContainer>
      ),
      keywords: [
        'analytics',
        'analyse',
        'business',
        'loan',
        'profit',
        'loss',
        'sales',
        'sold',
        'a',
      ],
      disabled: false,
    },
    {
      id: 5,
      title: 'Settings',
      navigateTo: 'Settings ',
      icon: color => (
        <ToolsIconContainer>
           <Icon1 name="settings" color={color} size={26} />
        </ToolsIconContainer>
      ),
      keywords: [
        'settings',
        'edit',
        'update',
        'set',
        's',
        'profile',
        'me',
        'theme',
        'app',
        'lock',
      ],
      disabled: false,
    },
  ];

  const [searchResults, setSearchResults] = useState<ToolsData[]>([]);
  const [query, setQuery] = useState<string>('');
  const handleSearchQuery = () => {
    if (query.trim().length !== 0) {
      setSearchResults(
        tools_data.filter(
          t =>
            t.keywords.includes(query.trim().toLowerCase()) ||
            t.title.toLowerCase().trim().includes(query.toLowerCase().trim()),
        ),
      );
    } else {
      setSearchResults([]);
    }
  };

  useEffect(() => {
    handleSearchQuery();
  }, [query]);

  return (
    <View style={styles.parent}>
      <Header backButtom setQuery={setQuery} query={query} />
      <View style={[styles.contentContainer]}>
        {searchResults.length === 0 ? (
          <EmptyListMessage title="Try searching by name." />
        ) : (
          <View
            style={{
              height: 'auto',
              backgroundColor: currentTheme.baseColor,
              borderRadius: 20,
              padding: 15,
              gap: 10,
              elevation: 5,
            }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: currentTheme.header.textColor,
              }}>
              Results:
            </Text>
            <FlatList
              data={searchResults}
              keyExtractor={s => s.id.toString()}
              renderItem={({item}) => <Tab i={item} />}
              nestedScrollEnabled
            />
          </View>
        )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  parent: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 4,
    paddingTop: 4,
  },
});
export default SearchFeatures;
