import {Dimensions} from 'react-native';
import { AppTheme } from '../../types';
import { AppThemeName } from '../../enums';

export const deviceHeight = Dimensions.get('window').height;
export const deviceWidth = Dimensions.get('window').width;
export const defaultProfileImage = `https://res.cloudinary.com/dgki5gnzf/image/upload/v1739970302/no-profile_jfwlyo.jpgno-profile_jfwlyo`

export enum Colors {
  primary = '#AF1125',
  white = '#fff',
  secondry = '#C71E25',
  border = '#fff',
  text = '#222',
}
export enum Fonts {
  Regular = 'Okra-Regular',
  Medium = 'Okra-Medium',
  Light = 'Okra-MediumLight',
  SemiBold = 'Okra-Bold',
  Theme = 'Bangers-Regular',
}
export const lightColors = [
  'rgba(255,255,255,1)',
  'rgba(255,255,255,0.9)',
  'rgba(255,255,255,0.7)',
  'rgba(255,255,255,0.6)',
  'rgba(255,255,255,0.5)',
  'rgba(255,255,255,0.4)',
  'rgba(255,255,255,0.003)',
];

export const Theme:AppTheme[] = [
  {
    name: AppThemeName.PURPLE,
    baseColor: "#7f017f",
    fadeColor: "rgba(127, 1, 127,0.6)",
    tapColor: "#ff9bff",
    borderColor: "#fff",
    textColor: "#fff",
    contrastColor: "#fff",
    bgColor: "#f9feff",
  },
  {
    name: AppThemeName.RED,
    baseColor: "#d60000",
    fadeColor: "#ff8080",
    tapColor: "#ff6666",
    borderColor: "#fff",
    textColor: "#fff",
    contrastColor: "#fff",
    bgColor: "#ffe6e6",
  },
  {
    name: AppThemeName.YELLOW,
    baseColor: "#ffc107",
    fadeColor: "#ffecb3",
    tapColor: "#ffeb99",
    borderColor: "#000",
    textColor: "#000",
    contrastColor: "#000",
    bgColor: "#fff8e1",
  },
  {
    name:AppThemeName.GREEN,
    baseColor: "#9ec378",
    fadeColor: "rgba(158,195,120,0.6)",
    tapColor: "rgba(158,195,120,0.6)",
    borderColor: "#000000",
    textColor: "#fff",
    contrastColor: "#000",
    bgColor: "#e6ffe6",
  },
  {
    name: AppThemeName.BLUE,
    baseColor: "#007bff",
    fadeColor: "#80bfff",
    tapColor: "#66b2ff",
    borderColor: "#fff",
    textColor: "#fff",
    contrastColor: "#fff",
    bgColor: "#e6f2ff",
  },
  {
    name: AppThemeName.ROYAL_BLUE,
    baseColor: "#4169e1",
    fadeColor: "#a4c3f7",
    tapColor: "#82aff5",
    borderColor: "#fff",
    textColor: "#fff",
    contrastColor: "#fff",
    bgColor: "#dce9ff",
  },
  {
    name: AppThemeName.BLACK,
    baseColor: "#000",
    fadeColor: "#4d4d4d",
    tapColor: "#333",
    borderColor: "#fff",
    textColor: "#fff",
    contrastColor: "#fff",
    bgColor: "#1a1a1a",
  },
  {
    name: AppThemeName.DARK,
    baseColor: "#121212",
    fadeColor: "#1e1e1e",
    tapColor: "#333333",
    borderColor: "#444",
    textColor: "#fff",
    contrastColor: "#fff",
    bgColor: "#000",
  }
];
