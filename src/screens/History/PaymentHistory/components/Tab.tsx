import {Text, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import LongPressEnabled from '../../../../customComponents/LongPressEnabled';
import {useTheme} from '../../../../hooks';
import {
  PaymentHistory,
  SoldProductPaymentHistory,
  UnknownPaymentHistory,
} from '../../../../../types';
import SlideUpContainer from '../../../../components/SlideUpContainer';
import Icon from 'react-native-vector-icons/AntDesign';
import {colors, deviceHeight} from '../../../../utils/Constants';
import {
  PaymentHistoryReferenceType,
  UnknownPaymentType,
} from '../../../../../enums';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../../store/store';
import {getSinglePaymentHistory} from '../../../../api/api.history';
import SoldProductPaymentDetailContainer from './SoldProductPaymentDetailContainer';
import {useCache} from '../../../../hooks';
import LinearGradient from 'react-native-linear-gradient';

type TabProps = {
  i: PaymentHistory;
  lastIndex?: boolean;
  handleOpenLongPressOptions?: () => void;
  dummy?: boolean;
};

const Tab: React.FC<TabProps> = ({
  i,
  lastIndex = false,
  dummy = false,
}): React.JSX.Element => {
  const cache = useCache();
  const {currentTheme} = useTheme();
  const {currency} = useSelector((s: RootState) => s.appData.app);
  const user = useSelector((s: RootState) => s.appData.user)!;

  const [loading, setLoading] = useState<boolean>(false);
  const [
    openUnknownPaymentHistoryDetails,
    setopenUnknownPaymentHistoryDetails,
  ] = useState<boolean>(false);
  const [openSoldProductHistoryDetails, setopenSoldProductHistoryDetails] =
    useState<boolean>(false);
  const [unknownPaymentHistoryDetails, setUnknownPaymentHistoryDetails] =
    useState<UnknownPaymentHistory | undefined>();
  const [soldProductPaymentDetails, setSoldProductPaymentDetails] = useState<
    SoldProductPaymentHistory | undefined
  >();

  const getPaymentHistory = async () => {
    const cached = cache.get(i.payment);
    if (cached) {
      setSoldProductPaymentDetails(cached);
      setopenSoldProductHistoryDetails(true);
      return;
    }
    setUnknownPaymentHistoryDetails(undefined);
    setSoldProductPaymentDetails(undefined);

    if (i.paymentType === PaymentHistoryReferenceType.SOLD_PRODUCT) {
      setopenSoldProductHistoryDetails(true);
    } else if (i.paymentType === PaymentHistoryReferenceType.UNKNOWN) {
      setopenUnknownPaymentHistoryDetails(true);
    }
    const data = {
      query: {
        role: user.role,
        creatorId: i.createdBy,
        createdBy: i.createdByModel,
        paymentId: i.payment,
        paymentType: i.paymentType,
      },
    };
    const res = await getSinglePaymentHistory(data, setLoading);
    if (res.success && res.data?.paymentDetails) {
      if (i.paymentType === PaymentHistoryReferenceType.SOLD_PRODUCT) {
        cache.set(i.payment, res.data.paymentDetails);
        setSoldProductPaymentDetails(
          res.data.paymentDetails as SoldProductPaymentHistory,
        );
      } else if (i.paymentType === PaymentHistoryReferenceType.UNKNOWN) {
        setUnknownPaymentHistoryDetails(
          res.data.paymentDetails as UnknownPaymentHistory,
        );
      }
    }
  };

  const handleCloseSoldProductPaymentsDetails = () =>
    setopenSoldProductHistoryDetails(false);
  const handleCloseUnknownPaymentsDetails = () =>
    setopenUnknownPaymentHistoryDetails(false);

  return (
    <LongPressEnabled
      longPressAction={() => {}}
      longPressCanceledAction={getPaymentHistory}>
     <LinearGradient
                 colors={[currentTheme.fadeColor, currentTheme.contrastColor]}
                 start={{x: 0, y: 0}}
        style={[
          styles.container,
          {
            marginBottom: 8,
             borderLeftColor: currentTheme.baseColor,
          },
        ]}>
        <View style={styles.infoContainer}>
          <View style={{flexDirection: 'row', gap: 2, alignItems: 'center'}}>
            <Text numberOfLines={1} style={[styles.title, {color: currentTheme.tab.label}]}>
              {i.title}
            </Text>
            {i.paymentType === PaymentHistoryReferenceType.SOLD_PRODUCT && (
              <View
                style={{
                  paddingVertical: 1,
                  paddingHorizontal: 3,
                  backgroundColor: currentTheme.baseColor,
                  borderRadius: 4,
                }}>
                <Text style={{color: currentTheme.contrastColor, fontSize: 8,fontWeight:'600'}}>
                  Sold Product
                </Text>
              </View>
            )}
          </View>

          <Text
            textBreakStrategy="highQuality"
            numberOfLines={1}
            style={[styles.shortnote, {color: currentTheme.baseColor}]}>
            {i.shortNote}
          </Text>
        </View>
        <View style={styles.paymentDetailsContainer}>
          <Text
            numberOfLines={1}
            style={[
              styles.amount,
              {
                color:
                  i.type === UnknownPaymentType.CREDIT
                    ? colors.oliveGreen
                    : colors.danger,
              },
            ]}>
            {`${
              i.type === UnknownPaymentType.CREDIT ? '+' : '-'
            }${i.amount.toFixed(2)}`}
          </Text>
        </View>
      </LinearGradient>
      {openSoldProductHistoryDetails && (
        <SlideUpContainer
          open={openSoldProductHistoryDetails}
          close={handleCloseSoldProductPaymentsDetails}
          height={deviceHeight * 0.36}
          opacity={0.5}>
          <SoldProductPaymentDetailContainer
            details={soldProductPaymentDetails}
          />
        </SlideUpContainer>
      )}
    </LongPressEnabled>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
     borderLeftWidth: 2,
  },
  absolute: {
    position: 'absolute',
  },
  infoContainer: {flex: 7, gap: 4},
  title: {
    fontSize: 14,
    fontWeight: '600',
    maxWidth:'60%'
  },
  shortnote: {
    fontSize: 10,
    fontWeight: '400',
    maxWidth:'80%'
  },
  paymentDetailsContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    flex: 3,
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Tab;
{
  /* {openTabOptions && i && (
          <PopupContainer
            open={openTabOptions}
            close={handleCloseLongPressOptions}
            padding>
            <TabLongPressOptions
              triggerEdit={handleOpenEditCustomer}
              i={i}
              close={handleCloseLongPressOptions}
            />
          </PopupContainer>
        )} */
}
{
  /* {openEditCustomer && i && (
          <SlideUpContainer
            open={openEditCustomer}
            close={handleCloseEditCustomer}
            opacity={0.8}>
            <EditEmployee i={i} close={handleCloseEditCustomer} />
          </SlideUpContainer>
        )} */
}
