// import React, { useState, useEffect } from 'react';
// import { getSales, getBreadTypes, getSalespersons, addSale, updateSale, deleteSale } from '../services/api';

// function Sales() {
//   const [sales, setSales] = useState([]);
//   const [breadTypes, setBreadTypes] = useState([]);
//   const [salespersons, setSalespersons] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [editMode, setEditMode] = useState(false);
//   const [currentSale, setCurrentSale] = useState(null);
//   const [formData, setFormData] = useState({
//     bread_type_id: '',
//     salesperson_id: '',
//     quantity: 1,
//     single_price: '',
//     sale_date: new Date().toISOString().split('T')[0],
//     notes: ''
//   });

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const [salesRes, breadRes, salespersonRes] = await Promise.all([
//         getSales(),
//         getBreadTypes(),
//         getSalespersons()
//       ]);
//       setSales(salesRes.data);
//       setBreadTypes(breadRes.data);
//       setSalespersons(salespersonRes.data);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const calculateTotal = () => {
//     return (formData.quantity * formData.single_price).toFixed(2);
//   };

//   const resetForm = () => {
//     setFormData({
//       bread_type_id: '',
//       salesperson_id: '',
//       quantity: 1,
//       single_price: '',
//       sale_date: new Date().toISOString().split('T')[0],
//       notes: ''
//     });
//     setEditMode(false);
//     setCurrentSale(null);
//   };

//   const openAddModal = () => {
//     resetForm();
//     setShowModal(true);
//   };

//   const openEditModal = (sale) => {
//     setFormData({
//       bread_type_id: sale.bread_type_id,
//       salesperson_id: sale.salesperson_id || '',
//       quantity: sale.quantity,
//       single_price: sale.single_price,
//       sale_date: sale.sale_date.split('T')[0],
//       notes: sale.notes || ''
//     });
//     setCurrentSale(sale);
//     setEditMode(true);
//     setShowModal(true);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (editMode) {
//         await updateSale(currentSale.id, formData);
//       } else {
//         await addSale(formData);
//       }
//       setShowModal(false);
//       fetchData();
//       resetForm();
//     } catch (error) {
//       console.error('Error saving sale:', error);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this sale?')) {
//       try {
//         await deleteSale(id);
//         fetchData();
//       } catch (error) {
//         console.error('Error deleting sale:', error);
//       }
//     }
//   };

//   // const formatCurrency = (amount) => {
//   //   return new Intl.NumberFormat('en-US', {
//   //     style: 'currency',
//   //     currency: 'USD'
//   //   }).format(amount);
//   // };


//   const formatCurrency = (amount) => {
//   return new Intl.NumberFormat("am-ET", {
//     style: "currency",
//     currency: "ETB",
//     minimumFractionDigits: 2
//   }).format(amount || 0);
// };


//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   if (loading) {
//     return (
//       <div className="spinner-container">
//         <div className="spinner-border text-primary" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="sales">
//       <div className="page-header">
//         <h2 className="page-title mb-0">🛒 Evayo Bread Sales</h2>
//         <button className="btn btn-primary" onClick={openAddModal}>
//           + Add New Sale
//         </button>
//       </div>

//       {/* Desktop Table View */}
//       <div className="card desktop-table">
//         <div className="card-body p-0">
//           <div className="table-responsive">
//             <table className="table table-hover mb-0">
//               <thead>
//                 <tr>
//                   <th>#</th>
//                   <th>Date</th>
//                   <th>Bread Type</th>
//                   <th>Sold By</th>
//                   <th>Qty</th>
//                   <th>Unit Price</th>
//                   <th>Total</th>
//                   <th className="hide-tablet">Notes</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {sales.length > 0 ? (
//                   sales.map((sale, index) => (
//                     <tr key={sale.id}>
//                       <td>{index + 1}</td>
//                       <td>{formatDate(sale.sale_date)}</td>
//                       <td>
//                         <span className="badge bg-warning text-dark">
//                           {sale.bread_name}
//                         </span>
//                       </td>
//                       <td>
//                         {sale.salesperson_name ? (
//                           <span className="badge bg-info text-dark">
//                             👤 {sale.salesperson_name}
//                           </span>
//                         ) : (
//                           <span className="text-muted">-</span>
//                         )}
//                       </td>
//                       <td>{sale.quantity}</td>
//                       <td>{formatCurrency(sale.single_price)}</td>
//                       <td className="fw-bold text-success">
//                         {formatCurrency(sale.total_price)}
//                       </td>
//                       <td className="hide-tablet">{sale.notes || '-'}</td>
//                       <td>
//                         <div className="action-buttons">
//                           <button 
//                             className="btn btn-sm btn-outline-primary"
//                             onClick={() => openEditModal(sale)}
//                           >
//                             Edit
//                           </button>
//                           <button 
//                             className="btn btn-sm btn-outline-danger"
//                             onClick={() => handleDelete(sale.id)}
//                           >
//                             Delete
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="9" className="text-center py-4">
//                       <div className="empty-state">
//                         <p>No sales recorded yet</p>
//                         <button className="btn btn-primary" onClick={openAddModal}>
//                           Add Your First Sale
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Card View */}
//       <div className="mobile-card">
//         {sales.length > 0 ? (
//           sales.map((sale, index) => (
//             <div key={sale.id} className="mobile-card-item">
//               <div className="item-header">
//                 <span className="item-title">{sale.bread_name}</span>
//                 <span className="badge bg-warning text-dark">#{index + 1}</span>
//               </div>
//               <div className="item-row">
//                 <span className="item-label">Date:</span>
//                 <span className="item-value">{formatDate(sale.sale_date)}</span>
//               </div>
//               <div className="item-row">
//                 <span className="item-label">Sold By:</span>
//                 <span className="item-value">
//                   {sale.salesperson_name ? (
//                     <span className="badge bg-info text-dark">👤 {sale.salesperson_name}</span>
//                   ) : (
//                     <span className="text-muted">Not assigned</span>
//                   )}
//                 </span>
//               </div>
//               <div className="item-row">
//                 <span className="item-label">Quantity:</span>
//                 <span className="item-value">{sale.quantity}</span>
//               </div>
//               <div className="item-row">
//                 <span className="item-label">Unit Price:</span>
//                 <span className="item-value">{formatCurrency(sale.single_price)}</span>
//               </div>
//               <div className="item-row">
//                 <span className="item-label">Total:</span>
//                 <span className="item-value fw-bold text-success">{formatCurrency(sale.total_price)}</span>
//               </div>
//               {sale.notes && (
//                 <div className="item-row">
//                   <span className="item-label">Notes:</span>
//                   <span className="item-value">{sale.notes}</span>
//                 </div>
//               )}
//               <div className="item-actions">
//                 <button 
//                   className="btn btn-outline-primary"
//                   onClick={() => openEditModal(sale)}
//                 >
//                   Edit
//                 </button>
//                 <button 
//                   className="btn btn-outline-danger"
//                   onClick={() => handleDelete(sale.id)}
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           ))
//         ) : (
//           <div className="empty-state">
//             <p>No sales recorded yet</p>
//             <button className="btn btn-primary" onClick={openAddModal}>
//               Add Your First Sale
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Modal */}
//       {showModal && (
//         <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
//           <div className="modal-dialog modal-dialog-centered">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h5 className="modal-title">
//                   {editMode ? 'Edit Sale' : 'Add New Sale'}
//                 </h5>
//                 <button 
//                   type="button" 
//                   className="btn-close" 
//                   onClick={() => setShowModal(false)}
//                 ></button>
//               </div>
//               <form onSubmit={handleSubmit}>
//                 <div className="modal-body">
//                   <div className="mb-3">
//                     <label className="form-label">Bread Type *</label>
//                     <select 
//                       className="form-select"
//                       name="bread_type_id"
//                       value={formData.bread_type_id}
//                       onChange={handleInputChange}
//                       required
//                     >
//                       <option value="">Select Bread Type</option>
//                       {breadTypes.map(bread => (
//                         <option key={bread.id} value={bread.id}>
//                           {bread.name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                   <div className="mb-3">
//                     <label className="form-label">👤 Sold By (Salesperson)</label>
//                     <select 
//                       className="form-select"
//                       name="salesperson_id"
//                       value={formData.salesperson_id}
//                       onChange={handleInputChange}
//                     >
//                       <option value="">Select Salesperson (Optional)</option>
//                       {salespersons.map(person => (
//                         <option key={person.id} value={person.id}>
//                           {person.name} - {person.position_name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                   <div className="row">
//                     <div className="col-6 mb-3">
//                       <label className="form-label">Quantity *</label>
//                       <input 
//                         type="number"
//                         className="form-control"
//                         name="quantity"
//                         value={formData.quantity}
//                         onChange={handleInputChange}
//                         min="1"
//                         required
//                       />
//                     </div>
//                     <div className="col-6 mb-3">
//                       <label className="form-label">Unit Price (Birr) *</label>
//                       <input 
//                         type="number"
//                         className="form-control"
//                         name="single_price"
//                         value={formData.single_price}
//                         onChange={handleInputChange}
//                         step="0.01"
//                         min="0"
//                         required
//                       />
//                     </div>
//                   </div>
//                   <div className="mb-3">
//                     <label className="form-label">Total Price</label>
//                     <input 
//                       type="text"
//                       className="form-control bg-light fw-bold text-success"
//                       value={formatCurrency(calculateTotal())}
//                       disabled
//                     />
//                   </div>
//                   <div className="mb-3">
//                     <label className="form-label">Sale Date *</label>
//                     <input 
//                       type="date"
//                       className="form-control"
//                       name="sale_date"
//                       value={formData.sale_date}
//                       onChange={handleInputChange}
//                       required
//                     />
//                   </div>
//                   <div className="mb-3">
//                     <label className="form-label">Notes</label>
//                     <textarea 
//                       className="form-control"
//                       name="notes"
//                       value={formData.notes}
//                       onChange={handleInputChange}
//                       rows="2"
//                     ></textarea>
//                   </div>
//                 </div>
//                 <div className="modal-footer">
//                   <button 
//                     type="button" 
//                     className="btn btn-secondary"
//                     onClick={() => setShowModal(false)}
//                   >
//                     Cancel
//                   </button>
//                   <button type="submit" className="btn btn-primary">
//                     {editMode ? 'Update' : 'Add Sale'}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Sales;

import React, { useState, useEffect } from 'react';
import { getSales, getBreadTypes, getSalespersons, addSale, updateSale, deleteSale } from '../services/api';
import { useAuth } from '../context/AuthContext';

function Sales() {
  const { user } = useAuth(); // Get logged-in user
  const [sales, setSales] = useState([]);
  const [breadTypes, setBreadTypes] = useState([]);
  const [salespersons, setSalespersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentSale, setCurrentSale] = useState(null);
  const [loggedInSalesperson, setLoggedInSalesperson] = useState(null);
  const [formData, setFormData] = useState({
    bread_type_id: '',
    salesperson_id: '',
    quantity: 1,
    single_price: '',
    sale_date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  // Find and set the logged-in user's salesperson ID
  useEffect(() => {
    if (user && salespersons.length > 0) {
      // Match by user ID, email, or username
      const matchedSalesperson = salespersons.find(
        person => 
          person.user_id === user.id || 
          person.email === user.email || 
          person.name?.toLowerCase() === user.username?.toLowerCase() ||
          person.name?.toLowerCase() === user.name?.toLowerCase()
      );
      
      if (matchedSalesperson) {
        setLoggedInSalesperson(matchedSalesperson);
        setFormData(prev => ({
          ...prev,
          salesperson_id: matchedSalesperson.id
        }));
      }
    }
  }, [user, salespersons]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [salesRes, breadRes, salespersonRes] = await Promise.all([
        getSales(),
        getBreadTypes(),
        getSalespersons()
      ]);
      setSales(salesRes.data);
      setBreadTypes(breadRes.data);
      setSalespersons(salespersonRes.data);
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
    return (formData.quantity * formData.single_price).toFixed(2);
  };

  const resetForm = () => {
    setFormData({
      bread_type_id: '',
      salesperson_id: loggedInSalesperson ? loggedInSalesperson.id : '',
      quantity: 1,
      single_price: '',
      sale_date: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setEditMode(false);
    setCurrentSale(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (sale) => {
    setFormData({
      bread_type_id: sale.bread_type_id,
      salesperson_id: sale.salesperson_id || '',
      quantity: sale.quantity,
      single_price: sale.single_price,
      sale_date: sale.sale_date.split('T')[0],
      notes: sale.notes || ''
    });
    setCurrentSale(sale);
    setEditMode(true);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await updateSale(currentSale.id, formData);
      } else {
        await addSale(formData);
      }
      setShowModal(false);
      fetchData();
      resetForm();
    } catch (error) {
      console.error('Error saving sale:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this sale?')) {
      try {
        await deleteSale(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting sale:', error);
      }
    }
  };

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
    <div className="sales">
      <div className="page-header">
        <h2 className="page-title mb-0">🛒 Evayo Bread Sales</h2>
        <button className="btn btn-primary" onClick={openAddModal}>
          + Add New Sale
        </button>
      </div>

      {/* Display Current Salesperson Card */}
      {loggedInSalesperson && (
        <div className="salesperson-card">
          <div className="d-flex align-items-center gap-3">
            <div className="salesperson-avatar">👤</div>
            <div>
              <div className="salesperson-name">{loggedInSalesperson.name}</div>
              <small style={{opacity: 0.85}}>Currently logged in as seller</small>
            </div>
          </div>
          <span className="salesperson-role">
            {loggedInSalesperson.position_name || 'Salesperson'}
          </span>
        </div>
      )}

      {!loggedInSalesperson && user && (
        <div className="alert alert-warning d-flex align-items-center mb-3" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          <div>
            <strong>Welcome, {user.username || user.name}!</strong> Your account is not linked to a salesperson profile.
          </div>
        </div>
      )}

      {/* Desktop Table View */}
      <div className="card desktop-table">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>Bread Type</th>
                  <th>Sold By</th>
                  <th>Qty</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                  <th className="hide-tablet">Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sales.length > 0 ? (
                  sales.map((sale, index) => (
                    <tr key={sale.id}>
                      <td>{index + 1}</td>
                      <td>{formatDate(sale.sale_date)}</td>
                      <td>
                        <span className="badge bg-warning text-dark">
                          {sale.bread_name}
                        </span>
                      </td>
                      <td>
                        {sale.salesperson_name ? (
                          <span className="badge bg-info text-dark">
                            👤 {sale.salesperson_name}
                          </span>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td>{sale.quantity}</td>
                      <td>{formatCurrency(sale.single_price)}</td>
                      <td className="fw-bold text-success">
                        {formatCurrency(sale.total_price)}
                      </td>
                      <td className="hide-tablet">{sale.notes || '-'}</td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => openEditModal(sale)}
                          >
                            Edit
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(sale.id)}
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
                        <p>No sales recorded yet</p>
                        <button className="btn btn-primary" onClick={openAddModal}>
                          Add Your First Sale
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
        {sales.length > 0 ? (
          sales.map((sale, index) => (
            <div key={sale.id} className="mobile-card-item">
              <div className="item-header">
                <span className="item-title">{sale.bread_name}</span>
                <span className="badge bg-warning text-dark">#{index + 1}</span>
              </div>
              <div className="item-row">
                <span className="item-label">Date:</span>
                <span className="item-value">{formatDate(sale.sale_date)}</span>
              </div>
              <div className="item-row">
                <span className="item-label">Sold By:</span>
                <span className="item-value">
                  {sale.salesperson_name ? (
                    <span className="badge bg-info text-dark">👤 {sale.salesperson_name}</span>
                  ) : (
                    <span className="text-muted">Not assigned</span>
                  )}
                </span>
              </div>
              <div className="item-row">
                <span className="item-label">Quantity:</span>
                <span className="item-value">{sale.quantity}</span>
              </div>
              <div className="item-row">
                <span className="item-label">Unit Price:</span>
                <span className="item-value">{formatCurrency(sale.single_price)}</span>
              </div>
              <div className="item-row">
                <span className="item-label">Total:</span>
                <span className="item-value fw-bold text-success">{formatCurrency(sale.total_price)}</span>
              </div>
              {sale.notes && (
                <div className="item-row">
                  <span className="item-label">Notes:</span>
                  <span className="item-value">{sale.notes}</span>
                </div>
              )}
              <div className="item-actions">
                <button 
                  className="btn btn-outline-primary"
                  onClick={() => openEditModal(sale)}
                >
                  Edit
                </button>
                <button 
                  className="btn btn-outline-danger"
                  onClick={() => handleDelete(sale.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <p>No sales recorded yet</p>
            <button className="btn btn-primary" onClick={openAddModal}>
              Add Your First Sale
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
                  {editMode ? 'Edit Sale' : 'Add New Sale'}
                  {loggedInSalesperson && (
                    <small className="d-block text-light mt-1" style={{fontSize: '0.8rem', opacity: 0.9}}>
                      👤 Selling as: {loggedInSalesperson.name}
                    </small>
                  )}
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  {/* Salesperson Dropdown - Pre-selected based on login */}
                  <div className="mb-3">
                    <label className="form-label">👤 Sold By (Salesperson) *</label>
                    <select 
                      className="form-select"
                      name="salesperson_id"
                      value={formData.salesperson_id}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Salesperson</option>
                      {salespersons.map(person => (
                        <option key={person.id} value={person.id}>
                          {person.name} - {person.position_name}
                        </option>
                      ))}
                    </select>
                    {loggedInSalesperson && String(formData.salesperson_id) === String(loggedInSalesperson.id) && (
                      <small className="text-success">
                        <i className="bi bi-check-circle me-1"></i>
                        Auto-selected based on your login account
                      </small>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Bread Type *</label>
                    <select 
                      className="form-select"
                      name="bread_type_id"
                      value={formData.bread_type_id}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Bread Type</option>
                      {breadTypes.map(bread => (
                        <option key={bread.id} value={bread.id}>
                          {bread.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="row">
                    <div className="col-6 mb-3">
                      <label className="form-label">Quantity *</label>
                      <input 
                        type="number"
                        className="form-control"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        min="1"
                        required
                      />
                    </div>
                    <div className="col-6 mb-3">
                      <label className="form-label">Unit Price (Birr) *</label>
                      <input 
                        type="number"
                        className="form-control"
                        name="single_price"
                        value={formData.single_price}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0"
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Total Price</label>
                    <input 
                      type="text"
                      className="form-control bg-light fw-bold text-success"
                      value={formatCurrency(calculateTotal())}
                      disabled
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Sale Date *</label>
                    <input 
                      type="date"
                      className="form-control"
                      name="sale_date"
                      value={formData.sale_date}
                      onChange={handleInputChange}
                      required
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
                    {editMode ? 'Update' : 'Add Sale'}
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

export default Sales;