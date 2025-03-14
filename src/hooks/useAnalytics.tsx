import {useSelector} from 'react-redux';
import {RootState} from '../../store/store';
import {Customer, newSoldProduct, Product, Shopkeeper} from '../../types';
import {checkDate} from '../service/fn';

export interface useAnalyticsReturnType extends Shopkeeper {
  bestSellers: Product[];
  todaySales: newSoldProduct[];
  customers: Customer[];
  paidPayments: newSoldProduct[];
  unpaidPayments: newSoldProduct[];
  soldProducts: newSoldProduct[];
  soldThisMonth: newSoldProduct[];
  soldLastMonth: newSoldProduct[];
  soldMoreThanFourMonthsAgo: newSoldProduct[];
}

const useAnalytics = (bestSellerCount: number = 5): useAnalyticsReturnType => {
  const shopkeeper = useSelector((s: RootState) => s.shopkeeper.shopkeeper);
  const bestSellers = [...shopkeeper.inventory]
    .sort((a, b) => b.totalSold - a.totalSold)
    .slice(0, bestSellerCount);
  const customers = shopkeeper.customers;
  const paidPayments = customers.flatMap(s => s.paidPayments || []);
  const unpaidPayments = customers.flatMap(s => s.unpaidPayments || []);
  const soldProducts = [...paidPayments, ...unpaidPayments].map(s => ({
    ...s,
    totalSold: s.count,
  }));
  const soldThisMonth = soldProducts.filter(
    g => checkDate(g.addedAt).thisMonth
  );
  const soldLastMonth = soldProducts.filter(
    g => checkDate(g.addedAt).lastMonth,
  );
  const soldMoreThanFourMonthsAgo = soldProducts.filter(
    g => checkDate(g.addedAt).olderThanFourMonths,
  );
  const todaySales = soldThisMonth.filter(s => checkDate(s.addedAt).sameDay);

  return {
    ...shopkeeper,
    bestSellers,
    paidPayments,
    unpaidPayments,
    soldProducts,
    todaySales,
    customers,
    soldThisMonth,
    soldLastMonth,
    soldMoreThanFourMonthsAgo,
  };
};

export default useAnalytics;
