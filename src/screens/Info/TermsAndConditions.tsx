import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Linking,
  TouchableOpacity,
} from 'react-native';
import Icon1 from 'react-native-vector-icons/AntDesign';
import {useTheme, useCache} from '../../hooks';
import {back} from '../../utils/nagivationUtils';
import {PrivacyPolicy, TermsAndConditions as TnC} from '../../../types';
import {getPrivacyPolicyAPI, getTermsAndConditionsAPI} from '../../api/api.tc';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {LegalDocType} from '../../../enums';
import {deviceHeight} from '../../utils/Constants';

const TermsAndConditions = () => {
  const {currentTheme} = useTheme();
  const {set, get} = useCache();
  const [tncData, setTncData] = useState<TnC | undefined>(undefined);
  const [ppData, setPpData] = useState<PrivacyPolicy | undefined>(undefined);
  const [loadingTnc, setLoadingTnc] = useState<boolean>(false);
  const [loadingPp, setLoadingPp] = useState<boolean>(false);
  const [openpp, setopenpp] = useState<boolean>(false);
  const [headerExpanded, setHeaderExpanded] = useState<boolean>(false);

  const headerHeight = useSharedValue(90);
  const contactIconAngle = useSharedValue(0);
  const contactContentOpacity = useSharedValue(0);
  const ppContentOpacity = useSharedValue(0);
  const contactIconAnimated = useAnimatedStyle(() => ({
    transform: [
      {rotate: withTiming(`${contactIconAngle.value}deg`, {duration: 400})},
    ],
  }));
  const headerAnimated = useAnimatedStyle(() => ({
    height: withTiming(headerHeight.value, {duration: 400}),
  }));
  const contactContentAnimated = useAnimatedStyle(() => ({
    opacity: withTiming(contactContentOpacity.value, {duration: 200}),
  }));
  const ppContentAnimated = useAnimatedStyle(() => ({
    opacity: withTiming(ppContentOpacity.value, {duration: 200}),
  }));

  const getTnc = async () => {
    const cachedTnc = get(LegalDocType.tnc) as TnC;
    if (cachedTnc) {
      setTncData(cachedTnc);
      return;
    }
    const res = await getTermsAndConditionsAPI(setLoadingTnc);
    if (res.success && res.data && res.data.tnc) {
      setTncData(res.data.tnc);
      set(res.data.tnc.documentType, res.data.tnc);
    }
  };
  const getPp = async () => {
    const cachedTnc = get(LegalDocType.pp) as PrivacyPolicy;
    if (cachedTnc) {
      setPpData(cachedTnc);
      return;
    }
    const res = await getPrivacyPolicyAPI(setLoadingPp);
    if (res.success && res.data && res.data.pp) {
      setPpData(res.data.pp);
      set(res.data.pp.documentType, res.data.pp);
    }
  };
  useEffect(() => {
    getTnc();
  }, []);
  useEffect(() => {
    headerHeight.value = headerExpanded ? 250 : 90;
    headerHeight.value = openpp
      ? deviceHeight * 0.8
      : headerExpanded
      ? 250
      : 90;
    contactIconAngle.value = headerExpanded ? 180 : 0;
    setTimeout(() => {
      if (headerExpanded) {
        contactContentOpacity.value = 1;
      } else {
        contactContentOpacity.value = 0;
      }
      if (openpp) {
        ppContentOpacity.value = 1;
      } else {
        ppContentOpacity.value = 0;
      }
    }, 420);
  }, [headerExpanded, openpp]);

  const PP = () => (
    <Animated.View style={[ppContentAnimated, {flex: 1}]}>
      <View
        style={{
          backgroundColor: currentTheme.contrastColor,
          marginBottom: 10,
          borderRadius: 20,
          flex: 1,
        }}>
        <TouchableOpacity
          style={{
            position: 'absolute',
            right: 20,
            top: 25,
            backgroundColor: currentTheme.baseColor,
            paddingVertical: 2,
            paddingHorizontal: 6,
            borderRadius: 20,
            zIndex: 999,
          }}
          onPress={() => {
            setopenpp(false);
            headerExpanded && setHeaderExpanded(false);
          }}>
          <Text
            style={{
              textAlign: 'center',
              fontWeight: '900',
              color: currentTheme.contrastColor,
              fontSize: 12,
            }}>
            Close
          </Text>
        </TouchableOpacity>
        {loadingPp ? (
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <ActivityIndicator size={40} />
          </View>
        ) : !ppData ? (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 20,
            }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: '600',
                textAlign: 'center',
              }}>
              Nothing to show here!
            </Text>
          </View>
        ) : (
          <View style={{flex: 1, padding: 20}}>
            <Text style={[styles.title, {color: currentTheme.textColor}]}>
              {ppData.title.replace('$$APP_NAME$$', '"onlySales"')}
            </Text>
            <Text style={[styles.dateText, {color: currentTheme.textAlt}]}>
              Effective Date:{' '}
              {ppData.effectiveDate
                .split('_')
                .reverse()
                .join(', ')
                .toLowerCase()}
            </Text>
            <ScrollView
              style={{borderRadius: 20, paddingHorizontal: 10, flex: 1}}
              contentContainerStyle={styles.scrollContainer}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={true}>
              {ppData.pp.map((s, i) => (
                <View key={i} style={styles.sectionContainer}>
                  <Text
                    style={[
                      styles.sectionTitle,
                      {color: currentTheme.textColor},
                    ]}>
                    {s.title.replace('$$APP_NAME$$', '"onlySales"')}
                  </Text>
                  {s.content.map((item, idx) => (
                    <View key={idx} style={styles.contentItem}>
                      <Text
                        style={[
                          styles.pointPP,
                          {color: currentTheme.textColor},
                        ]}>
                        {item.point}
                      </Text>
                      <Text
                        style={[
                          styles.descriptionPP,
                          {color: currentTheme.textAlt},
                        ]}>
                        {item.description.replace(
                          '$$APP_NAME$$',
                          '"onlySales"',
                        )}
                      </Text>
                    </View>
                  ))}
                </View>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView
      style={[styles.screen, {backgroundColor: currentTheme.contrastColor}]}>
      <Animated.View
        style={[
          {borderBottomWidth: 1, borderColor: '#eee', overflow: 'hidden'},
          headerAnimated,
        ]}>
        <View style={styles.header}>
          <View style={{flexDirection: 'row', gap: 20}}>
            <Pressable onPress={() => back()} style={styles.backButton}>
              <Icon1 name="left" size={24} color={currentTheme.textColor} />
            </Pressable>
            <View>
              <Text style={[styles.heading, {color: currentTheme.textColor}]}>
                Terms & Conditions
              </Text>
              <Text style={[styles.subText, {color: currentTheme.textAlt}]}>
                Effective Date:{' '}
                {tncData
                  ? tncData.effectiveDate.split('_').join(' ').toLowerCase()
                  : loadingTnc
                  ? 'Fetching latest data...'
                  : 'unavailable'}
              </Text>
            </View>
          </View>
          <Pressable
            style={{
              flexDirection: 'row',
              gap: 6,
              alignItems: 'flex-end',
            }}
            onPress={() => setHeaderExpanded(!headerExpanded)}>
            <Text style={{fontSize: 14, fontWeight: '600'}}>Contact us</Text>
            <Animated.View style={contactIconAnimated}>
              <Icon1 name="down" size={18} color={currentTheme.textColor} />
            </Animated.View>
          </Pressable>
        </View>
        {headerExpanded && (
          <Animated.View
            style={[
              {paddingHorizontal: 18, paddingTop: 10, paddingBottom: 12},
              contactContentAnimated,
            ]}>
            <Text
              style={[styles.contactTitle, {color: currentTheme.textColor}]}>
              Need Help?
            </Text>
            <Text style={[styles.contactText, {color: currentTheme.textAlt}]}>
              For any queries, issues, or feedback related to our services or
              terms, feel free to contact our support team.
            </Text>

            <View style={{marginTop: 8}}>
              <Text
                style={[styles.contactLabel, {color: currentTheme.textColor}]}>
                📧 Email:
              </Text>
              <Pressable
                onPress={() => {
                  Linking.openURL('mailto:support@onlySales.com');
                }}>
                <Text style={[styles.contactLink]}>support@onlySales.com</Text>
              </Pressable>
            </View>

            <View style={{marginTop: 10}}>
              <Text
                style={[styles.contactLabel, {color: currentTheme.textColor}]}>
                🕐 Support Hours:
              </Text>
              <Text style={[styles.contactText, {color: currentTheme.textAlt}]}>
                Monday to Friday, 9:00 AM – 6:00 PM (IST)
              </Text>
            </View>
          </Animated.View>
        )}
        {openpp && <PP />}
      </Animated.View>

      {loadingTnc ? (
        <View style={{flex: 1, alignItems: 'center'}}>
          <ActivityIndicator size={40} style={{marginTop: 200}} />
        </View>
      ) : !tncData ? (
        <View style={{flex: 1, alignItems: 'center', paddingHorizontal: 20}}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: '600',
              textAlign: 'center',
              marginTop: 160,
            }}>
            Nothing to show here!
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {tncData.tnc.map(({title, content}, index) => (
            <View
              key={index}
              style={[styles.block, {borderColor: currentTheme.baseColor}]}>
              <Text style={[styles.category, {color: currentTheme.baseColor}]}>
                {title}
              </Text>
              {content.map(({point, description}, idx) => (
                <View key={idx} style={styles.listItem}>
                  {point ? (
                    <Text
                      style={[styles.point, {color: currentTheme.textColor}]}>
                      {point.replace('$$APP_NAME$$', `'"onlySales"'`)}
                    </Text>
                  ) : null}
                  <Text
                    style={[styles.description, {color: currentTheme.textAlt}]}>
                    {description.replace('$$APP_NAME$$', `'"onlySales"'`)}
                  </Text>
                </View>
              ))}
            </View>
          ))}
          <View style={[styles.block, {borderColor: currentTheme.baseColor}]}>
            <Text style={[styles.category, {color: currentTheme.baseColor}]}>
              13. Data Security and Privacy Commitment
            </Text>

            <View style={styles.listItem}>
              <Text style={[styles.point, {color: currentTheme.textColor}]}>
                Your Data Ownership:
              </Text>
              <Text style={[styles.description, {color: currentTheme.textAlt}]}>
                We firmly believe that the data you input into "onlySales"
                remains your sole property. We do not claim any ownership over
                your business data.
              </Text>
            </View>

            <View style={styles.listItem}>
              <Text style={[styles.point, {color: currentTheme.textColor}]}>
                Privacy Policy Details:
              </Text>
              <Text style={[styles.description, {color: currentTheme.textAlt}]}>
                For a comprehensive understanding of how your data is handled,
                where it is stored, and the measures we take to protect it,
                please refer to our dedicated Privacy Policy below:-
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setopenpp(true);
                  getPp();
                }}>
                <Text style={{color: '#007bff'}}>click here.</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.listItem, {marginTop: 4}]}>
              <Text style={[styles.point, {color: currentTheme.textColor}]}>
                AI Model Enhancement:
              </Text>
              <Text style={[styles.description, {color: currentTheme.textAlt}]}>
                To further improve the accuracy and effectiveness of our AI
                models and for general system improvements, we may use
                anonymized datasets derived from user interactions.
              </Text>
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 18,
    paddingVertical: 16,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  backButton: {
    marginTop: 2,
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
  },
  subText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 3,
    textTransform: 'capitalize',
  },
  contactTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  contactText: {
    fontSize: 13,
    lineHeight: 18,
  },
  contactLabel: {
    fontWeight: '600',
    fontSize: 13,
    marginBottom: 1,
  },
  contactLink: {
    fontSize: 13,
    color: '#007bff',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 80,
  },
  block: {
    borderLeftWidth: 3,
    paddingLeft: 16,
    marginBottom: 22,
  },
  category: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 10,
  },
  listItem: {
    marginBottom: 14,
  },
  point: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
  dateText: {
    fontSize: 13,
    marginBottom: 14,
  },
  sectionContainer: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
  },
  contentItem: {
    marginBottom: 10,
  },
  pointPP: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
  },
  descriptionPP: {
    fontSize: 13,
    lineHeight: 18,
  },
});

export default TermsAndConditions;
