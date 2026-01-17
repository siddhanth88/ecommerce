import React, { useState, useEffect } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import adminService from '../../services/adminService';
import Loader from '../../components/common/Loader';
import { DollarSign, ShoppingBag, Users as UsersIcon, Package } from 'lucide-react';
import { formatPrice } from '../../utils/formatPrice';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminService.getStats();
        setStats(data.stats);
      } catch (err) {
        setError('Failed to load dashboard statistics');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader size="lg" /></div>;
  if (error) return <div className="text-red-500 text-center p-8">{error}</div>;

  return (
    <AdminLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Sales" 
          value={formatPrice(stats.totalSales)} 
          icon={DollarSign} 
          color="bg-green-500" 
        />
        <StatCard 
          title="Total Orders" 
          value={stats.totalOrders} 
          icon={Package} 
          color="bg-blue-500" 
        />
        <StatCard 
          title="Total Products" 
          value={stats.totalProducts} 
          icon={ShoppingBag} 
          color="bg-purple-500" 
        />
        <StatCard 
          title="Total Users" 
          value={stats.totalUsers} 
          icon={UsersIcon} 
          color="bg-orange-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-800">Recent Orders</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {stats.recentOrders.length > 0 ? (
              stats.recentOrders.map((order) => (
                <div key={order._id} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Ordering #{order._id.slice(-6).toUpperCase()}</p>
                    <p className="text-sm text-gray-500">{order.user?.name || 'Unknown User'}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{formatPrice(order.total)}</p>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">No orders found</div>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-800">Top Products</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {stats.topProducts.map((product) => (
              <div key={product._id} className="px-6 py-4 flex items-center space-x-4">
                <img 
                  src={product.images[0]} 
                  alt={product.name} 
                  className="w-12 h-12 rounded object-cover" 
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 line-clamp-1">{product.name}</p>
                  <p className="text-sm text-gray-500">{product.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{formatPrice(product.price)}</p>
                  <p className="text-xs text-gray-500">{product.reviews} reviews</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
