import {View, StyleSheet, FlatList, Pressable} from 'react-native';
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
import {getUserByIdAPI} from '../../api/api.user';
import {AdminRole} from '../../../enums';
import {Employee, Owner, Partner} from '../../../types';
import OwnerCard from './components/subcomponents/OwnerCard';

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
  const user = useSelector((s: RootState) => s.appData.user)!;
  const [searchResults, setSearchResults] = useState<ToolsData[]>([]);
  const [query, setQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [ownerResult, setOwnerResult] = useState<Owner | undefined>(undefined);
  const [employeeResult, setEmployeeResult] = useState<Employee | undefined>(
    undefined,
  );
  const [partnerResult, setPartnerResult] = useState<Partner | undefined>(
    undefined,
  );
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

  const handleAdvanceQuerySearch = async () => {
    let reqFor: AdminRole | undefined = undefined;
    let userId: string = '';
    if (query.trim().length > 5) {
      if (query.startsWith('@', 0) && query.trim().length > 5) {
        reqFor = AdminRole.OWNER;
        userId = query.slice(1);
      }
      if (reqFor && userId.trim().length >= 4) {
        const data = {
          query: {
            userId,
            reqFor,
            role: user.role,
          },
        };
        const res = await getUserByIdAPI(data, setLoading);
        if (res.success && res.data && res.data.user && res.data.userType) {
          if (res.data.userType === AdminRole.OWNER) {
            setOwnerResult(res.data.user as Owner);
          } else if (res.data.userType === AdminRole.EMPLOYEE) {
            setEmployeeResult(res.data.user as Employee);
          } else if (res.data.userType === AdminRole.PARTNER) {
            setPartnerResult(res.data.user as Partner);
          } else {
            setOwnerResult(undefined);
            setEmployeeResult(undefined);
            setPartnerResult(undefined);
          }
        } else {
          setOwnerResult(undefined);
          setEmployeeResult(undefined);
          setPartnerResult(undefined);
        }
      }
    } else {
      setOwnerResult(undefined);
      setEmployeeResult(undefined);
      setPartnerResult(undefined);
    }
  };

  useEffect(() => {
    handleSearchQuery();
    handleAdvanceQuerySearch();
  }, [query]);

  return (
    <View style={styles.parent}>
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
              marginTop:20
            }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: currentTheme.baseColor,
              }}>
              Try searching any tool or feature...
            </Text>
            {/* <View
              style={{
                height: 'auto',
                backgroundColor: currentTheme.contrastColor,
                borderRadius: 20,
                paddingTop: 15,
                paddingHorizontal: 15,
                paddingBottom: 5,
                gap: 10,
              }}>
              <Text style={{fontSize: 16, fontWeight: 600}}>
                Search query guide:
              </Text>
              <Text style={{fontSize: 16, fontWeight: 400}}>
                *Use '@' to search Owners.
              </Text>
              <Text style={{fontSize: 16, fontWeight: 400}}>
                *Use '$' to search specific customer.
              </Text>
              <Text style={{fontSize: 16, fontWeight: 400}}>
                *Use '#' to find any product in your inventory.
              </Text>
              <Pressable>
                <Text
                  style={{
                    color: currentTheme.baseColor,
                    textAlign: 'center',
                    fontSize: 14,
                  }}>
                  Learn more.
                </Text>
              </Pressable> 
            </View>*/}
          </View>
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
    paddingHorizontal: 10,
    paddingTop: 4,
  },
});
export default SearchFeatures;
