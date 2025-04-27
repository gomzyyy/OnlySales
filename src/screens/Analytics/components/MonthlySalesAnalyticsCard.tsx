import {View, Text} from 'react-native';
import {SoldProduct, Employee} from '../../../../types';
import MonthlySalesAnalysisGraph from './MonthlySalesAnalysisGraph';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../store/store';
import {useAnalytics} from '../../../hooks';

type MonthlySalesCardProps = {
  monthlySales: SoldProduct[];
};

const MonthlySalesAnalysisCard = ({monthlySales}: MonthlySalesCardProps) => {
  const {currency} = useSelector((s: RootState) => s.appData.app);
  const {owner} = useAnalytics();
  const employees = owner.employeeData;
  // ---- Helper function: Calculate total revenue and total gross profit ----
  const {totalRevenue, totalGrossProfit} =
    calculateRevenueAndProfit(monthlySales);

  // ---- Helper function: Calculate total monthly salaries ----
  const totalMonthlySalaries = calculateTotalMonthlySalaries(employees);

  // ---- Calculate net profit ----
  const netProfit = totalGrossProfit - totalMonthlySalaries;

  // ---- Helper function: Calculate total products sold ----
  const totalProductsSold = calculateTotalProductsSold(monthlySales);

  // ---- Optional: Calculate profitability percentage ----
  const profitabilityPercentage =
    totalRevenue !== 0 ? (netProfit / totalRevenue) * 100 : 0;

  return (
    <View
      style={{
        padding: 16,
        borderRadius: 12,
        backgroundColor: '#f5f5f5',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        marginVertical: 10,
      }}>
      <Text style={{fontSize: 20, fontWeight: 'bold', marginBottom: 12}}>
        Monthly Sales 📆
      </Text>

      <View style={{marginBottom: 8}}>
        <Text style={{fontWeight: '600'}}>
          Total Products Sold: {totalProductsSold}
        </Text>
      </View>

      <View style={{marginBottom: 8}}>
        <Text style={{fontWeight: '600'}}>
          Total Revenue: {currency} {totalRevenue.toFixed(2)}
        </Text>
      </View>

      <View style={{marginBottom: 8}}>
        <Text style={{fontWeight: '600'}}>
          Gross Profit: {currency} {totalGrossProfit.toFixed(2)}
        </Text>
      </View>

      <View style={{marginBottom: 8}}>
        <Text style={{fontWeight: '600'}}>
          Employee Salaries Paid: {currency} {totalMonthlySalaries.toFixed(2)}
        </Text>
      </View>

      <View style={{marginBottom: 8}}>
        <Text style={{fontWeight: '600'}}>
          Net Profit: {currency} {netProfit.toFixed(2)}
        </Text>
      </View>

      <View>
        <Text style={{fontWeight: '600'}}>
          Profitability: {profitabilityPercentage.toFixed(2)}%
        </Text>
      </View>

      <MonthlySalesAnalysisGraph />
    </View>
  );
};

export default MonthlySalesAnalysisCard;

//////////////////////////////////////////////////////
// ----------------- Helper Functions ----------------
//////////////////////////////////////////////////////

// Calculate Total Revenue and Gross Profit
const calculateRevenueAndProfit = (sales: SoldProduct[]) => {
  return sales.reduce(
    (acc, soldProduct) => {
      const product = soldProduct.product;
      const sellingPrice = product.discountedPrice ?? product.basePrice;
      const profitPerItem = sellingPrice - product.productCost;

      acc.totalRevenue += sellingPrice * soldProduct.count;
      acc.totalGrossProfit += profitPerItem * soldProduct.count;

      return acc;
    },
    {totalRevenue: 0, totalGrossProfit: 0},
  );
};

// Calculate Total Products Sold
const calculateTotalProductsSold = (sales: SoldProduct[]) => {
  return sales.reduce((acc, soldProduct) => acc + soldProduct.count, 0);
};

// Calculate Total Monthly Salaries for Employees
const calculateTotalMonthlySalaries = (employees: Employee[]) => {
  if (!employees || employees.length === 0) return 0;
  return employees.reduce((sum, emp) => sum + emp.salary / 12, 0);
};
