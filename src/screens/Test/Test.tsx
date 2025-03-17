import {
  View,
  Text,
  Dimensions,
  ScrollView,
  StyleSheet,
  Image,
  Button,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/Feather';
import {navigate} from '../../utils/nagivationUtils';
import GetImage from '../../components/GetImage';
import SlideUpContainer from '../../components/SlideUpContainer';

const Test = () => {
  const [image, setImage] = useState<string | undefined>(undefined);
  const [open, setOpen] = useState<boolean>(false);
  return (
    <View style={styles.parent}>
      <View style={styles.container}>
        {image && image.trim().length !== 0 && (
          <View style={{borderRadius:70,overflow:'hidden'}}>
            <Image source={{uri: image}} height={140} width={140} />
          </View>
        )}
        <SlideUpContainer close={() => setOpen(false)} open={open}>
          <GetImage
            value={image}
            setState={setImage}
            callback={() => setOpen(false)}
          />
        </SlideUpContainer>
        <Button title="OPEN" onPress={() => setOpen(true)} />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  parent: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    gap: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 100,
  },
  successText: {
    textAlign: 'center',
    fontSize: 26,
    fontWeight: 'bold',
  },
});

export default Test;
