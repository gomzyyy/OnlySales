import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React from 'react';
import {currentTheme} from '../../../utils/Constants';
import {newUdharProduct, Product} from '../../../../types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../store/store';

type TabProps = {
  i: newUdharProduct;
  lastIndex?: boolean;
};

type ToogleButtonProps = {
  title: string;
  bgcolor: string;
  textColor: string;
};

const ToogleButton: React.FC<ToogleButtonProps> = ({
  title,
  bgcolor,
  textColor,
}): React.JSX.Element => {
  return (
    <View
      style={[
        styles.contentToggleBtn,
        {
          backgroundColor: bgcolor,
        },
      ]}>
      <Text style={[styles.toogleBtnText, {color: textColor}]}>{title}</Text>
    </View>
  );
};

const Tab: React.FC<TabProps> = ({i, lastIndex}): React.JSX.Element => {
  const app = useSelector((s: RootState) => s.shopkeeper.app);
  return (
    <View style={[styles.container, {marginBottom: lastIndex ? 70 : 6}]}>
      <View style={styles.tabInfo}>
        <Text style={styles.customerName}>{i.name}</Text>
        <Text style={styles.productAmount}>
          {`${app.currency}${
            i.discountedPrice && i.discountedPrice !== 0
              ? i.count ===0 ? i.discountedPrice : (Number(i.discountedPrice) * Number(i.count)).toString()
              : i.count === 0 ? i.basePrice :(Number(i.basePrice) * Number(i.count)).toString()
          }`}
        </Text>
      </View>
      <View style={styles.tabActionContainer}>
        <TouchableOpacity style={styles.MarkAsPaid}>
          <Text style={styles.MarkAsPaidText}>Mark as *Paid</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="delete" color={currentTheme.tab.icon} size={24} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    paddingVertical: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: currentTheme.tab.bg,
    borderRadius: 8,
  },
  tabInfo: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    paddingHorizontal: 10,
  },
  customerName: {
    fontSize: 20,
    fontWeight: '400',
    color: currentTheme.tab.label,
  },
  productAmount: {
    fontSize: 20,
    color: currentTheme.tab.value,
  },
  tabActionContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  MarkAsPaid: {
    backgroundColor: currentTheme.contrastColor,
    paddingHorizontal: 5,
    paddingVertical: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  MarkAsPaidText: {
    fontWeight: '600',
    color:currentTheme.textAlt
  },
  contentToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 60,
    marginTop: 20,
  },
  toogleBtnText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  contentToggleBtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
});

export {ToogleButton};

export default Tab;
