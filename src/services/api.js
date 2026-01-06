import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401 responses
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth
export const login = (data) => api.post('/auth/login', data);
export const register = (data) => api.post('/auth/register', data);
export const getProfile = () => api.get('/auth/profile');
export const verifyToken = () => api.get('/auth/verify');
export const changePassword = (data) => api.put('/auth/change-password', data);
export const getAllUsers = () => api.get('/auth/users');

// Dashboard
export const getDashboard = () => api.get('/dashboard');

// Sales
export const getSales = () => api.get('/sales');
export const getSalesByRange = (startDate, endDate) => 
    api.get(`/sales/range?startDate=${startDate}&endDate=${endDate}`);
export const getBreadTypes = () => api.get('/sales/bread-types');
export const getSalespersons = () => api.get('/sales/salespersons');
export const addSale = (data) => api.post('/sales', data);
export const updateSale = (id, data) => api.put(`/sales/${id}`, data);
export const deleteSale = (id) => api.delete(`/sales/${id}`);
export const getSalesSummary = () => api.get('/sales/summary');
export const getSalesBySalesperson = () => api.get('/sales/summary-by-salesperson');

// Employees
export const getEmployees = () => api.get('/employees');
export const getPositions = () => api.get('/employees/positions');
export const addEmployee = (data) => api.post('/employees', data);
export const updateEmployee = (id, data) => api.put(`/employees/${id}`, data);
export const deleteEmployee = (id) => api.delete(`/employees/${id}`);

// Employee Expenses
export const getEmployeeExpenses = () => api.get('/employees/expenses');
export const addEmployeeExpense = (data) => api.post('/employees/expenses', data);
export const updateEmployeeExpense = (id, data) => api.put(`/employees/expenses/${id}`, data);
export const deleteEmployeeExpense = (id) => api.delete(`/employees/expenses/${id}`);

// Other Expenses
export const getExpenses = () => api.get('/expenses');
export const getExpensesByRange = (startDate, endDate) => 
    api.get(`/expenses/range?startDate=${startDate}&endDate=${endDate}`);
export const getExpenseCategories = () => api.get('/expenses/categories');
export const addExpense = (data) => api.post('/expenses', data);
export const updateExpense = (id, data) => api.put(`/expenses/${id}`, data);
export const deleteExpense = (id) => api.delete(`/expenses/${id}`);
export const getExpensesSummary = () => api.get('/expenses/summary');

export default api;
