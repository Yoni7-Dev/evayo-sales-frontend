import React, { useState, useEffect } from 'react';
import { getEmployees, getPositions, addEmployee, updateEmployee, deleteEmployee } from '../services/api';

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    position_id: '',
    salary: '',
    hire_date: new Date().toISOString().split('T')[0],
    phone: '',
    email: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [empRes, posRes] = await Promise.all([
        getEmployees(),
        getPositions()
      ]);
      setEmployees(empRes.data);
      setPositions(posRes.data);
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
      name: '',
      position_id: '',
      salary: '',
      hire_date: new Date().toISOString().split('T')[0],
      phone: '',
      email: ''
    });
    setEditMode(false);
    setCurrentEmployee(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (employee) => {
    setFormData({
      name: employee.name,
      position_id: employee.position_id,
      salary: employee.salary,
      hire_date: employee.hire_date.split('T')[0],
      phone: employee.phone || '',
      email: employee.email || ''
    });
    setCurrentEmployee(employee);
    setEditMode(true);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await updateEmployee(currentEmployee.id, formData);
      } else {
        await addEmployee(formData);
      }
      setShowModal(false);
      fetchData();
      resetForm();
    } catch (error) {
      console.error('Error saving employee:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await deleteEmployee(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting employee:', error);
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
    <div className="employees">
      <div className="page-header">
        <h2 className="page-title mb-0">👥 Employees</h2>
        <button className="btn btn-primary" onClick={openAddModal}>
          + Add Employee
        </button>
      </div>

      {/* Desktop Table View */}
      <div className="card desktop-table">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Position</th>
                  <th>Salary</th>
                  <th className="hide-tablet">Hire Date</th>
                  <th className="hide-tablet">Phone</th>
                  <th className="hide-tablet">Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.length > 0 ? (
                  employees.map((emp, index) => (
                    <tr key={emp.id}>
                      <td>{index + 1}</td>
                      <td className="fw-bold">{emp.name}</td>
                      <td>
                        <span className="badge bg-primary">
                          {emp.position_name}
                        </span>
                      </td>
                      <td>{formatCurrency(emp.salary)}</td>
                      <td className="hide-tablet">{formatDate(emp.hire_date)}</td>
                      <td className="hide-tablet">{emp.phone || '-'}</td>
                      <td className="hide-tablet">{emp.email || '-'}</td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => openEditModal(emp)}
                          >
                            Edit
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(emp.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-4">
                      <div className="empty-state">
                        <p>No employees added yet</p>
                        <button className="btn btn-primary" onClick={openAddModal}>
                          Add Your First Employee
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
        {employees.length > 0 ? (
          employees.map((emp, index) => (
            <div key={emp.id} className="mobile-card-item">
              <div className="item-header">
                <span className="item-title">{emp.name}</span>
                <span className="badge bg-primary">{emp.position_name}</span>
              </div>
              <div className="item-row">
                <span className="item-label">Salary:</span>
                <span className="item-value fw-bold">{formatCurrency(emp.salary)}</span>
              </div>
              <div className="item-row">
                <span className="item-label">Hire Date:</span>
                <span className="item-value">{formatDate(emp.hire_date)}</span>
              </div>
              {emp.phone && (
                <div className="item-row">
                  <span className="item-label">Phone:</span>
                  <span className="item-value">{emp.phone}</span>
                </div>
              )}
              {emp.email && (
                <div className="item-row">
                  <span className="item-label">Email:</span>
                  <span className="item-value" style={{fontSize: '0.85rem'}}>{emp.email}</span>
                </div>
              )}
              <div className="item-actions">
                <button 
                  className="btn btn-outline-primary"
                  onClick={() => openEditModal(emp)}
                >
                  Edit
                </button>
                <button 
                  className="btn btn-outline-danger"
                  onClick={() => handleDelete(emp.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <p>No employees added yet</p>
            <button className="btn btn-primary" onClick={openAddModal}>
              Add Your First Employee
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
                  {editMode ? 'Edit Employee' : 'Add New Employee'}
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
                    <label className="form-label">Full Name *</label>
                    <input 
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Position *</label>
                    <select 
                      className="form-select"
                      name="position_id"
                      value={formData.position_id}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Position</option>
                      {positions.map(pos => (
                        <option key={pos.id} value={pos.id}>
                          {pos.position_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="row">
                    <div className="col-6 mb-3">
                      <label className="form-label">Salary (Birr) *</label>
                      <input 
                        type="number"
                        className="form-control"
                        name="salary"
                        value={formData.salary}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0"
                        required
                      />
                    </div>
                    <div className="col-6 mb-3">
                      <label className="form-label">Hire Date *</label>
                      <input 
                        type="date"
                        className="form-control"
                        name="hire_date"
                        value={formData.hire_date}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Phone</label>
                    <input 
                      type="tel"
                      className="form-control"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input 
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
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
                    {editMode ? 'Update' : 'Add Employee'}
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

export default Employees;
