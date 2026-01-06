import React, { useState, useEffect } from 'react';
import { 
  getExpenses, 
  getExpenseCategories, 
  addExpense, 
  updateExpense, 
  deleteExpense 
} from '../services/api';

function OtherExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentExpense, setCurrentExpense] = useState(null);
  const [formData, setFormData] = useState({
    category_id: '',
    amount: '',
    expense_date: new Date().toISOString().split('T')[0],
    description: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [expRes, catRes] = await Promise.all([
        getExpenses(),
        getExpenseCategories()
      ]);
      setExpenses(expRes.data);
      setCategories(catRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      category_id: '',
      amount: '',
      expense_date: new Date().toISOString().split('T')[0],
      description: ''
    });
    setEditMode(false);
    setCurrentExpense(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (expense) => {
    setFormData({
      category_id: expense.category_id,
      amount: expense.amount,
      expense_date: expense.expense_date.split('T')[0],
      description: expense.description || ''
    });
    setCurrentExpense(expense);
    setEditMode(true);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await updateExpense(currentExpense.id, formData);
      } else {
        await addExpense(formData);
      }
      setShowModal(false);
      fetchData();
      resetForm();
    } catch (error) {
      console.error('Error saving expense:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await deleteExpense(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting expense:', error);
      }
    }
  };

  // const formatCurrency = (amount) => {
  //   return new Intl.NumberFormat('en-US', {
  //     style: 'currency',
  //     currency: 'USD'
  //   }).format(amount);
  // };



    const formatCurrency = (amount) => {
  return new Intl.NumberFormat("am-ET", {
    style: "currency",
    currency: "ETB",
    minimumFractionDigits: 2
  }).format(amount || 0);
};


  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryColor = (categoryName) => {
    const colors = {
      'Rent': 'bg-danger',
      'Utilities': 'bg-warning text-dark',
      'Ingredients': 'bg-success',
      'Equipment': 'bg-info',
      'Maintenance': 'bg-secondary',
      'Marketing': 'bg-primary',
      'Transportation': 'bg-dark',
      'Insurance': 'bg-danger',
      'Packaging': 'bg-success',
      'Miscellaneous': 'bg-secondary'
    };
    return colors[categoryName] || 'bg-secondary';
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);

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
    <div className="other-expenses">
      <div className="page-header">
        <h2 className="page-title mb-0">📋 Other Expenses</h2>
        <button className="btn btn-primary" onClick={openAddModal}>
          + Add Expense
        </button>
      </div>

      {/* Summary Cards */}
      <div className="row summary-row mb-4">
        <div className="col-6 mb-3">
          <div className="card bg-danger text-white h-100">
            <div className="card-body text-center py-3">
              <h6 className="mb-1">Total Expenses</h6>
              <h4 className="mb-0">{formatCurrency(totalExpenses)}</h4>
            </div>
          </div>
        </div>
        <div className="col-6 mb-3">
          <div className="card bg-info text-white h-100">
            <div className="card-body text-center py-3">
              <h6 className="mb-1">Records</h6>
              <h4 className="mb-0">{expenses.length}</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Category Summary - Scrollable on mobile */}
      <div className="card mb-4">
        <div className="card-header bg-white">
          <h6 className="mb-0">Expenses by Category</h6>
        </div>
        <div className="card-body" style={{overflowX: 'auto'}}>
          <div className="d-flex flex-wrap gap-2">
            {categories.map(cat => {
              const catTotal = expenses
                .filter(e => e.category_id === cat.id)
                .reduce((sum, e) => sum + parseFloat(e.amount), 0);
              const percentage = totalExpenses > 0 ? ((catTotal / totalExpenses) * 100).toFixed(0) : 0;
              
              if (catTotal === 0) return null;
              
              return (
                <div className="p-2 border rounded text-center category-item" key={cat.id} style={{minWidth: '100px'}}>
                  <span className={`badge ${getCategoryColor(cat.category_name)} mb-1`} style={{fontSize: '0.7rem'}}>
                    {cat.category_name}
                  </span>
                  <div className="fw-bold" style={{fontSize: '0.85rem'}}>{formatCurrency(catTotal)}</div>
                  <small className="text-muted">{percentage}%</small>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="card desktop-table">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th className="hide-tablet">Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.length > 0 ? (
                  expenses.map((expense, index) => (
                    <tr key={expense.id}>
                      <td>{index + 1}</td>
                      <td>{formatDate(expense.expense_date)}</td>
                      <td>
                        <span className={`badge ${getCategoryColor(expense.category_name)}`}>
                          {expense.category_name}
                        </span>
                      </td>
                      <td className="fw-bold text-danger">
                        {formatCurrency(expense.amount)}
                      </td>
                      <td className="hide-tablet">{expense.description || '-'}</td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => openEditModal(expense)}
                          >
                            Edit
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(expense.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      <div className="empty-state">
                        <p>No expenses recorded yet</p>
                        <button className="btn btn-primary" onClick={openAddModal}>
                          Add Your First Expense
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="mobile-card">
        {expenses.length > 0 ? (
          expenses.map((expense, index) => (
            <div key={expense.id} className="mobile-card-item">
              <div className="item-header">
                <span className={`badge ${getCategoryColor(expense.category_name)}`}>
                  {expense.category_name}
                </span>
                <span className="fw-bold text-danger">{formatCurrency(expense.amount)}</span>
              </div>
              <div className="item-row">
                <span className="item-label">Date:</span>
                <span className="item-value">{formatDate(expense.expense_date)}</span>
              </div>
              {expense.description && (
                <div className="item-row">
                  <span className="item-label">Description:</span>
                  <span className="item-value">{expense.description}</span>
                </div>
              )}
              <div className="item-actions">
                <button 
                  className="btn btn-outline-primary"
                  onClick={() => openEditModal(expense)}
                >
                  Edit
                </button>
                <button 
                  className="btn btn-outline-danger"
                  onClick={() => handleDelete(expense.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <p>No expenses recorded yet</p>
            <button className="btn btn-primary" onClick={openAddModal}>
              Add Your First Expense
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editMode ? 'Edit Expense' : 'Add Expense'}
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Category *</label>
                    <select 
                      className="form-select"
                      name="category_id"
                      value={formData.category_id}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>
                          {cat.category_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="row">
                    <div className="col-6 mb-3">
                      <label className="form-label">Amount ($) *</label>
                      <input 
                        type="number"
                        className="form-control"
                        name="amount"
                        value={formData.amount}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0"
                        required
                      />
                    </div>
                    <div className="col-6 mb-3">
                      <label className="form-label">Date *</label>
                      <input 
                        type="date"
                        className="form-control"
                        name="expense_date"
                        value={formData.expense_date}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea 
                      className="form-control"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="2"
                      placeholder="Enter details..."
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editMode ? 'Update' : 'Add'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OtherExpenses;
