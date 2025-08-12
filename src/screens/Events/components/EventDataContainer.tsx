import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import {deviceHeight, deviceWidth} from '../../../utils/Constants';
import Icon from 'react-native-vector-icons/AntDesign';
import {Event} from '../../../../types';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../../store/store';
import {useTheme} from '../../../hooks/index';
import Map from '../../../customComponents/Map';

type EventDataContainerProps = {
  event: Event;
  close: () => void;
};

const EventDataContainer: React.FC<EventDataContainerProps> = ({
  event,
  close,
}): React.JSX.Element => {
  const {currentTheme} = useTheme();

  return (
    <View
      style={[styles.parent, {backgroundColor: currentTheme.contrastColor}]}>
      <Text style={styles.title}>{event.title || 'Untitled Event'}</Text>

      <ScrollView style={{flex: 1}} nestedScrollEnabled>
        <View style={styles.section}>
          <Text style={styles.label}>Description:</Text>
          <Text style={styles.value}>{event.description || 'N/A'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Reference Type:</Text>
          <Text style={styles.value}>{event.refType || 'N/A'}</Text>
        </View>

        {event.refDescription && (
          <View style={styles.section}>
            <Text style={styles.label}>Ref Description:</Text>
            <Text style={styles.value}>{event.refDescription}</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.label}>Status:</Text>
          <Text style={[styles.value, {color: '#007BFF'}]}>{event.status}</Text>
        </View>

        {event.locatedAt  && (
          <View style={[styles.section, {gap: 10}]}>
            <Text style={styles.label}>Located At:</Text>
            <View
              style={{
                height: 200,
                width: '60%',
                maxWidth: 200,
                borderRadius: 20,
                overflow: 'hidden',
              }}>
              <Map
                longitude={event.locatedAt.long}
                latitude={event.locatedAt.lat}
              />
            </View>
          </View>
        )}

        {event.files?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.label}>Files:</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              nestedScrollEnabled
              style={{marginTop: 6}}>
              {event.files.map((uri, i) => (
                <Image
                  key={i}
                  source={{uri}}
                  style={styles.fileThumb}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    padding: 16,
    height: deviceHeight * 0.6,
    borderRadius: 20,
    marginBottom: 10,
    elevation: 30,
    alignSelf: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  section: {
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666666',
  },
  value: {
    fontSize: 15,
    color: '#000000',
    marginTop: 2,
  },
  optionsContainer: {
    paddingTop: 16,
    gap: 10,
  },
  buttonDanger: {
    borderRadius: 12,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  buttonDangerText: {
    textAlign: 'center',
    fontSize: 18,
  },
  fileThumb: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 8,
    backgroundColor: '#E0E0E0',
  },
});

export default EventDataContainer;
