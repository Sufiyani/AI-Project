import React, { useState, useEffect } from 'react';
import { Loader } from 'lucide-react';
import { fetchAnalytics } from '../services/api';

const AnalyticsPage = ({ showToast }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics()
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        showToast('Failed to load analytics', 'error');
        setLoading(false);
      });
  }, [showToast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          Failed to load analytics data
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Market Analytics</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="text-sm text-gray-600 mb-2">Total Cars</div>
          <div className="text-3xl font-bold text-blue-600">
            {stats?.dataset?.total_cars?.toLocaleString() || 'N/A'}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <div className="text-sm text-gray-600 mb-2">Avg Price</div>
          <div className="text-3xl font-bold text-green-600">
            {stats?.price_stats?.mean ? `${(stats.price_stats.mean / 100000).toFixed(1)} L` : 'N/A'}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <div className="text-sm text-gray-600 mb-2">Price Range</div>
          <div className="text-lg font-bold text-purple-600">
            {stats?.price_stats?.min ? 
              `${(stats.price_stats.min / 100000).toFixed(0)} - ${(stats.price_stats.max / 100000).toFixed(0)} L` 
              : 'N/A'}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <div className="text-sm text-gray-600 mb-2">Year Range</div>
          <div className="text-2xl font-bold text-orange-600">
            {stats?.dataset?.year_range || 'N/A'}
          </div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-xl font-bold mb-4">Top Brands</h3>
          <div className="space-y-3">
            {stats?.top_brands && Object.entries(stats.top_brands).slice(0, 8).map(([brand, count]) => (
              <div key={brand} className="flex justify-between items-center">
                <span className="capitalize font-medium">{brand}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(count / Math.max(...Object.values(stats.top_brands))) * 100}%` }}
                    ></div>
                  </div>
                  <span className="font-semibold text-gray-700 w-12 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-xl font-bold mb-4">Segment Distribution</h3>
          <div className="space-y-4">
            {stats?.segment_distribution?.map(seg => (
              <div key={seg.segment}>
                <div className="flex justify-between mb-1">
                  <span className="font-medium">{seg.segment}</span>
                  <span className="font-semibold text-gray-700">{seg.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full"
                    style={{ width: `${seg.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-xl font-bold mb-4">Fuel Type Distribution</h3>
          <div className="space-y-2">
            {stats?.fuel_type_distribution && Object.entries(stats.fuel_type_distribution).map(([fuel, count]) => (
              <div key={fuel} className="flex justify-between items-center">
                <span className="capitalize">{fuel}</span>
                <span className="font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-xl font-bold mb-4">Transmission Types</h3>
          <div className="space-y-2">
            {stats?.transmission_distribution && Object.entries(stats.transmission_distribution).map(([trans, count]) => (
              <div key={trans} className="flex justify-between items-center">
                <span className="capitalize">{trans}</span>
                <span className="font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;