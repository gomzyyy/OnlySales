import {View, Image, StyleSheet, Text} from 'react-native';
import React from 'react';
import {Product} from '../../../../types';
import {colors, deviceHeight} from '../../../utils/Constants';
import {useTheme} from '../../../hooks';
import LinearGradient from 'react-native-linear-gradient';
const NoPhoto = require('../../../assets/images/no_product_image.jpg');

type ProductPreviewContainerProps = {
  product: Product;
};

const ProductPreview: React.FC<ProductPreviewContainerProps> = ({
  product: p,
}): React.JSX.Element => {
  const {currentTheme} = useTheme();
  const imgOkCols = ['rgba(0,0,0,0)','rgba(255,255,255,1)']
  const imgNotCols = ['rgba(0,0,0,0)','rgba(0,0,0,0.2)']
  return (
    <View
      style={[styles.parent, {backgroundColor: currentTheme.contrastColor}]}>
      <View
        style={{
          alignItems: 'center',
          position: 'relative',
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
          overflow: 'hidden',
        }}>
        <Image
          source={
            p.image && p.image.trim().length !== 0 ? {uri: p.image} : NoPhoto
          }
          style={{
            height: deviceHeight * 0.65 * 0.6,
            maxHeight: 600,
            maxWidth: 600,
            width: '100%',
            borderColor: currentTheme?.contrastColor || '#000',
            objectFit: 'cover',
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
          }}
        />
        <LinearGradient
          colors={p.image && p.image.trim().length !== 0 ? imgOkCols : imgNotCols}
          style={{
            height: 60,
            position: 'absolute',
            width: '100%',
            bottom: -1,
          }}>
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{fontSize:18,fontWeight:'900',marginTop:10}}>{p.name}</Text>
          </View>
        </LinearGradient>
      </View>
      <View style={{}}>
        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    height: deviceHeight * 0.65,
  },
});

export default ProductPreview;
