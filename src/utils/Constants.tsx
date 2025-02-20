import {Dimensions} from 'react-native';
import { AppTheme } from '../../types';
import { AppThemeName } from '../../enums';

export const deviceHeight = Dimensions.get('window').height;
export const deviceWidth = Dimensions.get('window').width;
export const defaultProfileImage = `https://res.cloudinary.com/dgki5gnzf/image/upload/v1739970302/no-profile_jfwlyo.jpgno-profile_jfwlyo`

export  const dashboardHeaderTabs = [
  {name: 'This Month', data: {amount: '18273'}},
  {name: 'Today', data: {amount: '1297'}}
];

export const Theme:AppTheme[] = [
  {
    name: AppThemeName.PURPLE,
    baseColor: "#7f017f",
    fadeColor: "rgba(127, 1, 127,0.6)",
    tabColor: "#b200b2",
    borderColor: "#fff",
    textColor: "#fff",
    contrastColor: "#fff",
    bgColor: "#ffeaff",
  },
  {
    name: AppThemeName.RED,
    baseColor: "#d60000",
    fadeColor: "#ff8080",
    tabColor: "#ff6666",
    borderColor: "#fff",
    textColor: "#fff",
    contrastColor: "#fff",
    bgColor: "#ffe6e6",
  },
  {
    name: AppThemeName.YELLOW,
    baseColor: "#ffc107",
    fadeColor: "#ffecb3",
    tabColor: "#ffeb99",
    borderColor: "#000",
    textColor: "#000",
    contrastColor: "#000",
    bgColor: "#fff8e1",
  },
  {
    name:AppThemeName.GREEN,
    baseColor: "#9ec378",
    fadeColor: "rgba(158,195,120,0.6)",
    tabColor: "rgba(158,195,120,0.6)",
    borderColor: "#000000",
    textColor: "#fff",
    contrastColor: "#000",
    bgColor: "#e6ffe6",
  },
  {
    name: AppThemeName.BLUE,
    baseColor: "#007bff",
    fadeColor: "#80bfff",
    tabColor: "#66b2ff",
    borderColor: "#fff",
    textColor: "#fff",
    contrastColor: "#fff",
    bgColor: "#e6f2ff",
  },
  {
    name: AppThemeName.ROYAL_BLUE,
    baseColor: "#4169e1",
    fadeColor: "#a4c3f7",
    tabColor: "#82aff5",
    borderColor: "#fff",
    textColor: "#fff",
    contrastColor: "#fff",
    bgColor: "#dce9ff",
  },
  {
    name: AppThemeName.BLACK,
    baseColor: "#000",
    fadeColor: "#4d4d4d",
    tabColor: "#333",
    borderColor: "#fff",
    textColor: "#fff",
    contrastColor: "#fff",
    bgColor: "#1a1a1a",
  },
  {
    name: AppThemeName.DARK,
    baseColor: "#121212",
    fadeColor: "#1e1e1e",
    tabColor: "#333333",
    borderColor: "#444",
    textColor: "#fff",
    contrastColor: "#fff",
    bgColor: "#000",
  }
];
