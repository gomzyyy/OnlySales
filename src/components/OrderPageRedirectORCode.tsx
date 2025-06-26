import React, {LegacyRef, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Clipboard,
  Pressable,
  ScrollView,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import {captureRef} from 'react-native-view-shot';
import Icon from 'react-native-vector-icons/Feather';
import {useAnalytics} from '../hooks';
import {deviceHeight} from '../utils/Constants';
import RNShare from 'react-native-share';
import {WHATSAPP_QUICK_ORDER_BY_QR_PROMO_MESSAGE} from '../utils/data';
import {BASE_WEB_URL} from '@env';
import RNFS from 'react-native-fs';
import { ServicePoint } from '../../types';

type OrderPageRedirectORCodeProps={
  spid:ServicePoint['_id']
}

const OrderPageRedirectORCode:React.FC<OrderPageRedirectORCodeProps> = ({spid}) => {
  if(!spid) return null;
  const {owner} = useAnalytics();
  const qrUrl = `${BASE_WEB_URL}/home?redirect=place_order&oid=${owner._id}&spid=${spid}&sec=0`;
  const qrRef = useRef<any>();

  const handleCapture = async () => {
    try {
      const uri = await captureRef(qrRef, {
        format: 'png',
        quality: 1,
        fileName: `qr-captute_OnlySales-${Date.now()}`,
      });
      const shareOptions = {
        title: 'QR Code',
        url: `file://${uri}`,
        message: WHATSAPP_QUICK_ORDER_BY_QR_PROMO_MESSAGE.replaceAll(
          '$$BUSINESS_NAME$$',
          owner.businessName,
        ),
        type: 'image/png',
        failOnCancel: false,
      };

      await RNShare.open(shareOptions);
      if (await RNFS.exists(uri)) {
        await RNFS.unlink(uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to capture or share QR');
    }
  };
  const handleCopyUrl = () => {
    Clipboard.setString(qrUrl);
  };
  return (
    <View style={styles.container}>
      <ScrollView style={{flex: 1}}>
        <Text style={styles.header}>Your Order QR is Ready</Text>
        <Text style={styles.subHeader}>Share this QR with your customers</Text>

        <View style={styles.qrContainer}>
          <View ref={qrRef} collapsable={false} style={styles.qrCaptureOnly}>
            <QRCode value={qrUrl} size={200} />
            <Text style={styles.qrLabel}>Scan me to order</Text>
            <Pressable onPress={handleCopyUrl}>
              <Text style={styles.qrUrl}>{qrUrl}</Text>
            </Pressable>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleCapture}>
            <Icon name="download" size={18} color="#fff" />
            <Text style={styles.buttonText}>Save or Share QR</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: deviceHeight * 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
    backgroundColor: '#F3F4F6',
    marginBottom: 10,
    borderRadius: 20,
    minHeight: 460,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 6,
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    textAlign: 'center',
  },
  qrContainer: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 16,
    alignItems: 'center',
    width: '100%',
  },
  qrCaptureOnly: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 16,
  },
  qrLabel: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  qrUrl: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
    textAlign: 'center',
  },
  button: {
    marginTop: 16,
    backgroundColor: '#2563EB',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
  },
});

export default OrderPageRedirectORCode;
