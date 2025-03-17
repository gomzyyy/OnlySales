import {useSelector} from 'react-redux';
import {RootState} from '../../store/store';
import {Customer, SoldProduct, Product, BusinessOwner} from '../../types';
import {checkDate} from '../service/fn';

export interface useAnalyticsReturnType extends BusinessOwner {
  bestSellers: Product[];
  todaysMostSoldProducts: SoldProduct[];
  todaySales: SoldProduct[];
  customers: Customer[];
  paidPayments: SoldProduct[];
  unpaidPayments: SoldProduct[];
  soldProducts: SoldProduct[];
  soldThisMonth: SoldProduct[];
  soldLastMonth: SoldProduct[];
  soldOneMonthAgo: SoldProduct[];
  soldTwoMonthAgo: SoldProduct[];
  soldThreeMonthAgo: SoldProduct[];
  soldMoreThanFourMonthsAgo: SoldProduct[];
  weeklySales: {
    today: SoldProduct[];
    yesterday: SoldProduct[];
    oneDayAgo: SoldProduct[];
    twoDayAgo: SoldProduct[];
    threeDayAgo: SoldProduct[];
    fourDayAgo: SoldProduct[];
    fiveDayAgo: SoldProduct[];
  };
}

const useAnalytics = (bestSellerCount: number = 5): useAnalyticsReturnType => {
  const owner = useSelector((s: RootState) => s.appData.BusinessOwner);
  const bestSellers = [...owner.inventory]
    .sort((a, b) => b.totalSold - a.totalSold)
    .slice(0, bestSellerCount);
  const customers = owner.customers;
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

  const todaysMostSoldProductsRaw = todaySales
    .filter(s => checkDate({date: s.addedAt}).sameDay)
    .sort((a, b) => b.totalSold - a.totalSold)
    .slice(0, 5);

  const todaysMostSoldProductsObj = todaysMostSoldProductsRaw.reduce<
    Record<string, SoldProduct>
  >((acc, product) => {
    if (acc[product.id]) {
      acc[product.id].totalSold += product.totalSold;
    } else {
      acc[product.id] = {...product};
    }
    return acc;
  }, {});
  const todaysMostSoldProducts = Object.values(todaysMostSoldProductsObj);

  return {
    ...owner,
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
