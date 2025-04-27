import React, { useState } from 'react';
import { 
  BarChart, 
  LineChart, 
  PieChart, 
  Pie, 
  Cell, 
  Line, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Home, 
  Car, 
  Wallet, 
  TrendingUp, 
  CreditCard, 
  DollarSign,
  Plus,
  Edit,
  Trash2,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const NetWorthCalculator = () => {
  const [assets, setAssets] = useState([
    { id: 1, name: 'Checking Account', value: 5000, category: 'Cash' },
    { id: 2, name: 'Savings Account', value: 15000, category: 'Cash' },
    { id: 3, name: 'Stocks', value: 25000, category: 'Investments' },
    { id: 4, name: 'Home', value: 350000, category: 'Property' },
    { id: 5, name: 'Car', value: 20000, category: 'Property' },
  ]);

  const [liabilities, setLiabilities] = useState([
    { id: 1, name: 'Mortgage', value: 280000, category: 'Long-term' },
    { id: 2, name: 'Car Loan', value: 15000, category: 'Long-term' },
    { id: 3, name: 'Credit Card', value: 3000, category: 'Short-term' },
  ]);

  const totalAssets = assets.reduce((sum, asset) => sum + asset.value, 0);
  const totalLiabilities = liabilities.reduce((sum, liability) => sum + liability.value, 0);
  const netWorth = totalAssets - totalLiabilities;

  const pieData = [
    { name: 'Assets', value: totalAssets },
    { name: 'Liabilities', value: totalLiabilities },
  ];

  const COLORS = ['#10B981', '#EF4444'];

  const monthlyData = [
    { month: 'Jan', netWorth: 100000 },
    { month: 'Feb', netWorth: 105000 },
    { month: 'Mar', netWorth: 112000 },
    { month: 'Apr', netWorth: 115000 },
    { month: 'May', netWorth: 117000 },
    { month: 'Jun', netWorth: 120000 },
  ];

  const categoryData = [
    { category: 'Cash', value: 20000 },
    { category: 'Investments', value: 25000 },
    { category: 'Property', value: 370000 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Net Worth Calculator</h1>
        <p className="text-gray-600 mt-2">Track your financial health and progress over time</p>
      </div>

      {/* Net Worth Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Assets</p>
              <h2 className="text-2xl font-bold text-green-600">${totalAssets.toLocaleString()}</h2>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <ArrowUpRight className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Liabilities</p>
              <h2 className="text-2xl font-bold text-red-600">${totalLiabilities.toLocaleString()}</h2>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <ArrowDownRight className="text-red-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Net Worth</p>
              <h2 className="text-2xl font-bold text-blue-600">${netWorth.toLocaleString()}</h2>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <DollarSign className="text-blue-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Net Worth Trend */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Net Worth Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              <Line type="monotone" dataKey="netWorth" stroke="#2563EB" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Assets vs Liabilities Pie Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Assets vs Liabilities</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Asset Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Assets List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Assets</h3>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
              <Plus size={16} /> Add Asset
            </button>
          </div>
          
          <div className="space-y-4">
            {assets.map((asset) => (
              <div key={asset.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {asset.category === 'Cash' && <Wallet className="text-green-600" />}
                  {asset.category === 'Investments' && <TrendingUp className="text-blue-600" />}
                  {asset.category === 'Property' && (asset.name === 'Home' ? <Home className="text-purple-600" /> : <Car className="text-orange-600" />)}
                  <div>
                    <p className="font-medium">{asset.name}</p>
                    <p className="text-sm text-gray-600">{asset.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-medium">${asset.value.toLocaleString()}</p>
                  <div className="flex gap-2">
                    <button className="text-gray-600 hover:text-blue-600">
                      <Edit size={16} />
                    </button>
                    <button className="text-gray-600 hover:text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Liabilities List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Liabilities</h3>
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700">
              <Plus size={16} /> Add Liability
            </button>
          </div>
          
          <div className="space-y-4">
            {liabilities.map((liability) => (
              <div key={liability.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <CreditCard className="text-red-600" />
                  <div>
                    <p className="font-medium">{liability.name}</p>
                    <p className="text-sm text-gray-600">{liability.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-medium">${liability.value.toLocaleString()}</p>
                  <div className="flex gap-2">
                    <button className="text-gray-600 hover:text-blue-600">
                      <Edit size={16} />
                    </button>
                    <button className="text-gray-600 hover:text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Asset Category Breakdown */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Asset Category Breakdown</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={categoryData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
            <Bar dataKey="value" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default NetWorthCalculator;