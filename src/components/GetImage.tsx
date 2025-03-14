import {View, Text} from 'react-native';
import React, {Dispatch, SetStateAction} from 'react';
import {
  launchImageLibrary,
  launchCamera,
  MediaType,
  PhotoQuality,
} from 'react-native-image-picker';
import {showToast} from '../service/fn';
import {RequestMediaPermissions} from '../service/permissions';

type GetImageProps = {
  value: string;
  setState: Dispatch<SetStateAction<string>>;
};

const GetImage: React.FC<GetImageProps> = ({
  value,
  setState,
}): React.JSX.Element => {
  const getImageFromImageLiberary = async () => {
    const ok = await RequestMediaPermissions();
    if (!ok) return;
    const options: {mediaType: MediaType; quality: PhotoQuality} = {
      mediaType: 'photo',
      quality: 1,
    };
    launchImageLibrary(options, res => {
      if (res.didCancel) return;
      else if (res.errorMessage) {
        showToast({
          type: 'error',
          text1: res.errorMessage,
        });
      } else if (res.assets) {
        setState;
        res.assets[0].uri;
      } else {
        showToast({
          type: 'error',
          text1: 'An unknown Error occured!',
        });
        return;
      }
    });
  };

  return (
    <View>
      <Text>GetImage</Text>
    </View>
  );
};

export default GetImage;
