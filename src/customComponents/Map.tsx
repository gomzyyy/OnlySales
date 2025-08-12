import {ReactNode} from 'react';
import {Linking, Platform, Pressable, StyleProp, View, ViewStyle} from 'react-native';
import MapView, {MapViewProps, Marker} from 'react-native-maps';

interface MapProps extends MapViewProps {
  latitude: number;
  longitude: number;
  redirectToMaps?: boolean;
  children?: ReactNode;
  showmap?: boolean;
  containerstyle:StyleProp<ViewStyle>
}

const Map: React.FC<MapProps> = ({
  latitude,
  longitude,
  redirectToMaps = true,
  children,
  showmap = true,
  containerstyle,
  ...props
}): React.JSX.Element => {
  const rl = `https://www.google.com/maps?q=${latitude},${longitude}`;
  const pressAction = () => {
    if (!redirectToMaps) return;
    if (Platform.OS !== 'android') return;
    if (!Linking.canOpenURL(rl)) return;
    Linking.openURL(rl);
  };
  return (
    <Pressable onPress={pressAction} style={{flex: 1}}>
      <View style={[{flex: 1},containerstyle]}>
        {children}
        {showmap && (
          <MapView
            style={{flex: 1}}
            provider="google"
            scrollEnabled={false}
            zoomEnabled={false}
            rotateEnabled={false}
            pitchEnabled={false}
            initialCamera={{
              center: {
                latitude: latitude,
                longitude: longitude,
              },
              zoom: 18,
              heading: 0,
              pitch: 0,
            }}
            showsScale
            {...props}>
            <Marker
              coordinate={{
                latitude: latitude,
                longitude: longitude,
              }}
            />
          </MapView>
        )}
      </View>
    </Pressable>
  );
};

export default Map;
