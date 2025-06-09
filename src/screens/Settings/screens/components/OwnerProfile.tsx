import {
  View,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  TouchableOpacity,
  Pressable,
  Linking,
} from 'react-native';
import React, {ReactNode, useEffect, useState} from 'react';
import Header from '../../../../components/Header';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../../store/store';
import {useTheme} from '../../../../hooks';
import {Owner} from '../../../../../types';
import {copyTextToClipboard} from '../../../../service/fn';
import {colors, deviceHeight, deviceWidth} from '../../../../utils/Constants';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/Entypo';
import Icon2 from 'react-native-vector-icons/Feather';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import SlideUpContainer from '../../../../components/SlideUpContainer';
import FeatureInfoContainer from '../../../../components/FeatureInfoContainer';
import {OWNER_PROPERTIES, OwnerPropertyObjType} from '../../../../utils/data';
import {navigate} from '../../../../utils/nagivationUtils';

const OwnerProfile = () => {
  const {currentTheme} = useTheme();
  const owner = useSelector((s: RootState) => s.appData.user) as Owner;
  const {currency} = useSelector((s: RootState) => s.appData.app);

  const [showNotice, setShowNotice] = useState<boolean>(false);
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [info, setInfo] = useState<{
    label: string;
    text1?: string;
    text2?: string;
    text3?: string;
  }>({label: ''});

  const noticeBoardY = useSharedValue(0);
  const noticeBoardAnimatedStyles = useAnimatedStyle(() => ({
    transform: [{translateY: withTiming(noticeBoardY.value, {duration: 300})}],
  }));

  const closeNotice = () => setShowNotice(false);
  const openNotice = () => setShowNotice(true);

  const openReferralCodeInfo = () => {
    setInfo({
      label: 'How do referral codes work?',
      text1:
        'Share your code with new users. When they sign up using it, you both get 30 credits.',
      text2: 'Credits can be used for discounts, premium features, or rewards.',
      text3:
        'The code must be entered during sign-up. It can’t be applied afterward.',
    });
    setShowInfo(true);
  };

  const NoticeBoard = () => {
    useEffect(() => {
      let showNoticeTimeRef: NodeJS.Timeout | null = null;
      if (showNotice) {
        showNoticeTimeRef = setTimeout(() => closeNotice(), 6000);
      }
      return () => {
        if (showNoticeTimeRef) {
          clearTimeout(showNoticeTimeRef);
        }
      };
    }, [showNotice]);

    return (
      <Animated.View
        style={[
          {
            minWidth: 180,
            width: deviceWidth * 0.6,
            maxWidth: 280,
            position: 'absolute',
            backgroundColor: currentTheme.contrastColor,
            borderRadius: 14,
            top: 50,
            right: 10,
            zIndex: 4,
          },
          noticeBoardAnimatedStyles,
        ]}>
        <View
          style={{
            backgroundColor: colors.dangerFade,
            borderWidth: 1,
            borderColor: colors.danger,
            borderRadius: 14,
            paddingVertical: 8,
            paddingHorizontal: 20,
            flexDirection: 'row',
          }}>
          <Text style={{color: colors.danger}}>
            <Text style={{textDecorationLine: 'underline'}}>NOTICE</Text>:
            Direct profile edits are{' '}
            <Text style={{fontWeight: '600'}}>NOT</Text> permitted through this
            app for security reasons.
          </Text>
          <Pressable style={{}} onPress={closeNotice}>
            <Icon name="closecircle" size={14} color={colors.danger} />
          </Pressable>
        </View>
      </Animated.View>
    );
  };

  const HeaderCustomComponent = ({render}: {render: ReactNode}) => {
    return <View>{render}</View>;
  };

  useEffect(() => {
    const noticeTimeOutRef = setTimeout(() => setShowNotice(true), 1000);
    return () => {
      if (noticeTimeOutRef) {
        clearTimeout(noticeTimeOutRef);
      }
    };
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[
        styles.parent,
        {backgroundColor: currentTheme.contrastColor, position: 'relative'},
      ]}>
      {showNotice && <NoticeBoard />}
      <Header
        name="Profile"
        backButton
        customTitle={
          <View style={{alignItems: 'center'}}>
            <Text style={{color: '#fff', fontSize: 22, fontWeight: 'bold'}}>
              Profile
            </Text>
            {owner.documentAcceptance.terms.accepted &&
              owner.documentAcceptance.privacyPolicy.accepted && (
                <View style={{flexDirection: 'row', gap: 4}}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{color: currentTheme.header.textColor}}>
                      Terms{' '}
                    </Text>
                    <Icon1
                      name="check"
                      size={12}
                      color={currentTheme.header.textColor}
                    />
                  </View>
                  <Text
                    style={{
                      color: currentTheme.header.textColor,
                      fontWeight: '900',
                      position: 'relative',
                      bottom: 3,
                    }}>
                    .
                  </Text>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{color: currentTheme.header.textColor}}>
                      Privacy policy{' '}
                    </Text>
                    <Icon1
                      name="check"
                      size={12}
                      color={currentTheme.header.textColor}
                    />
                  </View>
                </View>
              )}
          </View>
        }
        headerBgColor={currentTheme.baseColor}
        titleColor={currentTheme.header.textColor}
        curved
        customComponent={true}
        renderItem={
          <HeaderCustomComponent
            render={
              <Icon2
                name="edit"
                size={20}
                color={currentTheme.header.textColor}
              />
            }
          />
        }
        customAction={() =>
          navigate('WebViewScreen', {
            uri: 'http://192.168.1.71:3000/home?redirect=update_owner',
          })
        }
        customAction1={openNotice}
        renderItem1={
          <HeaderCustomComponent
            render={
              <Icon1
                name="info-with-circle"
                size={20}
                color={currentTheme.header.textColor}
              />
            }
          />
        }
      />

      <View style={styles.profileContainer}>
        {owner.image && (
          <Image
            source={{uri: owner.image}}
            style={styles.profileImage}
            resizeMode="cover"
          />
        )}
        <Text style={[styles.profileName, {color: currentTheme.baseColor}]}>
          {owner.name}
        </Text>
        <View style={styles.underlineAccent} />
        <Text style={[styles.subText, {color: currentTheme.baseColor}]}>
          Business Owner
        </Text>
        <View
          style={{
            flexDirection: 'row',
            gap: 8,
            alignItems: 'center',
            marginTop: 10,
          }}>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => copyTextToClipboard(owner.referralCode)}>
            <Text
              style={[styles.referralCode, {color: currentTheme.baseColor}]}>
              Ref. Code: {owner.referralCode || 'N/A'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={openReferralCodeInfo}
            style={{alignItems: 'center'}}>
            <Icon1
              name="info-with-circle"
              size={14}
              color={currentTheme.baseColor}
            />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView
        style={{flex: 1, paddingTop: 8}}
        showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          <View style={styles.card}>
            <DataDisplay label="Business Name" value={owner.businessName} />
            <DataDisplay
              label="Business Phone Number"
              value={owner.businessPhoneNumber?.value}
            />
            <DataDisplay
              label="Business Address"
              value={owner.businessAddress}
            />
            <DataDisplay label="GST Number" value={owner.gstNumber} />
            <DataDisplay
              label="Business Type"
              value={owner.businessType?.toUpperCase()}
            />
            {owner.businessDescription && (
              <DataDisplay
                label="Business Description"
                value={owner.businessDescription}
              />
            )}

            <DataDisplay
              label="Credits"
              value={`${currency} ${owner.credits}`}
            />
            <DataDisplay
              label="Total Employees"
              value={`${owner.employeeData.length}`}
            />
            <DataDisplay
              label="Total Partners"
              value={`${owner.businessPartners.length}`}
            />
            <DataDisplay
              label="Total Products"
              value={`${owner.inventory.length}`}
            />
            <DataDisplay
              label="Total Customers"
              value={`${owner.customers.length}`}
            />
            <DataDisplay
              label="Equity %"
              value={`${owner.equity.toFixed(2)}%`}
            />
          </View>
          <View style={styles.card}>
            <Text style={styles.permissionsCardLabel}>Properties</Text>
            <PermissionTab
              label={'Private account:'}
              allowed={owner.properties.isPrivate}
              permissionDetails={OWNER_PROPERTIES['privateAccount']}
            />
            <PermissionTab
              label={'Account disabled:'}
              allowed={owner.properties.isDisabled}
              permissionDetails={OWNER_PROPERTIES['accountDisabled']}
            />
            <PermissionTab
              label={'Business info access:'}
              allowed={owner.properties.accessBusinessInfo}
              permissionDetails={OWNER_PROPERTIES['accessBusinessInfo']}
            />
            <PermissionTab
              label={'Business searchable:'}
              allowed={owner.properties.searchable}
              permissionDetails={OWNER_PROPERTIES['businessSearchable']}
            />
            <PermissionTab
              label={'Employees searchable:'}
              allowed={owner.properties.employeeSearchable}
              permissionDetails={OWNER_PROPERTIES['employeeSearchable']}
            />

            <PermissionTab
              label={'Partner searchable:'}
              allowed={owner.properties.partnerSearchable}
              permissionDetails={OWNER_PROPERTIES['partnerSearchable']}
            />
          </View>
        </View>
      </ScrollView>
      <SlideUpContainer
        open={showInfo}
        close={() => setShowInfo(false)}
        height={deviceHeight * 0.35}>
        <FeatureInfoContainer info={info} />
      </SlideUpContainer>
    </KeyboardAvoidingView>
  );
};

const DataDisplay = ({label, value}: {label: string; value?: string}) => (
  <View style={styles.dataItem}>
    <Text style={styles.dataLabel}>{label}</Text>
    <Text style={styles.dataValue}>{value || 'N/A'}</Text>
  </View>
);
const PermissionTab = ({
  label,
  allowed,
  iconColor = '#7f8c8d',
  permissionDetails,
}: {
  label: string;
  allowed?: boolean;
  iconColor?: string;
  permissionDetails: OwnerPropertyObjType;
}) => {
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [info, setInfo] = useState<{
    label: string;
    text1?: string;
    text2?: string;
    text3?: string;
  }>({label: ''});
  const handleShowInfo = () => {
    setInfo({
      label: permissionDetails.title,
      text1: permissionDetails.description,
    });
    setShowInfo(true);
  };
  return (
    <View style={styles.dataItem}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={styles.dataLabel}>{label}</Text>
        <Pressable onPress={handleShowInfo}>
          <Icon1 name="info-with-circle" size={12} color={iconColor} />
        </Pressable>
      </View>
      <Text
        style={[
          styles.dataValue,
          {color: allowed ? colors.oliveGreen : colors.danger},
        ]}>
        {allowed ? 'Yes' : 'No'}
      </Text>
      <SlideUpContainer
        open={showInfo}
        close={() => setShowInfo(false)}
        height={deviceHeight * 0.35}>
        <FeatureInfoContainer info={info} />
      </SlideUpContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
  },
  profileContainer: {
    marginTop: 20,
    alignItems: 'center',
    marginBottom: 32,
    padding: 16,
    backgroundColor: '#f7f9fc',
    borderRadius: 20,
    elevation: 3,
    marginHorizontal: 16,
  },
  contentContainer: {
    paddingHorizontal: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#2ecc71',
  },
  referralCode: {
    fontSize: 13,
    fontWeight: '600',
  },

  profileName: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  subText: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1,
  },
  underlineAccent: {
    width: 36,
    height: 3,
    backgroundColor: '#2ecc71',
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
  permissionsCardLabel: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 8,
    fontWeight: '600',
    letterSpacing: 0.3,
    textDecorationLine: 'underline',
  },
});

export default OwnerProfile;
