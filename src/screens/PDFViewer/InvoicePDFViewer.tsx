import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Text,
  ScrollView,
} from 'react-native';
import RNHTMLtoPDF, {Options} from 'react-native-html-to-pdf';
import PDFPreViewer from './components/PDFPreViewer'; // Your WebView previewer
import {Customer, SoldProduct} from '../../../types'; // Adjust import based on your structure
import {
  generateInvoiceHTML,
  SoldProductInvoiceHTMLProps,
} from '../../utils/html_templates/invoice';
import {deviceHeight} from '../../utils/Constants';
import {useAnalytics, useTheme} from '../../hooks';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/Entypo';
import Share from 'react-native-share';
import {showToast} from '../../service/fn';

type Props = {
  soldProducts: SoldProduct[];
  customer: Customer;
};

const InvoicePDFViewer = ({soldProducts, customer}: Props) => {
  const {currentTheme} = useTheme();
  const {owner} = useAnalytics();
  const [html, setHtml] = useState('');
  const [loading, setLoading] = useState(false);

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

  const handleGeneratePDF = async () => {
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
        fileName: 'invoice',
        directory: 'Documents',
      };
      const file = await RNHTMLtoPDF.convert(options);

      const shareOptions = {
        title: 'Share Invoice via...',
        url: `file://${file.filePath}`,
      };
      await Share.open(shareOptions);
    } catch (error) {
      const errMsg = (error as Error).message || 'Action canceled';
      showToast({type: 'info', text1: errMsg});
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={[styles.container, {backgroundColor: currentTheme.contrastColor}]}>
      {loading && (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator size="large" color="black" style={styles.loader} />
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
            onPress={() => handleGeneratePDF()}>
            <Icon1 name="share" size={20} color={'white'} />
            <Text style={styles.buttonText}>Share via...</Text>
          </TouchableOpacity>
          {/* {!customer.phoneNumber && (
            <TouchableOpacity
              style={[styles.button, {flex: 1}]}
              onPress={() => handleGeneratePDF()}>
              <Icon name="whatsapp" size={20} color={'white'} />
            </TouchableOpacity>
          )} */}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
    marginTop: 20,
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
