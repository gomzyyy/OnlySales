import {View, StyleSheet, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from './components/Header';
import {useTheme} from '../../hooks';
import {Text} from 'react-native';
import {ToolsIconContainer} from '../Dashboard/constants/constants';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import Icon3 from 'react-native-vector-icons/FontAwesome5';
import Icon5 from 'react-native-vector-icons/FontAwesome6';
import Tab from './components/Tab';
import {navigate} from '../../utils/nagivationUtils';

export type ToolsData = {
  id: number;
  title: string;
  navigateTo?: string;
  icon: (color?: string) => React.JSX.Element;
  keywords: string[];
  disabled: boolean;
  onPress?: () => void;
};

const SearchFeatures = () => {
  const {currentTheme} = useTheme();

  const tools_data: ToolsData[] = [
    {
      id: 0,
      title: 'EMI Calculator',
      navigateTo: undefined,
      icon: () => <ToolsIconContainer label="EMI" />,
      keywords: ['emi', 'calculator', 'interest', 'loan'],
      disabled: false,
      onPress: () => navigate('Dashboard', {openEMICalcContainer: true}),
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
      onPress: undefined,
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
      onPress: undefined,
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
      onPress: undefined,
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
      onPress: undefined,
    },
    {
      id: 5,
      title: 'Settings',
      navigateTo: 'Settings',
      icon: color => (
        <ToolsIconContainer>
          <Icon name="settings" color={color} size={26} />
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
      onPress: undefined,
    },
    {
      id: 6,
      title: 'Invoices',
      navigateTo: 'Invoices',
      icon: color => (
        <ToolsIconContainer>
          <Icon5 name="file-invoice" color={color} size={26} />
        </ToolsIconContainer>
      ),
      keywords: [
        'invoice',
        'documents',
        'customers',
        'payments',
        'pay',
        'pdf',
        'file',
        'any',
      ],
      disabled: false,
      onPress:undefined,
    },
    {
      id: 7,
      title: 'Sticky Notes',
      navigateTo: undefined,
      icon: color => (
        <ToolsIconContainer>
          <Icon2 name="sticky-note-2" size={24} color={color} />
        </ToolsIconContainer>
      ),
      keywords: [
        'notes',
        'sticky',
        'note',
        'book',
        'copy',
      ],
      disabled: false,
      onPress: () => navigate('Dashboard', {openNotesContainer: true}),
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
    <View
      style={[styles.parent, {backgroundColor: currentTheme.contrastColor}]}>
      <Header backButton setQuery={setQuery} query={query} />
      <View style={[styles.contentContainer]}>
        {searchResults.length === 0 ? (
          <View
            style={{
              height: 'auto',
              backgroundColor: currentTheme.fadeColor,
              borderRadius: 20,
              padding: 15,
              gap: 10,
              marginTop: 20,
            }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: currentTheme.baseColor,
              }}>
              Try searching any tool or feature...
            </Text>
          </View>
        ) : (
          <View
            style={{
              height: 'auto',
              borderRadius: 20,
              padding: 15,
              gap: 10,
              marginTop: 10,
            }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: currentTheme.baseColor,
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
    paddingHorizontal: 10,
    paddingTop: 4,
  },
});
export default SearchFeatures;
