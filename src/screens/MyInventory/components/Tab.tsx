import {
  Text,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Pressable,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import {Product} from '../../../../types';
import {useAnalytics, useTheme} from '../../../hooks/index';
import LongPressEnabled from '../../../customComponents/LongPressEnabled';
import EditProduct from './EditProduct';
import SlideUpContainer from '../../../components/SlideUpContainer';
import PopupContainer from '../../../components/PopUp';
import TabLongPressOptions from './TabLongPressOptions';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../store/store';
import {useTranslation} from 'react-i18next';
import AIAnalyticsContainer from './AIAnalyticsContainer';
import {analyseSingleProductAIAPI} from '../../../api/api.ai';
import {showToast} from '../../../service/fn';
import Icon from 'react-native-vector-icons/Entypo';
import Icon1 from 'react-native-vector-icons/Ionicons';
import FeatureInfoContainer from '../../../components/FeatureInfoContainer';
import {AIResponseLengthType} from '../../../../enums';
import {colors, deviceHeight, deviceWidth} from '../../../utils/Constants';
import ProductPreview from './ProductPreview';
import LinearGradient from 'react-native-linear-gradient';
const COHERE_LOGO0 = require('../../../assets/images/Cohere-Logo0.png');
const NoPhoto = require('../../../assets/images/no_product_image.jpg');

type TabProps = {
  i: Product;
  lastIndex?: boolean;
};
const analysisOptions = {
  short: {
    id: 1,
    name: 'Keep it short.',
    cost: 1,
    colorScheme: '#A5D6A7',
    description: (p: Product) =>
      `A short overview for ${p.name}, including today's performance analytics.`,
    estimatedOutputTokenUsage: 220,
    actiontype: AIResponseLengthType.sm,
  },
  medium: {
    id: 2,
    name: 'Little extra details.',
    cost: 1.8,
    colorScheme: '#4DD0E1',
    description: (p: Product) =>
      `A brief overview for ${p.name}, covering today's performance along with a quick look at weekly and monthly analytics. Includes short notes on current trends and areas of improvement.`,
    estimatedOutputTokenUsage: 500,
    actiontype: AIResponseLengthType.md,
  },
  detailed: {
    id: 3,
    name: 'In-depth analysis.',
    cost: 3,
    colorScheme: '#42A5F5',
    description: (p: Product) =>
      `A comprehensive analysis of ${p.name}, with detailed insights into daily, weekly, and monthly performance. Highlights strengths, positive trends, and suggests clear areas for improvement.`,
    estimatedOutputTokenUsage: 1050,
    actiontype: AIResponseLengthType.lg,
  },
};

const Tab: React.FC<TabProps> = ({i, lastIndex = false}): React.JSX.Element => {
  const {currentTheme} = useTheme();
  const {owner} = useAnalytics();
  const {t} = useTranslation('inventory');
  const {currency} = useSelector((s: RootState) => s.appData.app);
  const user = useSelector((s: RootState) => s.appData.user)!;
  const [AIResponse, setAIResponse] = useState<string | undefined>();
  const [prefrenceInfo, setPrefrenceInfo] = useState<{
    label: string;
    text1?: string;
    text2?: string;
    text3?: string;
  }>({label: ''});
  const [showAIResponse, setShowAIResponse] = useState<boolean>(false);
  const [openAnalyticsPrefrenceDetails, setOpenAnalyticsPrefrenceDetails] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [openPreview,setOpenPreview]=useState<boolean>(false);
  const [askAnalysisPrefrence, setAskAnalyticsPrefrence] =
    useState<boolean>(false);
  const [openLongPressOptions, setOpenLongPressOptions] =
    useState<boolean>(false);
  const handleClickingTab = () => {
    setOpenPreview(true);
  };
  const handleClosePreview=()=>setOpenPreview(false)
  const handleOpenLongPressOptions = () => setOpenLongPressOptions(true);
  const handleCloseLongPressOptions = () => setOpenLongPressOptions(false);

  const requestAIAnalysis4SingleProduct = async ({
    rl,
  }: {
    rl?: AIResponseLengthType;
  }) => {
    setShowAIResponse(true);
    const data = {
      query: {
        oid: owner._id,
        productId: i._id,
        role: user.role,
        rl: rl || AIResponseLengthType.sm,
      },
    };
    const res = await analyseSingleProductAIAPI(data, setLoading);
    if (res.success && res.data && res.data.response) {
      setAIResponse(res.data.response);
    } else {
      setShowAIResponse(false);
      showToast({
        type: 'error',
        text1: res.message,
      });
    }
  };
  const handleClosePrefrenceDetails = () =>
    setOpenAnalyticsPrefrenceDetails(false);
  const handleOpenPrefrenceDetails = (
    label: string,
    description: string,
    tokens: number,
  ) => {
    setPrefrenceInfo({
      label,
      text1: description,
      text2: `Estimated credit usage: ${((tokens * 0.01) / 1000).toFixed(4)}`,
    });
    setOpenAnalyticsPrefrenceDetails(true);
  };
  const handleChangePrefrence = () => {
    setAIResponse(undefined);
    setShowAIResponse(false);
    setAskAnalyticsPrefrence(true);
  };

  const ProductInfo = () => {
    const netProfit =
      i.productCost &&
      parseFloat(
        (i.discountedPrice && i.discountedPrice > 0
          ? (i.discountedPrice / i.productCost) * 100 - 100
          : (i.basePrice / i.productCost) * 100 - 100
        ).toFixed(1),
      );

    return (
      <>
        <LinearGradient colors={[colors.yellowFade,currentTheme.contrastColor]} start={{x: 0, y: 0}} style={styles.tabLabel}>
          <Text style={[styles.productName]}>{i.name}</Text>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              columnGap: 4,
              paddingHorizontal: 4,
              borderRadius: 10,
              backgroundColor: colors.yellowFade,
              alignItems: 'center',
            }}
            activeOpacity={0.8}
            onPress={() => setAskAnalyticsPrefrence(true)}>
            <Image source={COHERE_LOGO0} style={{height: 13, width: 13}} />
            <Text
              numberOfLines={1}
              style={{fontSize: 12, fontWeight: '900', fontStyle: 'italic'}}>
              Analyse
            </Text>
          </TouchableOpacity>
        </LinearGradient>
        <View
          style={[
            styles.productInfoContainer,
            {backgroundColor: currentTheme.contrastColor},
          ]}>
          <View
            style={[
              styles.imageContainer,
              {
                borderColor: colors.yellow,
                borderTopLeftRadius: 10,
                borderBottomLeftRadius: 10,
                overflow: 'hidden',
              },
            ]}>
            <Image
              source={
                i.image && i.image.trim().length !== 0
                  ? {uri: i.image}
                  : NoPhoto
              }
              style={{
                height: '100%',
                width: '100%',
                borderTopLeftRadius: 8,
                borderBottomLeftRadius: 8,
                borderWidth: 1,
                borderColor: currentTheme?.contrastColor || '#000',
              }}
            />
          </View>
          <View
            style={{
              flex: 1,
              height: '100%',
              borderTopWidth: 2,
              borderBottomWidth: 2,
              borderRightWidth: 2,
              borderColor: colors.yellow,
              borderTopRightRadius: 10,
              borderBottomRightRadius: 10,
              paddingLeft: 8,
            }}>
            <View
              style={[
                styles.infoContainer,
                {flexDirection: 'row', alignItems: 'flex-end'},
              ]}>
                 <Text
                  style={
                    styles.infoText
                  }>
                  {"Price: "}
                </Text>
 {(typeof i.discountedPrice === 'number' ||
                typeof i.discountedPrice === 'string') &&
              i.discountedPrice ? (
                <Text
                  style={[
                    styles.infoText,
                    {fontSize: 8, textDecorationLine: 'line-through'},
                  ]}>
                  {i.basePrice.toString()}
                </Text>
              ) : null}
              <Text style={styles.infoText}>{i.basePrice}</Text>
            </View>
            {(typeof i.discountedPrice === 'number' ||
              typeof i.discountedPrice === 'string') &&
            i.discountedPrice ? (
              <View style={styles.infoContainer}>
                <Text numberOfLines={1} style={[styles.infoText]}>
                  {`${String(t('i_tab_discountedPrice'))}: ${String(
                    currency,
                  )} ${String(i.discountedPrice)}`}
                </Text>
              </View>
            ) : null}

            <View style={styles.infoContainer}>
              <Text numberOfLines={1} style={[styles.infoText]}>
                {t('i_tab_includes')}: {i.quantity} item
              </Text>
            </View>
            <View style={styles.infoContainer}>
              <Text numberOfLines={1} style={[styles.infoText]}>
                {t('i_tab_totalSold')}: {i.totalSold}
              </Text>
            </View>

            {i.inStock && (
              <View style={styles.infoContainer}>
                <Text numberOfLines={1} style={[styles.infoText]}>
                  {t('i_tab_stock')}: {i.inStock ? 'IN_STOCK' : 'OUT_OF_STOCK'}
                </Text>
              </View>
            )}

            <View style={styles.infoContainer}>
              <Text numberOfLines={1} style={[styles.infoText]}>
                {t('i_tab_productCost')}: {currency} {i.productCost}
              </Text>
            </View>
            <View style={styles.infoContainer}>
              <Text numberOfLines={1} style={[styles.infoText]}>
                {`${t('i_tab_netProfit')}: ${netProfit}%`}
              </Text>
            </View>
          </View>
        </View>
      </>
    );
  };

  const ProductDetails = () => (
    <LongPressEnabled
      longPressCanceledAction={handleClickingTab}
      longPressAction={handleOpenLongPressOptions}>
      <View
        style={[
          styles.container,
          {
            marginBottom: lastIndex ? 70 : 6,
            backgroundColor: currentTheme.contrastColor,
          },
        ]}>
        {askAnalysisPrefrence ? (
          <View
            style={{
              flex: 1,
              backgroundColor: currentTheme.contrastColor,
              borderRadius: 12,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 20,
                alignItems: 'center',
                marginTop: 10,
              }}>
              <Pressable
                onPress={() => setAskAnalyticsPrefrence(false)}
                style={{justifyContent: 'center'}}>
                <Icon1 name="chevron-back" size={20} />
              </Pressable>
              <Text
                numberOfLines={1}
                style={{
                  textAlign: 'center',
                  fontSize: 18,
                  fontWeight: '600',
                }}>
                Choose your prefrence.
              </Text>
              <View />
            </View>
            <ScrollView style={{padding: 10}} contentContainerStyle={{gap: 6}}>
              {Object.values(analysisOptions).map(s => (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    height: 50,
                    alignItems: 'center',
                    paddingRight: 10,
                  }}
                  key={s.id}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: currentTheme.fadeColor,
                      borderRadius: 12,
                      justifyContent: 'center',
                      paddingLeft: 10,
                      paddingRight: 20,
                      width: 260,
                      height: '100%',
                    }}
                    onPress={() => {
                      setAskAnalyticsPrefrence(false);
                      requestAIAnalysis4SingleProduct({rl: s.actiontype});
                    }}
                    activeOpacity={0.8}>
                    <View>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: 16,
                          fontWeight: '600',
                          fontStyle: 'italic',
                        }}>
                        {s.name}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: '400',
                          fontStyle: 'italic',
                        }}
                        numberOfLines={1}>
                        {s.description(i)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      height: 18,
                      width: 18,
                      backgroundColor: currentTheme.baseColor,
                      borderRadius: 10,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onPress={() =>
                      handleOpenPrefrenceDetails(
                        s.name,
                        s.description(i),
                        s.estimatedOutputTokenUsage,
                      )
                    }
                    activeOpacity={0.8}>
                    <Icon
                      name="info"
                      size={12}
                      color={currentTheme.contrastColor}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        ) : (
          <ProductInfo />
        )}
       
        <PopupContainer
          open={openLongPressOptions}
          close={handleCloseLongPressOptions}
          padding={true}>
          <TabLongPressOptions i={i} close={handleCloseLongPressOptions} />
        </PopupContainer>
        <SlideUpContainer
          open={openAnalyticsPrefrenceDetails}
          close={handleClosePrefrenceDetails}
          height={deviceHeight * 0.35}>
          <FeatureInfoContainer info={prefrenceInfo} />
        </SlideUpContainer>
        <SlideUpContainer
          open={openPreview}
          close={handleClosePreview}
          height={deviceHeight * 0.65}
          usepadding={false}
          >
          <ProductPreview product={i} />
        </SlideUpContainer>
      </View>
    </LongPressEnabled>
  );
  return (
    <>
      {showAIResponse ? (
        <AIAnalyticsContainer
          response={AIResponse}
          close={() => setShowAIResponse(false)}
          setResponse={setAIResponse}
          reload={requestAIAnalysis4SingleProduct}
          changePrefrence={handleChangePrefrence}
        />
      ) : (
        <ProductDetails />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 6,
    paddingVertical: 6,
    borderRadius: 16,
    width: deviceWidth * 0.9,
    maxWidth: 380,
    height: 240,
  },
  tabLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderRadius: 10,
    paddingHorizontal: 16,
  },
  productName: {
    fontSize: 22,
    fontWeight: '600',
    fontStyle: 'italic',
  },
  productInfoContainer: {
    flex: 1,
    marginTop: 4,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
  },
  infoContainer: {
    marginTop: 2,
  },
  infoText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default Tab;
