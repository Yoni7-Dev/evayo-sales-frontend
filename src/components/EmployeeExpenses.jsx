import React, { useState, useEffect } from 'react';
import { 
  getEmployeeExpenses, 
  getEmployees, 
  addEmployeeExpense, 
  updateEmployeeExpense, 
  deleteEmployeeExpense 
} from '../services/api';

function EmployeeExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentExpense, setCurrentExpense] = useState(null);
  const [formData, setFormData] = useState({
    employee_id: '',
    expense_month: new Date().toISOString().slice(0, 7) + '-01',
    salary_paid: '',
    bonus: 0,
    deductions: 0,
    notes: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [expRes, empRes] = await Promise.all([
        getEmployeeExpenses(),
        getEmployees()
      ]);
      setExpenses(expRes.data);
      setEmployees(empRes.data);
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

  const calculateTotal = () => {
    const salary = parseFloat(formData.salary_paid) || 0;
    const bonus = parseFloat(formData.bonus) || 0;
    const deductions = parseFloat(formData.deductions) || 0;
    return (salary + bonus - deductions).toFixed(2);
  };

  const resetForm = () => {
    setFormData({
      employee_id: '',
      expense_month: new Date().toISOString().slice(0, 7) + '-01',
      salary_paid: '',
      bonus: 0,
      deductions: 0,
      notes: ''
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
      employee_id: expense.employee_id,
      expense_month: expense.expense_month.split('T')[0],
      salary_paid: expense.salary_paid,
      bonus: expense.bonus,
      deductions: expense.deductions,
      notes: expense.notes || ''
    });
    setCurrentExpense(expense);
    setEditMode(true);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await updateEmployeeExpense(currentExpense.id, formData);
      } else {
        await addEmployeeExpense(formData);
      }
      setShowModal(false);
      fetchData();
      resetForm();
    } catch (error) {
      console.error('Error saving expense:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense record?')) {
      try {
        await deleteEmployeeExpense(id);
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

  const formatMonth = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
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
    <div className="employee-expenses">
      <div className="page-header">
        <h2 className="page-title mb-0">💰 Employee Expenses</h2>
        <button className="btn btn-primary" onClick={openAddModal}>
          + Add Expense
        </button>
      </div>

      {/* Summary Cards */}
      <div className="row summary-row mb-4">
        <div className="col-4 mb-3">
          <div className="card bg-info text-white h-100">
            <div className="card-body text-center py-3">
              <h6 className="mb-1" style={{fontSize: '0.75rem'}}>Records</h6>
              <h4 className="mb-0">{expenses.length}</h4>
            </div>
          </div>
        </div>
        <div className="col-4 mb-3">
          <div className="card bg-success text-white h-100">
            <div className="card-body text-center py-3">
              <h6 className="mb-1" style={{fontSize: '0.75rem'}}>Total Paid</h6>
              <h4 className="mb-0" style={{fontSize: '1rem'}}>{formatCurrency(expenses.reduce((sum, e) => sum + parseFloat(e.total_expense), 0))}</h4>
            </div>
          </div>
        </div>
        <div className="col-4 mb-3">
          <div className="card bg-warning text-dark h-100">
            <div className="card-body text-center py-3">
              <h6 className="mb-1" style={{fontSize: '0.75rem'}}>Employees</h6>
              <h4 className="mb-0">{employees.length}</h4>
            </div>
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
                  <th>Month</th>
                  <th>Employee</th>
                  <th className="hide-tablet">Position</th>
                  <th>Salary</th>
                  <th className="hide-tablet">Bonus</th>
                  <th className="hide-tablet">Deductions</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.length > 0 ? (
                  expenses.map((expense, index) => (
                    <tr key={expense.id}>
                      <td>{index + 1}</td>
                      <td>{formatMonth(expense.expense_month)}</td>
                      <td className="fw-bold">{expense.employee_name}</td>
                      <td className="hide-tablet">
                        <span className="badge bg-secondary">
                          {expense.position_name}
                        </span>
                      </td>
                      <td>{formatCurrency(expense.salary_paid)}</td>
                      <td className="hide-tablet text-success">+{formatCurrency(expense.bonus)}</td>
                      <td className="hide-tablet text-danger">-{formatCurrency(expense.deductions)}</td>
                      <td className="fw-bold">{formatCurrency(expense.total_expense)}</td>
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
                    <td colSpan="9" className="text-center py-4">
                      <div className="empty-state">
                        <p>No expense records yet</p>
                        <button className="btn btn-primary" onClick={openAddModal}>
                          Add First Expense Record
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
                <span className="item-title">{expense.employee_name}</span>
                <span className="badge bg-secondary">{expense.position_name}</span>
              </div>
              <div className="item-row">
                <span className="item-label">Month:</span>
                <span className="item-value">{formatMonth(expense.expense_month)}</span>
              </div>
              <div className="item-row">
                <span className="item-label">Salary:</span>
                <span className="item-value">{formatCurrency(expense.salary_paid)}</span>
              </div>
              <div className="item-row">
                <span className="item-label">Bonus:</span>
                <span className="item-value text-success">+{formatCurrency(expense.bonus)}</span>
              </div>
              <div className="item-row">
                <span className="item-label">Deductions:</span>
                <span className="item-value text-danger">-{formatCurrency(expense.deductions)}</span>
              </div>
              <div className="item-row">
                <span className="item-label">Total:</span>
                <span className="item-value fw-bold">{formatCurrency(expense.total_expense)}</span>
              </div>
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
            <p>No expense records yet</p>
            <button className="btn btn-primary" onClick={openAddModal}>
              Add First Expense Record
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
                    <label className="form-label">Employee *</label>
                    <select 
                      className="form-select"
                      name="employee_id"
                      value={formData.employee_id}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Employee</option>
                      {employees.map(emp => (
                        <option key={emp.id} value={emp.id}>
                          {emp.name} - {emp.position_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Month *</label>
                    <input 
                      type="month"
                      className="form-control"
                      name="expense_month"
                      value={formData.expense_month.slice(0, 7)}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        expense_month: e.target.value + '-01'
                      }))}
                      required
                    />
                  </div>
                  <div className="row">
                    <div className="col-4 mb-3">
                      <label className="form-label">Salary *</label>
                      <input 
                        type="number"
                        className="form-control"
                        name="salary_paid"
                        value={formData.salary_paid}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0"
                        required
                      />
                    </div>
                    <div className="col-4 mb-3">
                      <label className="form-label">Bonus</label>
                      <input 
                        type="number"
                        className="form-control"
                        name="bonus"
                        value={formData.bonus}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0"
                      />
                    </div>
                    <div className="col-4 mb-3">
                      <label className="form-label">Deductions</label>
                      <input 
                        type="number"
                        className="form-control"
                        name="deductions"
                        value={formData.deductions}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0"
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Total</label>
                    <input 
                      type="text"
                      className="form-control bg-light fw-bold"
                      value={formatCurrency(calculateTotal())}
                      disabled
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Notes</label>
                    <textarea 
                      className="form-control"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows="2"
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

export default EmployeeExpenses;
