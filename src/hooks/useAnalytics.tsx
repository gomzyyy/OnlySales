import {useSelector} from 'react-redux';
import {RootState} from '../../store/store';
import {Customer, newSoldProduct, Product, Shopkeeper} from '../../types';
import {checkDate} from '../service/fn';

export interface useAnalyticsReturnType extends Shopkeeper {
  bestSellers: Product[];
  todaysMostSoldProducts: newSoldProduct[];
  todaySales: newSoldProduct[];
  customers: Customer[];
  paidPayments: newSoldProduct[];
  unpaidPayments: newSoldProduct[];
  soldProducts: newSoldProduct[];
  soldThisMonth: newSoldProduct[];
  soldLastMonth: newSoldProduct[];
  soldOneMonthAgo: newSoldProduct[];
  soldTwoMonthAgo: newSoldProduct[];
  soldThreeMonthAgo: newSoldProduct[];
  soldMoreThanFourMonthsAgo: newSoldProduct[];
  weeklySales: {
    today: newSoldProduct[];
    yesterday: newSoldProduct[];
    oneDayAgo: newSoldProduct[];
    twoDayAgo: newSoldProduct[];
    threeDayAgo: newSoldProduct[];
    fourDayAgo: newSoldProduct[];
    fiveDayAgo: newSoldProduct[];
  };
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
    g => checkDate({date: g.addedAt}).thisMonth,
  );
  const todaySales = soldThisMonth.filter(
    s => checkDate({date: s.addedAt}).sameDay,
  );
  const soldLastMonth = soldProducts.filter(
    g => checkDate({date: g.addedAt}).lastMonth,
  );
  const soldMoreThanFourMonthsAgo = soldProducts.filter(
    g => checkDate({date: g.addedAt}).olderThanFourMonths,
  );
  const soldOneMonthAgo = soldProducts.filter(
    g => checkDate({date: g.addedAt}).olderThanFourMonths,
  );
  const soldTwoMonthAgo = soldProducts.filter(
    g => checkDate({date: g.addedAt}).olderThanFourMonths,
  );
  const soldThreeMonthAgo = soldProducts.filter(
    g => checkDate({date: g.addedAt}).olderThanFourMonths,
  );
  const weeklySales = {
    today: todaySales,
    yesterday: soldProducts.filter(
      s => checkDate({date: s.addedAt, matchByDay: 2}).isExactMatch,
    ),
    oneDayAgo: soldProducts.filter(
      s => checkDate({date: s.addedAt, matchByDay: 3}).isExactMatch,
    ),
    twoDayAgo: soldProducts.filter(
      s => checkDate({date: s.addedAt, matchByDay: 4}).isExactMatch,
    ),
    threeDayAgo: soldProducts.filter(
      s => checkDate({date: s.addedAt, matchByDay: 5}).isExactMatch,
    ),
    fourDayAgo: soldProducts.filter(
      s => checkDate({date: s.addedAt, matchByDay: 6}).isExactMatch,
    ),
    fiveDayAgo: soldProducts.filter(
      s => checkDate({date: s.addedAt, matchByDay: 7}).isExactMatch,
    ),
  };

  const todaysMostSoldProducts = todaySales
    .filter(s => checkDate({date: s.addedAt}).sameDay)
    .sort((a, b) => b.totalSold - a.totalSold)
    .slice(0, 5);

  return {
    ...shopkeeper,
    bestSellers,
    todaysMostSoldProducts,
    weeklySales,
    paidPayments,
    unpaidPayments,
    soldProducts,
    todaySales,
    customers,
    soldThisMonth,
    soldLastMonth,
    soldOneMonthAgo,
    soldTwoMonthAgo,
    soldThreeMonthAgo,
    soldMoreThanFourMonthsAgo,
  };
};

export default useAnalytics;
