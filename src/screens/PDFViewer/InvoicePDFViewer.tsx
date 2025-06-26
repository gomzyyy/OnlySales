import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Text,
  Linking,
  Platform,
  ToastAndroid,
  TextInput,
  Pressable,
} from 'react-native';
import RNHTMLtoPDF, {Options} from 'react-native-html-to-pdf';
import PDFPreViewer from './components/PDFPreViewer';
import {Customer, SoldProduct} from '../../../types';
import {
  generateInvoiceHTML,
  SoldProductInvoiceHTMLProps,
} from '../../utils/html_templates/invoice';
import {colors, deviceHeight, deviceWidth} from '../../utils/Constants';
import {useAnalytics, useTheme} from '../../hooks';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/Entypo';
import Share from 'react-native-share';
import {showToast} from '../../service/fn';
import {uploadPdfToCloudAPI} from '../../api/api.media';
import {useSelector} from 'react-redux';
import {RootState} from '../../../store/store';
import SlideUpContainer from '../../components/SlideUpContainer';
import {WHATSAPP_MESSAGE} from '../../utils/data';
import PopupContainer from '../../components/PopUp';
import {global} from '../../styles/global';

type InvoicePDFViewerProps = {
  soldProducts: SoldProduct[];
  customer: Customer;
  closeViewer: () => void;
};

const InvoicePDFViewer = ({
  soldProducts,
  customer,
  closeViewer,
}: InvoicePDFViewerProps) => {
  const {currentTheme} = useTheme();
  const {owner} = useAnalytics();
  const [html, setHtml] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [pdfUrl, setPdfUrl] = useState<string | undefined>(undefined);
  const [path, setPath] = useState<string | undefined>(undefined);
  const [openShare, setOpenShare] = useState<boolean>(false);
  const [showManualPhoneNumberInput, setShowManualPhoneNumberInput] =
    useState<boolean>((customer.phoneNumber ?? '').trim().length !== 10);
  const user = useSelector((s: RootState) => s.appData.user)!;
  const [customerPhoneNumber, setCustomerPhoneNumber] = useState<string>(
    customer.phoneNumber ?? '',
  );

  useEffect(() => {
    const options: SoldProductInvoiceHTMLProps = {
      invoiceId: `invoice_${Date.now()}`,
      date: new Date(Date.now()).toDateString(),
      soldProducts,
      customer,
      owner,
    };
    const htmlString = generateInvoiceHTML(options);
    setHtml(htmlString);
  }, [soldProducts]);

  const handleGenerateAndPreparePDF = async () => {
    try {
      setLoading(true);
      const singleSoldProductInvoiceOptions: SoldProductInvoiceHTMLProps = {
        invoiceId: `invoice_${Date.now()}`,
        date: new Date(Date.now()).toDateString(),
        soldProducts,
        customer,
        owner,
      };
      const htmlContent = generateInvoiceHTML(singleSoldProductInvoiceOptions);
      const options: Options = {
        html: htmlContent,
        fileName: `${customer.name}_${Date.now()}`,
        directory: 'Customer_Invoices',
      };
      const file = await RNHTMLtoPDF.convert(options);
      if (file.filePath) {
        setPath(file.filePath);
        const res = await uploadPdfToCloudAPI({
          query: {
            role: user.role,
          },
          media: {
            pdf: `file://${file.filePath}`,
          },
        });
        if (res.success && res.data.url) {
          setPdfUrl(res.data.url);
          setOpenShare(true);
        }
      }
    } catch (error) {
      const errMsg = (error as Error).message || 'Action canceled';
      showToast({type: 'info', text1: errMsg});
    } finally {
      setLoading(false);
    }
  };
  const handleCloseShareButton = () => setOpenShare(false);
  const ShareButton = () => {
    const handleShare = async () => {
      try {
        if (path) {
          const shareOptions = {
            title: 'Share Invoice via...',
            url: `file://${path}`,
          };
          await Share.open(shareOptions);
        } else {
          showToast({
            type: 'info',
            text1: 'Please try generating invoice again.',
          });
          return;
        }
      } catch (error) {}
    };
    const handleShareViaWhatsApp = () => {
      if (!pdfUrl) {
        showToast({
          type: 'info',
          text1: 'Please try generating invoice again.',
        });
      } else {
        if (customerPhoneNumber && customerPhoneNumber.trim().length === 10) {
          const msg = WHATSAPP_MESSAGE.replace('$$PDF_URL$$', pdfUrl).replace(
            '$$BUSINESS_NAME$$',
            owner.businessName,
          );
          const encodedMsg = encodeURIComponent(msg);
          const wpNo = `91${customerPhoneNumber}`;
          const whatsappLink = `https://wa.me/${wpNo}?text=${encodedMsg}`;
          Linking.canOpenURL(whatsappLink)
            .then(supported => {
              if (supported) {
                Linking.openURL(whatsappLink);
              } else {
                showToast({
                  type: 'info',
                  text1: 'WhatsApp is not installed or cannot be opened.',
                });
                return;
              }
            })
            .catch(err => console.error('An error occurred', err));
        } else {
          setShowManualPhoneNumberInput(true);
          if (Platform.OS === 'android') {
            ToastAndroid.show(
              'Please add phone number to send Invoice.',
              ToastAndroid.SHORT,
            );
          } else {
            showToast({
              type: 'info',
              text1: "Customer's number not available.",
            });
          }
        }
      }
    };
    return (
      <View style={{flexDirection: 'row', gap: 8}}>
        <TouchableOpacity
          style={[styles.button, {flex: 6}]}
          onPress={handleShare}
          disabled={loading || customerPhoneNumber.length !== 10}>
          <Icon1 name="share" size={20} color={'white'} />
          <Text style={styles.buttonText}>Share via...</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, {flex: 1}]}
          onPress={handleShareViaWhatsApp}
          disabled={loading || customerPhoneNumber.length !== 10}>
          <Icon name="whatsapp" size={20} color={'white'} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View
      style={[styles.container, {backgroundColor: currentTheme.contrastColor}]}>
      {loading && (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator size={40} color="black" style={styles.loader} />
        </View>
      )}

      {html && !loading ? (
        <View style={{flex: 1}}>
          <PDFPreViewer html={html} />
        </View>
      ) : null}

      {!loading && (
        <View style={{flexDirection: 'row', gap: 8}}>
          <TouchableOpacity
            style={[styles.button, {flex: 6}]}
            onPress={() => handleGenerateAndPreparePDF()}>
            {!loading ? (
              <>
                <Icon1 name="share" size={20} color={'white'} />
                <Text style={styles.buttonText}>Share</Text>
              </>
            ) : (
              <ActivityIndicator size={20} color={'white'} />
            )}
          </TouchableOpacity>
          <SlideUpContainer
            open={openShare}
            close={handleCloseShareButton}
            height={deviceHeight * 0.24}>
            <View
              style={[
                styles.shareBtnContainer,
                {backgroundColor: currentTheme.contrastColor},
              ]}>
              <Text
                style={{textAlign: 'center', fontSize: 16, fontWeight: '900'}}>
                Share Invoice
              </Text>
              <View style={{gap: 10}}>
                {showManualPhoneNumberInput? (
                  <View style={{flexDirection: 'row',gap:10}}>
                    <TextInput
                      value={customerPhoneNumber}
                      onChangeText={setCustomerPhoneNumber}
                      style={[global.inputText, {flex: 1}]}
                      placeholder="+91"
                      placeholderTextColor={'grey'}
                    />
                    <Pressable
                      onPress={() => setShowManualPhoneNumberInput(false)}
                      style={{
                        borderRadius: 12,
                        backgroundColor: colors.oliveGreenFade,
                        paddingHorizontal: 12,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      disabled={customerPhoneNumber.trim().length!==10}
                      >
                      <Text
                        style={{
                          color: colors.oliveGreen,
                          fontWeight: '600',
                        }}>
                        Correct
                      </Text>
                    </Pressable>
                  </View>
                ) : (
                  <View style={{flexDirection: 'row', gap: 10}}>
                    <Text
                      style={{
                        flex: 1,
                      }}>{`Ph. +91 ${customerPhoneNumber}`}</Text>
                    <Pressable
                      onPress={() =>
                        setShowManualPhoneNumberInput(true)
                      }
                      style={{
                        borderRadius: 12,
                        backgroundColor: currentTheme.fadeColor,
                        paddingHorizontal: 6,
                        paddingVertical: 2,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          color: currentTheme.baseColor,
                          fontWeight: '600',
                          fontSize: 12,
                        }}>
                        Change?
                      </Text>
                    </Pressable>
                  </View>
                )}
                <Text
                  numberOfLines={1}
                  style={{fontSize: 12, fontWeight: '600', color: '#ababab'}}>
                  {
                    'change or add phone number. (this will not update actual customer)'
                  }
                </Text>
              </View>
              <ShareButton />
            </View>
          </SlideUpContainer>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  shareBtnContainer: {
    paddingTop: 16,
    paddingBottom: 10,
    paddingHorizontal: 10,
    height: deviceHeight * 0.24,
    marginBottom: 10,
    borderRadius: 20,
    justifyContent: 'space-between',
  },
  container: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    height: deviceHeight * 0.5,
    marginBottom: 10,
    borderRadius: 20,
  },
  loader: {
    marginVertical: 20,
  },
  button: {
    marginTop: 2,
    backgroundColor: '#333',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default InvoicePDFViewer;
