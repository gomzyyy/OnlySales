import React, {useRef, useEffect, useState} from 'react';
import {FlatList, View, StyleSheet, LayoutChangeEvent, Pressable} from 'react-native';
import {Image} from 'react-native';
import type {SlideItem} from '../../../types';
import {useTheme} from '../../hooks';
import {Text} from 'react-native';

const DATA: SlideItem[] = [
  {
    media:
      'https://res.cloudinary.com/dgki5gnzf/image/upload/v1750182569/InstaBuy_step1_png_flqkwh.png',
    mediaType: 'IMAGE',
    title: 'Try InstaBuy Now!',
    description: 'Use InstaBuy and Expand your business all over the Region.',
    ctaText: 'Try Now.',
    ctaLink: '',
    rel: {
      promoType: 'self',
      relWithFeature: 'instabuy',
    },
  },
  {
    media:
      'https://res.cloudinary.com/dgki5gnzf/image/upload/v1750182570/InstaBuy_step2_png_p9rn5t.png',
    mediaType: 'IMAGE',
    title: 'Try InstaBuy Now!',
    description: 'Use InstaBuy and Expand your business all over the Region.',
    ctaText: 'Try Now.',
    ctaLink: '',
    rel: {
      promoType: 'self',
      relWithFeature: 'instabuy',
    },
  },
  {
    media:
      'https://res.cloudinary.com/dgki5gnzf/image/upload/v1750398780/Customer_promo_d0gtmv.png',
    mediaType: 'IMAGE',
    title: 'Tap on Customer section!',
    description: 'Power Up Your Sales with Effortless Customer Handling.',
    ctaText: 'Try Now.',
    ctaLink: '',
    rel: {
      promoType: 'self',
      relWithFeature: 'Customer_management',
    },
  },
];

const SCROLL_TIME = 7800;
type PromotionalCarouselProps = {
  enabled?: boolean;
  onRequestClose?: () => void;
  onRequestStart?:()=>void;
};
const PromotionalCarousel: React.FC<PromotionalCarouselProps> = ({
  enabled = true,
  onRequestClose,
  onRequestStart,
}) => {
  const {currentTheme} = useTheme();
  const flatListRef = useRef<FlatList>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [render, setRender] = useState<boolean>(true);

  const scrollToIndex = (index: number, animated = true) => {
    flatListRef.current?.scrollToIndex({index, animated});
  };

  const onLayout = (event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;
    setContainerWidth(width);
  };

  const startAutoScroll = () => {
    if (DATA.length <= 1 || !enabled) return;

    intervalRef.current = setInterval(() => {
      setCurrentIndex(prev => {
        const next = (prev + 1) % DATA.length;
        scrollToIndex(next);
        return next;
      });
    }, SCROLL_TIME);
  };

  useEffect(() => {
    if (containerWidth) {
      startAutoScroll();
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [containerWidth]);

  const onClose = () => {
    if (onRequestClose) {
      onRequestClose();
      setRender(false);
      return;
    }
    setRender(false);
  };

  const renderItem = ({item}: {item: SlideItem}) => (
    <View style={[styles.slide, {width: containerWidth}]}>
      <Image source={{uri: item.media}} style={styles.media} />
    </View>
  );

  if (DATA.length === 1) {
    const item = DATA[0];
    return (
      <View onLayout={onLayout} style={{width: '100%'}}>
        {containerWidth > 0 && (
          <View style={[styles.slide, {width: containerWidth}]}>
            <Image source={{uri: item.media}} style={styles.media} />
          </View>
        )}
      </View>
    );
  }
  if(!render) return null;

  return (
    <View onLayout={onLayout} style={{width: '100%'}}>
      <Pressable
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          top: 0,
          right: 0,
          backgroundColor: currentTheme.contrastColor,
          height: 25,
          width: 40,
          zIndex: 99,
          borderBottomLeftRadius: 14,
          borderTopRightRadius: 4,
          borderTopLeftRadius:4,
          borderBottomRightRadius:4,
          elevation:4,
          borderWidth:2,
          borderColor:currentTheme.baseColor,
        }} onPress={onClose}>
        <Text
          style={{
            fontSize: 10,
            fontWeight: '900',
            color: currentTheme.baseColor,
          }}>
          Close
        </Text>
      </Pressable>

      {containerWidth > 0 && (
        <FlatList
          ref={flatListRef}
          data={DATA}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          renderItem={renderItem}
          keyExtractor={(_, index) => index.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  slide: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  media: {
    width: '100%',
    height: 200,
  },
});

export default PromotionalCarousel;
