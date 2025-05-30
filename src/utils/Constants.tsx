import {Dimensions} from 'react-native';
import {AppTheme} from '../../types';
import {AppThemeName} from '../../enums';

export const deviceHeight = Dimensions.get('window').height;
export const deviceWidth = Dimensions.get('window').width;
export const defaultProfileImage = `https://res.cloudinary.com/dgki5gnzf/image/upload/v1739970302/no-profile_jfwlyo.jpgno-profile_jfwlyo`;

export const dashboardHeaderTabs = [
  {name: 'This Month', data: {amount: '18273'}},
  {name: 'Today', data: {amount: '1297'}},
];
export const customerHeaderTabs = [
  {name: 'This Month', data: {amount: '18273'}},
  {name: 'Today', data: {amount: '1297'}},
];

export const Theme: AppTheme[] = [
  {
    name: AppThemeName.RED,
    baseColor: '#d60000',
    fadeColor: 'rgba(214, 0, 0,0.1)',
    tabColor: '#ff6666',
    borderColor: '#fff',
    textColor: '#000',
    contrastColor: '#fff',
    bgColor: '#ffe6e6',
    textAlt: '#000',
    bottomTabBg: 'rgba(214, 0, 0,0.4)',
    modal: {
      title: '#000',
      inputbg: '#fff',
      inputBorder: '#d60000',
      inputText: '#000',
      pickerbg: '#ffe6e6',
      pickerText: '#000',
      saveBtnbg: '#d60000',
      saveBtnText: '#fff',
    },
    toggleBtn: {
      bgActive: '#ff6666',
      bgInactive: '#fff',
      textActive: '#fff',
      textInactive: '#000',
    },
    tab: {
      label: '#d60000',
      bg: '#fff',
      value: '#d60000',
      btnBg: '#d60000',
      btnText: '#fff',
      icon: '#d60000',
      text: '#fff',
    },
    header: {textColor: '#fff'},
  },

  {
    name: AppThemeName.GREEN,
    baseColor: '#075e54',
    fadeColor: 'rgba(7, 94, 84,0.1)',
    tabColor: 'rgba(7, 94, 84,0.6)',
    borderColor: '#000000',
    textColor: '#000',
    contrastColor: '#fff',
    bgColor: '#e6ffe6',
    textAlt: '#000',
    bottomTabBg: 'rgba(7, 94, 84,0.4)',
    modal: {
      title: '#000',
      inputbg: '#fff',
      inputBorder: '#075e54',
      inputText: '#000',
      pickerbg: 'rgba(7, 94, 84,0.2)',
      pickerText: '#075e54',
      saveBtnbg: '#075e54',
      saveBtnText: '#fff',
    },
    toggleBtn: {
      bgActive: 'rgba(7, 94, 84,0.6)',
      bgInactive: '#fff',
      textActive: '#000',
      textInactive: '#000',
    },
    tab: {
      label: '#075e54',
      bg: '#fff',
      value: '#9ec378',
      btnBg: '#075e54',
      btnText: '#fff',
      icon: '#075e54',
      text: '#fff',
    },
    header: {textColor: '#fff'},
  },
  {
    name: AppThemeName.BLUE,
    baseColor: '#007bff',
    fadeColor: 'rgba(0, 123, 255,0.1)',
    tabColor: '#66b2ff',
    borderColor: '#fff',
    textColor: '#000',
    contrastColor: '#fff',
    bgColor: '#e6f2ff',
    textAlt: '#000',
    bottomTabBg: 'rgba(0, 123, 255,0.4)',
    modal: {
      title: '#000',
      inputbg: '#fff',
      inputBorder: '#007bff',
      inputText: '#000',
      pickerbg: '#e6f2ff',
      pickerText: '#000',
      saveBtnbg: '#007bff',
      saveBtnText: '#fff',
    },
    toggleBtn: {
      bgActive: '#66b2ff',
      bgInactive: '#fff',
      textActive: '#fff',
      textInactive: '#000',
    },
    tab: {
      label: '#007bff',
      bg: '#fff',
      value: '#007bff',
      btnBg: '#007bff',
      btnText: '#000',
      icon: '#007bff',
      text: '#fff',
    },
    header: {textColor: '#fff'},
  },
  // {
  //   name: AppThemeName.CORAL,
  //   baseColor: '#ffffff', // white base
  //   fadeColor: 'rgba(255, 127, 80, 0.1)', // soft coral fade
  //   tabColor: '#efefef', // gentle grey for tabs or contrast background
  //   borderColor: '#efefef', // light grey border
  //   textColor: '#ff7f50', // coral for primary text/icons
  //   contrastColor: '#ffffff', // white for inverted text/areas
  //   bgColor: '#ffffff', // white background
  //   textAlt: '#ff7f50', // same coral for alternative text
  //   bottomTabBg: '#efefef', // subtle grey for bottom tabs
  //   modal: {
  //     title: '#ff7f50',
  //     inputbg: '#ffffff',
  //     inputBorder: '#ff7f50',
  //     inputText: '#ff7f50',
  //     pickerbg: '#efefef',
  //     pickerText: '#ff7f50',
  //     saveBtnbg: '#ff7f50',
  //     saveBtnText: '#ffffff',
  //   },
  //   toggleBtn: {
  //     bgActive: '#ff7f50',
  //     bgInactive: '#efefef',
  //     textActive: '#ffffff',
  //     textInactive: '#ff7f50',
  //   },
  //   tab: {
  //     label: '#ff7f50',
  //     bg: '#efefef',
  //     value: '#ff7f50',
  //     btnBg: '#efefef',
  //     btnText: '#ff7f50',
  //     icon: '#ff7f50',
  //     text: '#ff7f50',
  //   },
  //   header: {
  //     textColor: '#ff7f50',
  //   },
  // },
];
export const colors = {
  danger: 'rgb(255,0,0)',
  dangerFade: 'rgba(255,0,0,0.2)',
  oliveGreen: 'rgb(158, 195, 120)',
  oliveGreenFade: 'rgba(158, 195, 120,0.2)',
  iconBlack: 'rgb(0,0,0)',
  link: '#007bff',
};

const KEYWORDS = {
  create: {
    methods: {
      customer: {
        description: "'create customer [name] ex'",
      },
      // employee: {
      //   description: 'fastest method to create customers on the go!',
      // },
      // product: {
      //   description: 'fastest method to create customers on the go!',
      // },
    },
    description: 'fastest and reliable way to create data.',
  },
  update: {
    methods: {
      customer: {
        description: 'fastest way to update existing customers on the go!',
      },
      employee: {
        description: 'fastest way to update existing employees on the go!',
      },
      product: {
        description: 'fastest way to update existing products on the go!',
      },
    },
    description: 'fastest and reliable way to create data.',
  },
  delete: {
    methods: {
      customer: {
        description: 'fastest way to delete existing customer on the go!',
      },
      employee: {
        description: 'fastest way to delete existing employee on the go!',
      },
      product: {
        description: 'fastest way to delete existing product on the go!',
      },
    },
    description: 'fastest and reliable way to create data.',
  },
  find: {
    methods: {
      customer: {
        description: 'fastest way to find your customers on the go!',
      },
      employee: {
        description: 'fastest way to find your employees on the go!',
      },
      product: {
        description: 'fastest way to find your products on the go!',
      },
    },
    description: 'fastest and reliable way to create data.',
  },
};

const RESERVED_KEYWORDS: string[] = ['create', 'update', 'delete', 'find'];

export {KEYWORDS, RESERVED_KEYWORDS};
