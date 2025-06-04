import {useSelector} from 'react-redux';
import {RootState} from '../../store/store';
import {
  Customer,
  SoldProduct,
  Product,
  Owner,
  Partner,
  Employee,
  Review,
  App,
} from '../../types';
import {checkDate} from '../service/fn';
import {AdminRole, PaymentState} from '../../enums';
import {useMemo} from 'react';

export interface useAnalyticsReturnType extends Owner, App {
  owner: Owner;
  bestSellers: Product[];
  todaysMostSoldProducts: SoldProduct[];
  todaySales: SoldProduct[];
  customers: Customer[];
  paidPayments: SoldProduct[];
  unpaidAmount: number;
  paidAmount: number;
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
  mergedweeklySales: SoldProduct[];
  newReviews: Review[];
}

const useAnalytics = (bestSellerCount: number = 5): useAnalyticsReturnType => {
  const user = useSelector((s: RootState) => s.appData.user)!;
  const app = useSelector((s: RootState) => s.appData.app)!;
  let owner: Owner;

  if (user.role === AdminRole.OWNER) {
    owner = user as Owner;
  } else if (user.role === AdminRole.PARTNER) {
    owner = (user as Partner).businessOwner;
  } else if (user.role === AdminRole.EMPLOYEE) {
    owner = (user as Employee).businessOwner;
  } else {
    throw new Error('Invalid role or missing business owner');
  }
  const bestSellers = [...owner.inventory]
    .sort((a, b) => b.totalSold - a.totalSold)
    .slice(0, bestSellerCount);
  const customers = owner.customers as Customer[];
  const paidPayments = customers.flatMap(
    s =>
      s.buyedProducts.filter(
        s => s.state === PaymentState.PAID && !s.disabled,
      ) || [],
  );
  const unpaidPayments = customers.flatMap(
    s =>
      s.buyedProducts.filter(
        s =>
          s.state === PaymentState.UNPAID || s.state === PaymentState.PENDING,
      ) || [],
  );
  const soldProducts = [...paidPayments, ...unpaidPayments].map(s => ({
    ...s,
    totalSold: s.count,
  }));
  const soldThisMonth = soldProducts.filter(
    g => checkDate({date: new Date(g.createdAt).getTime()}).thisMonth,
  );
  const todaySales = soldThisMonth.filter(
    s => checkDate({date: new Date(s.createdAt).getTime()}).sameDay,
  );
  const soldLastMonth = soldProducts.filter(
    g => checkDate({date: new Date(g.createdAt).getTime()}).lastMonth,
  );
  const soldMoreThanFourMonthsAgo = soldProducts.filter(
    g => checkDate({date: new Date(g.createdAt).getTime()}).olderThanFourMonths,
  );
  const soldOneMonthAgo = soldProducts.filter(
    g => checkDate({date: new Date(g.createdAt).getTime()}).olderThanFourMonths,
  );
  const soldTwoMonthAgo = soldProducts.filter(
    g => checkDate({date: new Date(g.createdAt).getTime()}).olderThanFourMonths,
  );
  const soldThreeMonthAgo = soldProducts.filter(
    g => checkDate({date: new Date(g.createdAt).getTime()}).olderThanFourMonths,
  );
  const weeklySales = {
    today: todaySales,
    yesterday: soldProducts.filter(
      s =>
        checkDate({date: new Date(s.createdAt).getTime(), matchByDay: 2})
          .isExactMatch,
    ),
    oneDayAgo: soldProducts.filter(
      s =>
        checkDate({date: new Date(s.createdAt).getTime(), matchByDay: 3})
          .isExactMatch,
    ),
    twoDayAgo: soldProducts.filter(
      s =>
        checkDate({date: new Date(s.createdAt).getTime(), matchByDay: 4})
          .isExactMatch,
    ),
    threeDayAgo: soldProducts.filter(
      s =>
        checkDate({date: new Date(s.createdAt).getTime(), matchByDay: 5})
          .isExactMatch,
    ),
    fourDayAgo: soldProducts.filter(
      s =>
        checkDate({date: new Date(s.createdAt).getTime(), matchByDay: 6})
          .isExactMatch,
    ),
    fiveDayAgo: soldProducts.filter(
      s =>
        checkDate({date: new Date(s.createdAt).getTime(), matchByDay: 7})
          .isExactMatch,
    ),
  };

  const todaysMostSoldProductsRaw = todaySales
    .sort((a, b) => b.totalSold - a.totalSold)
    .slice(0, 5);
  const todaysMostSoldProductsObj = todaysMostSoldProductsRaw.reduce<
    Record<string, SoldProduct>
  >((acc, product) => {
    if (acc[product._id]) {
      acc[product._id].product.totalSold += product.totalSold;
    } else {
      acc[product._id] = {...product};
    }
    return acc;
  }, {});
  const todaysMostSoldProducts = Object.values(todaysMostSoldProductsObj);
  const newReviews =
    (owner.reviews || []).filter(
      r => checkDate({date: new Date(r.createdAt).getTime()}).sameDay,
    ) || [];
  const mergedweeklySales = [
    ...weeklySales.today,
    ...weeklySales.oneDayAgo,
    ...weeklySales.twoDayAgo,
    ...weeklySales.fiveDayAgo,
    ...weeklySales.fourDayAgo,
    ...weeklySales.threeDayAgo,
    ...weeklySales.yesterday,
  ];

  const paidAmount = useMemo(
    () =>
      paidPayments.reduce(
        (acc, s) =>
          acc +
          ((s.product.discountedPrice
            ? s.product.discountedPrice
            : s.product.basePrice) * s.count || 0),
        0,
      ),
    [soldThisMonth],
  );
  const unpaidAmount = useMemo(
    () =>
      unpaidPayments.reduce(
        (acc, s) =>
          acc +
          ((s.product.discountedPrice
            ? s.product.discountedPrice
            : s.product.basePrice) * s.count || 0),
        0,
      ),
    [soldThisMonth],
  );
  return {
    ...app,
    ...owner,
    owner,
    unpaidAmount,
    paidAmount,
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
    newReviews,
    mergedweeklySales,
  };
};

export default useAnalytics;
