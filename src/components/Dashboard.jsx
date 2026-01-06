import React, { useState, useEffect } from 'react';
import { getDashboard, getSalesSummary, getExpensesSummary } from '../services/api';

function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    todaySales: 0,
    monthSales: 0,
    employeeCount: 0,
    monthExpenses: 0
  });
  const [salesSummary, setSalesSummary] = useState([]);
  const [expensesSummary, setExpensesSummary] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [dashRes, salesRes, expensesRes] = await Promise.all([
        getDashboard(),
        getSalesSummary(),
        getExpensesSummary()
      ]);
      setDashboardData(dashRes.data);
      setSalesSummary(salesRes.data);
      setExpensesSummary(expensesRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // const formatCurrency = (amount) => {
  //   return new Intl.NumberFormat('en-US', {
  //     style: 'currency',
  //     currency: 'USD'
  //   }).format(amount || 0);
  // };



  const formatCurrency = (amount) => {
  return new Intl.NumberFormat("am-ET", {
    style: "currency",
    currency: "ETB",
    minimumFractionDigits: 2
  }).format(amount || 0);
};


  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h2 className="page-title">📊 Dashboard</h2>
      
      {/* Stats Cards */}
      <div className="row summary-row mb-4">
        <div className="col-6 col-md-3 mb-3">
          <div className="card dashboard-card h-100">
            <div className="card-body text-center">
              <h6 className="card-title">Today's Sales</h6>
              <p className="display-6 mb-0">{formatCurrency(dashboardData.todaySales)}</p>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3 mb-3">
          <div className="card dashboard-card h-100" style={{background: 'linear-gradient(135deg, #2E7D32, #4CAF50)'}}>
            <div className="card-body text-center">
              <h6 className="card-title">Month Sales</h6>
              <p className="display-6 mb-0">{formatCurrency(dashboardData.monthSales)}</p>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3 mb-3">
          <div className="card dashboard-card h-100" style={{background: 'linear-gradient(135deg, #1565C0, #42A5F5)'}}>
            <div className="card-body text-center">
              <h6 className="card-title">Employees</h6>
              <p className="display-6 mb-0">{dashboardData.employeeCount}</p>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3 mb-3">
          <div className="card dashboard-card h-100" style={{background: 'linear-gradient(135deg, #C62828, #EF5350)'}}>
            <div className="card-body text-center">
              <h6 className="card-title">Month Expenses</h6>
              <p className="display-6 mb-0">{formatCurrency(dashboardData.monthExpenses)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Sales Summary */}
        <div className="col-12 col-lg-6 mb-4">
          <div className="card h-100">
            <div className="card-header bg-white">
              <h5 className="mb-0">🍞 Sales by Product</h5>
            </div>
            <div className="card-body p-0">
              {salesSummary.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-sm mb-0">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Qty</th>
                        <th>Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {salesSummary.map((item, index) => (
                        <tr key={index}>
                          <td>{item.bread_name}</td>
                          <td>{item.total_quantity}</td>
                          <td className="text-success fw-bold">{formatCurrency(item.total_revenue)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted text-center py-4 mb-0">No sales data available</p>
              )}
            </div>
          </div>
        </div>

        {/* Expenses Summary */}
        <div className="col-12 col-lg-6 mb-4">
          <div className="card h-100">
            <div className="card-header bg-white">
              <h5 className="mb-0">📋 Expenses by Category</h5>
            </div>
            <div className="card-body p-0">
              {expensesSummary.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-sm mb-0">
                    <thead>
                      <tr>
                        <th>Category</th>
                        <th>Count</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expensesSummary.map((item, index) => (
                        <tr key={index}>
                          <td>{item.category_name}</td>
                          <td>{item.count}</td>
                          <td className="text-danger fw-bold">{formatCurrency(item.total_amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted text-center py-4 mb-0">No expense data available</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Profit Card */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body text-center py-4">
              <h5 className="mb-3">💰 Net Profit This Month</h5>
              <p className={`display-4 mb-0 ${(dashboardData.monthSales - dashboardData.monthExpenses) >= 0 ? 'text-success' : 'text-danger'}`}>
                {formatCurrency(dashboardData.monthSales - dashboardData.monthExpenses)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
