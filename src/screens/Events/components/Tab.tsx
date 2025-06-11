import {Text, StyleSheet, View, Image, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {Customer, Event} from '../../../../types';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {useTheme} from '../../../hooks';
import LongPressEnabled from '../../../customComponents/LongPressEnabled';
import PopupContainer from '../../../components/PopUp';
import EventDataContainer from './EventDataContainer';
import SlideUpContainer from '../../../components/SlideUpContainer';
import {deviceHeight} from '../../../utils/Constants';
const NoPhoto = require('../../../assets/images/no-profile.jpg');

type TabProps = {
  i: Event;
  lastIndex?: boolean;
  dummy?: boolean;
  showThumbnail?: boolean;
};

const Tab: React.FC<TabProps> = ({
  i,
  lastIndex = false,
  dummy = false,
  showThumbnail = false,
}) => {
  const {currentTheme} = useTheme();
  const [openDataContainer, setOpenDataContainer] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return 'green';
      case 'FAILED':
        return 'red';
      default:
        return '#666';
    }
  };

  return (
    <LongPressEnabled
      longPressCanceledAction={() => setOpenDataContainer(true)}
      longPressAction={() => {}}
      dummy={dummy}>
      <View
        style={[
          styles.container,
          {
            marginBottom: lastIndex ? 70 : 8,
            backgroundColor: currentTheme.tab.bg,
          },
        ]}>
        {showThumbnail && (
          <Image
            source={
              i.thumbnail && i.thumbnail.trim().length !== 0
                ? {uri: i.thumbnail}
                : NoPhoto
            }
            style={[styles.profileImage, {borderColor: currentTheme.baseColor}]}
          />
        )}

        <View style={styles.innerContainer}>
          {/* Title & Description */}
          <View style={{flex: 1}}>
            <View style={{flexDirection: 'row', gap: 4}}>
              <Text style={styles.title} numberOfLines={1}>
                {i.title || 'No title added...'}
              </Text>
              <View
                style={[
                  styles.refBadge,
                  {backgroundColor: currentTheme.fadeColor},
                ]}>
                <Text
                  style={[
                    styles.refBadgeText,
                    {color: currentTheme.baseColor},
                  ]}>
                  {i.refType || 'No ref...'}
                </Text>
              </View>
              <View
                style={[
                  styles.refBadge,
                  {backgroundColor: currentTheme.fadeColor},
                ]}>
                <Text
                  style={[
                    styles.refBadgeText,
                    {color: currentTheme.baseColor},
                  ]}>
                  {new Date(i.createdAt || Date.now()).toDateString() || ''}
                </Text>
              </View>
              <View style={styles.statusDot} />
            </View>

            <Text style={styles.description} numberOfLines={1}>
              {i.description || 'No description added...'}
            </Text>
          </View>
        </View>
      </View>
      <SlideUpContainer
        open={openDataContainer}
        close={() => setOpenDataContainer(false)}
        height={deviceHeight * 0.6}>
        <EventDataContainer
          event={i}
          close={() => setOpenDataContainer(false)}
        />
      </SlideUpContainer>
    </LongPressEnabled>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    height: 60,
    flexDirection: 'row',
    borderRadius: 8,
    alignItems: 'center',
    gap: 12,
  },
  profileImage: {
    height: 50,
    width: 50,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  innerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    position: 'relative',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  description: {
    paddingLeft: 2,
    paddingRight: 20,
    fontSize: 10,
    color: '#555',
  },
  overlay: {
    position: 'absolute',
    right: 28,
    top: 6,
    alignItems: 'flex-end',
    gap: 4,
  },
  refBadge: {
    // backgroundColor: '#E0E0E0',
    paddingHorizontal: 3,
    borderRadius: 6,
    justifyContent: 'center',
  },
  refBadgeText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#333',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 6,
    marginTop: 4,
  },
});

export default Tab;
