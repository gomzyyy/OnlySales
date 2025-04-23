import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

import dashboardEn from './locales/en/dashboard.json';
import customersEn from './locales/en/customers.json';
import customerEn from './locales/en/customer.json';
import inventoryEn from './locales/en/inventory.json'

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  fallbackLng: 'en',
  lng: 'en',
  resources: {
    en: {
      dashboard: dashboardEn,
      customers: customersEn,
      customer: customerEn,
      inventory: inventoryEn
    },
  },
  ns: ['dashboard'],
  defaultNS: 'dashboard',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
