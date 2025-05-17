import {View, Text} from 'react-native';
import React from 'react';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {useSelector} from 'react-redux';
import {RootState} from '../../../store/store';
import Header from '../../components/Header';
import {useTheme} from '../../hooks';

const UITest = () => {
  const {currentTheme} = useTheme();
  const user = useSelector((s: RootState) => s.appData.user)!;
  const location = user.location.type.periodic;
  return (
    <View style={{flex: 1}}>
      <Header
        titleColor={currentTheme.contrastColor}
        headerBgColor={currentTheme.baseColor}
        curved={true}
        name="Map"
        backButton={true}
      />
      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: 20
        }}>
        <View style={{
          borderRadius: 20,
          overflow: 'hidden',
        }}>
          <MapView
            style={{height: 400}}
            initialRegion={{
              ...location,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            provider={PROVIDER_GOOGLE}
            showsUserLocation={true}>
            <Marker coordinate={location} title={user.name} />
          </MapView>
        </View>
      </View>
    </View>
  );
};

export default UITest;
