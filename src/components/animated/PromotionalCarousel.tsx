import React, {useRef, useEffect, useState} from 'react';
import {
  FlatList,
  View,
  StyleSheet,
  LayoutChangeEvent,
} from 'react-native';
import {Image} from 'react-native';
import type {SlideItem} from '../../../types';

const DATA: SlideItem[] = [
  {
    media:
      'https://res.cloudinary.com/dgki5gnzf/image/upload/v1750182569/InstaBuy_step1_png_flqkwh.png',
    mediaType: 'IMAGE',
    title: 'Try InstaBuy Now!',
    description: 'Use InstaBuy and Expand your business all over the Region.',
    ctaText: 'Try Now.',
    ctaLink: '',
  },
   {
    media:
      'https://res.cloudinary.com/dgki5gnzf/image/upload/v1750182570/InstaBuy_step2_png_p9rn5t.png',
    mediaType: 'IMAGE',
    title: 'Try InstaBuy Now!',
    description: 'Use InstaBuy and Expand your business all over the Region.',
    ctaText: 'Try Now.',
    ctaLink: '',
  },
];

const PromotionalCarousel = () => {
  const flatListRef = useRef<FlatList>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollToIndex = (index: number, animated = true) => {
    flatListRef.current?.scrollToIndex({index, animated});
  };

  const onLayout = (event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;
    setContainerWidth(width);
  };

  const startAutoScroll = () => {
    if (DATA.length <= 1) return;

    intervalRef.current = setInterval(() => {
      setCurrentIndex(prev => {
        const next = (prev + 1) % DATA.length;
        scrollToIndex(next);
        return next;
      });
    }, 7800);
  };

  useEffect(() => {
    if (containerWidth) {
      startAutoScroll();
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [containerWidth]);

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

  return (
    <View onLayout={onLayout} style={{width: '100%'}}>
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
