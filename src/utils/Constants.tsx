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
export  const customerHeaderTabs = [
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
    textAlt: "#000",
    // dangerBg:"#FF0000"
    modal: {
      title: "#000",
      inputbg: "#fff",
      inputBorder: "#7f017f",
      inputText: "#000",
      pickerbg: "#ffeaff",
      pickerText: "#000",
      saveBtnbg: "#7f017f",
      saveBtnText: "#fff",
    },
    toggleBtn: {
      bgActive: "#b200b2",
      bgInactive: "#fff",
      textActive: "#fff",
      textInactive: "#000",
    },
    tab: {
      label: "#fff",
      bg: "rgba(127, 1, 127,0.6)",
      value: "#fff",
      btnBg: "#fff",
      btnText: "#000",
      icon: "#fff",
    },
  },
  {
    name: AppThemeName.RED,
    baseColor: "#d60000",
    fadeColor: "#ff8080",
    tabColor: "#ff6666",
    borderColor: "#fff",
    textColor: "#000",
    contrastColor: "#fff",
    bgColor: "#ffe6e6",
    textAlt: "#000",
    modal: {
      title: "#000",
      inputbg: "#fff",
      inputBorder: "#d60000",
      inputText: "#000",
      pickerbg: "#ffe6e6",
      pickerText: "#000",
      saveBtnbg: "#d60000",
      saveBtnText: "#fff",
    },
    toggleBtn: {
      bgActive: "#ff6666",
      bgInactive: "#fff",
      textActive: "#fff",
      textInactive: "#000",
    },
    tab: {
      label: "#fff",
      bg: "#ff8080",
      value: "#fff",
      btnBg: "#fff",
      btnText: "#000",
      icon: "#fff",
    },
  },
  {
    name: AppThemeName.YELLOW,
    baseColor: "#ffc107",
    fadeColor: "#ffecb3",
    tabColor: "#ffeb99",
    borderColor: "#000",
    textColor: "#000",
    contrastColor: "#fff",
    bgColor: "#fff8e1",
    textAlt: "#000",
    modal: {
      title: "#000",
      inputbg: "#fff",
      inputBorder: "#ffc107",
      inputText: "#000",
      pickerbg: "#fff8e1",
      pickerText: "#000",
      saveBtnbg: "#ffc107",
      saveBtnText: "#fff",
    },
    toggleBtn: {
      bgActive: "#ffeb99",
      bgInactive: "#fff",
      textActive: "#000",
      textInactive: "#000",
    },
    tab: {
      label: "#000",
      bg: "#ffecb3",
      value: "#000",
      btnBg: "#fff",
      btnText: "#000",
      icon: "#000",
    },
  },
  {
    name: AppThemeName.GREEN,
    baseColor: "#9ec378",
    fadeColor: "rgba(158,195,120,0.6)",
    tabColor: "rgba(158,195,120,0.6)",
    borderColor: "#000000",
    textColor: "#000",
    contrastColor: "#fff",
    bgColor: "#e6ffe6",
    textAlt: "#000",
    modal: {
      title: "#000",
      inputbg: "#fff",
      inputBorder: "#9ec378",
      inputText: "#000",
      pickerbg: "#e6ffe6",
      pickerText: "#000",
      saveBtnbg: "#9ec378",
      saveBtnText: "#fff",
    },
    toggleBtn: {
      bgActive: "rgba(158,195,120,0.6)",
      bgInactive: "#fff",
      textActive: "#000",
      textInactive: "#000",
    },
    tab: {
      label: "#fff",
      bg: "rgba(158,195,120,0.6)",
      value: "#fff",
      btnBg: "#fff",
      btnText: "#000",
      icon: "#fff",
    },
  },
  {
    name: AppThemeName.BLUE,
    baseColor: "#007bff",
    fadeColor: "#80bfff",
    tabColor: "#66b2ff",
    borderColor: "#fff",
    textColor: "#000",
    contrastColor: "#fff",
    bgColor: "#e6f2ff",
    textAlt: "#000",
    modal: {
      title: "#000",
      inputbg: "#fff",
      inputBorder: "#007bff",
      inputText: "#000",
      pickerbg: "#e6f2ff",
      pickerText: "#000",
      saveBtnbg: "#007bff",
      saveBtnText: "#fff",
    },
    toggleBtn: {
      bgActive: "#66b2ff",
      bgInactive: "#fff",
      textActive: "#fff",
      textInactive: "#000",
    },
    tab: {
      label: "#fff",
      bg: "#80bfff",
      value: "#fff",
      btnBg: "#fff",
      btnText: "#000",
      icon: "#fff",
    },
  },
  {
    name: AppThemeName.ROYAL_BLUE,
    baseColor: "#4169e1",
    fadeColor: "#a4c3f7",
    tabColor: "#82aff5",
    borderColor: "#fff",
    textColor: "#000",
    contrastColor: "#fff",
    bgColor: "#dce9ff",
    textAlt: "#000",
    modal: {
      title: "#000",
      inputbg: "#fff",
      inputBorder: "#4169e1",
      inputText: "#000",
      pickerbg: "#dce9ff",
      pickerText: "#000",
      saveBtnbg: "#4169e1",
      saveBtnText: "#fff",
    },
    toggleBtn: {
      bgActive: "#82aff5",
      bgInactive: "#fff",
      textActive: "#fff",
      textInactive: "#000",
    },
    tab: {
      label: "#fff",
      bg: "#a4c3f7",
      value: "#fff",
      btnBg: "#fff",
      btnText: "#000",
      icon: "#fff",
    },
  },
];
export const colors = {
  danger:"rgb(255,0,0)",
  dangerFade:"rgba(255,0,0,0.2)",
  iconBlack:"rgb(0,0,0)"
}

export const currentTheme=Theme[5]
