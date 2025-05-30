import {Text, StyleSheet, View, Image, Pressable} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import {useTheme} from '../../../hooks';
import LongPressEnabled from '../../../customComponents/LongPressEnabled';
import SlideUpContainer from '../../../components/SlideUpContainer';
import {deviceHeight} from '../../../utils/Constants';
import FS from 'react-native-fs';
import Pdf from 'react-native-pdf';
import {formatFileSize, showToast} from '../../../service/fn';
import PopupContainer from '../../../components/PopUp';
import TabLongPressOptions from './LongPressOptions';

const FileIcon = require('../../../assets/images/INVOICE_IMG.png');

type TabProps = {
  file: FS.ReadDirItem;
  lastIndex?: boolean;
};

const Tab: React.FC<TabProps> = ({file, lastIndex = false}) => {
  const {currentTheme} = useTheme();
  const [openPreview, setOpenPreview] = useState<boolean>(false);
  const [openOptions, setOpenOptions] = useState<boolean>(false);

  const handleLongPressAction = () => {
    setOpenPreview(true);
  };

  const handleClosePreview = () => setOpenPreview(false);

  return (
    <LongPressEnabled
      opacity={1}
      longPressCanceledAction={handleLongPressAction}
      longPressAction={() => setOpenOptions(true)}>
      <View
        style={[
          styles.container,
          {
            marginBottom: lastIndex ? 70 : 6,
            backgroundColor: currentTheme.baseColor,
          },
        ]}>
        <View style={{height: 50, width: 50, overflow: 'hidden'}}>
          <Image
            source={FileIcon}
            style={[styles.profileImage, {borderColor: currentTheme.baseColor}]}
          />
        </View>

        <View style={styles.innerContainer}>
          <View style={{}}>
            <Text
              style={[styles.fileName, {color: currentTheme.contrastColor}]}>
              {file.name}
            </Text>
            <View style={{flexDirection: 'row', gap: 6}}>
              <Text
                style={{
                  fontStyle: 'italic',
                  fontWeight: '400',
                  color: currentTheme.contrastColor,
                }}>
                {formatFileSize(file.size)}
              </Text>
              <Text
                style={{
                  fontStyle: 'italic',
                  fontWeight: '900',
                  color: currentTheme.contrastColor,
                }}>
                .
              </Text>
              <Text
                style={{
                  fontStyle: 'italic',
                  fontWeight: '400',
                  color: currentTheme.contrastColor,
                }}>
                {file.mtime ? file.mtime.toLocaleDateString() : 'N/A'}
              </Text>
            </View>
          </View>

          <View>
            <Icon name="right" color={currentTheme.contrastColor} size={22} />
          </View>
        </View>

        {openPreview && (
          <SlideUpContainer
            open={openPreview}
            close={handleClosePreview}
            opacity={0.8}
            height={deviceHeight * 0.6}>
            <View
              style={{
                paddingVertical: 16,
                backgroundColor: currentTheme.contrastColor,
                marginBottom: 10,
                borderRadius: 20,
                height: deviceHeight * 0.6,
                maxHeight: 500,
                paddingHorizontal: 10,
              }}>
              <Text
                style={{
                  color: currentTheme.textColor,
                  fontSize: 16,
                  fontWeight: '600',
                  marginBottom: 20,
                  textAlign: 'center',
                }}>
                PDF Viewer
              </Text>
              <View style={{borderRadius: 20, flex: 1}}>
                <Pdf
                  source={{uri: `file://${file.path}`, cache: true}}
                  style={{height: deviceHeight * 0.38, width: '100%'}}
                  onError={() => {
                    showToast({
                      type: 'error',
                      text1: "Can't open the Invoice, Please try again.",
                    });
                  }}
                  scale={1.5}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            </View>
          </SlideUpContainer>
        )}
        <PopupContainer open={openOptions} close={() => setOpenOptions(false)}>
          <TabLongPressOptions file={file} close={() => setOpenOptions(false)} />
        </PopupContainer>
      </View>
    </LongPressEnabled>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    flexDirection: 'row',
    borderRadius: 8,
    alignItems: 'center',
    gap: 12,
  },
  profileImage: {
    height: 50,
    width: 50,
    resizeMode: 'cover',
    borderRadius: 16,
    borderWidth: 1,
  },
  innerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    alignItems: 'center',
  },
  fileName: {
    fontSize: 18,
    fontWeight: '500',
  },
});

export default Tab;
