import axios from 'axios';
import { ApiResponse, Transaction, TransactionFilters, User } from '@/types';
import { mockSchools, mockTransactions, mockUser, delay } from './mockData';

// Flag to determine if we should use mock data
const USE_MOCK_DATA = false; // Set to false when backend is available

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'https://school-payment-service-backend.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.error("Auth Token:", token); // Changed to console.error for better visibility
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.error("Request Headers:", config.headers); // Added to see the actual headers being sent
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors (token expired or invalid)
    console.error("API Error:", error);
    if (error.response) {
      console.error("Error Response Status:", error.response.status);
      console.error("Error Response Data:", error.response.data);
    }
    
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login
      console.error("401 Unauthorized - Clearing token and redirecting");
      localStorage.removeItem('token');
      window.location.href = '/sign-in';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const register = async (email: string, password: string, role: 'school' | 'admin', schoolId?: string) => {
  if (USE_MOCK_DATA) {
    await delay(500); // Simulate network delay
    // Simulate successful registration
    return { success: true, message: 'Registration successful', data: { token: 'mock-token-123' } };
  }
  
  const response = await api.post('/auth/register', { email, password, role, schoolId });
  return response.data;
};

export const login = async (email: string, password: string) => {
  if (USE_MOCK_DATA) {
    await delay(500); // Simulate network delay
    // Store mock token in localStorage
    localStorage.setItem('token', 'mock-token-123');
    return { 
      success: true, 
      message: 'Login successful', 
      data: { 
        token: 'mock-token-123',
        user: mockUser
      } 
    };
  }
  
  const response = await api.post('/auth/login', { email, password });
  // Store the token in localStorage when login is successful
  if (response.data && response.data.data && response.data.data.token) {
    localStorage.setItem('token', response.data.data.token);
  }
  return response.data;
};

export const getCurrentUser = async () => {
  if (USE_MOCK_DATA) {
    await delay(300); // Simulate network delay
    return { success: true, data: mockUser };
  }
  
  const response = await api.get('/auth/me');
  return response.data;
};

// Payments API
export const createPayment = async (paymentData: any) => {
  if (USE_MOCK_DATA) {
    await delay(800); // Simulate network delay
    return { 
      success: true, 
      message: 'Payment created successfully', 
      data: { 
        collectRequestId: `mock-${Date.now()}`,
        status: 'pending'
      } 
    };
  }
  
  const response = await api.post('/payments/create-payment', paymentData);
  return response.data;
};

export const checkPaymentStatus = async (collectRequestId: string) => {
  if (USE_MOCK_DATA) {
    await delay(500); // Simulate network delay
    return { 
      success: true, 
      data: { 
        status: Math.random() > 0.3 ? 'success' : 'pending',
        collectRequestId
      } 
    };
  }
  
  const response = await api.get(`/payments/status/${collectRequestId}`);
  return response.data;
};

// Transactions API
export const getTransactions = async (filters: Partial<TransactionFilters> = {}): Promise<ApiResponse<Transaction[]>> => {
  if (USE_MOCK_DATA) {
    await delay(700); // Simulate network delay
    
    // Apply filters to mock data
    let filteredTransactions = [...mockTransactions];
    
    // Filter by status
    if (filters.status && filters.status.length > 0) {
      filteredTransactions = filteredTransactions.filter(tx => 
        filters.status?.includes(tx.status)
      );
    }
    
    // Filter by school_ids
    if (filters.school_ids && filters.school_ids.length > 0) {
      filteredTransactions = filteredTransactions.filter(tx => 
        filters.school_ids?.includes(tx.school_id)
      );
    }
    
    // Filter by date range
    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      filteredTransactions = filteredTransactions.filter(tx => 
        new Date(tx.payment_time) >= startDate
      );
    }
    
    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      filteredTransactions = filteredTransactions.filter(tx => 
        new Date(tx.payment_time) <= endDate
      );
    }
    
    // Apply sorting
    const sort = filters.sort || 'payment_time';
    const order = filters.order || 'desc';
    
    filteredTransactions.sort((a: any, b: any) => {
      if (order === 'asc') {
        return a[sort] > b[sort] ? 1 : -1;
      } else {
        return a[sort] < b[sort] ? 1 : -1;
      }
    });
    
    // Apply pagination
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);
    
    return {
      success: true,
      data: paginatedTransactions,
      meta: {
        total: filteredTransactions.length,
        page,
        limit,
        totalPages: Math.ceil(filteredTransactions.length / limit)
      }
    };
  }
  
  const {
    status,
    school_ids,
    startDate,
    endDate,
    page = 1,
    limit = 10,
    sort = 'payment_time',
    order = 'desc'
  } = filters;
  
  const queryParams = new URLSearchParams();
  queryParams.append('page', page.toString());
  queryParams.append('limit', limit.toString());
  queryParams.append('sort', sort);
  queryParams.append('order', order);
  
  if (status && status.length > 0) {
    status.forEach(s => queryParams.append('status', s));
  }
  
  if (school_ids && school_ids.length > 0) {
    school_ids.forEach(id => queryParams.append('school_id', id));
  }
  
  if (startDate) {
    queryParams.append('startDate', startDate.toISOString());
  }
  
  if (endDate) {
    queryParams.append('endDate', endDate.toISOString());
  }
  
  const response = await api.get(`/transactions?${queryParams.toString()}`);
  return response.data;
};

// Get transactions by school
export const getTransactionsBySchool = async (schoolId: string, options: { page?: number, limit?: number, sort?: string, order?: 'asc' | 'desc' } = {}) => {
  // Build query parameters
  const queryParams = new URLSearchParams();
  if (options.page) queryParams.append('page', options.page.toString());
  if (options.limit) queryParams.append('limit', options.limit.toString());
  if (options.sort) queryParams.append('sort', options.sort);
  if (options.order) queryParams.append('order', options.order);
  
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
  
  if (USE_MOCK_DATA) {
    await delay(600); // Simulate network delay
    
    // Filter transactions for this school
    let schoolTransactions = mockTransactions.filter(tx => tx.school_id === schoolId);
    
    // Apply sorting if specified
    if (options.sort) {
      const sortField = options.sort as keyof typeof schoolTransactions[0];
      const sortOrder = options.order || 'asc';
      
      schoolTransactions = [...schoolTransactions].sort((a, b) => {
        if (a[sortField] < b[sortField]) return sortOrder === 'asc' ? -1 : 1;
        if (a[sortField] > b[sortField]) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    // Apply pagination
    const page = options.page || 1;
    const limit = options.limit || 10;
    const startIndex = (page - 1) * limit;
    const paginatedTransactions = schoolTransactions.slice(startIndex, startIndex + limit);
    
    return {
      transactions: paginatedTransactions,
      pagination: {
        total: schoolTransactions.length,
        page: page,
        limit: limit
      },
      sorting: {
        field: options.sort || 'payment_time',
        order: options.order || 'desc'
      }
    };
  }
  
  const response = await api.get(`/transactions/school/${schoolId}${queryString}`);
  return response.data;
};

// Get all transactions with pagination and sorting
export const getAllTransactions = async (options: { page?: number, limit?: number, sort?: string, order?: 'asc' | 'desc' } = {}) => {
  // Build query parameters
  const queryParams = new URLSearchParams();
  if (options.page) queryParams.append('page', options.page.toString());
  if (options.limit) queryParams.append('limit', options.limit.toString());
  if (options.sort) queryParams.append('sort', options.sort);
  if (options.order) queryParams.append('order', options.order);
  
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
  const response = await api.get(`/transactions${queryString}`);
  return response.data;
};

// Check transaction status
export const checkTransactionStatus = async (customOrderId: string): Promise<ApiResponse<Transaction> | Transaction> => {
  if (USE_MOCK_DATA) {
    await delay(400); // Simulate network delay
    
    // Find the transaction with this ID
    const transaction = mockTransactions.find(tx => tx.custom_order_id === customOrderId);
    
    if (transaction) {
      return {
        success: true,
        data: transaction
      };
    } else {
      return {
        success: false,
        message: 'Transaction not found',
        data: null as any
      };
    }
  }
  
  console.error("Checking transaction status for:", customOrderId);
  try {
    const response = await api.get(`/transactions/status/${customOrderId}`);
    console.error("Transaction status response:", response.data);
    
    // Check if the response is already in the expected format or needs to be wrapped
    if (response.data && typeof response.data === 'object') {
      // If it's already an ApiResponse with success property, return as is
      if ('success' in response.data) {
        return response.data;
      }
      
      // If it's a direct transaction object, return it as is
      if ('status' in response.data && 'transaction_amount' in response.data) {
        return response.data;
      }
      
      // Otherwise, wrap it in an ApiResponse
      return {
        success: true,
        data: response.data
      };
    }
    
    return response.data;
  } catch (error) {
    console.error("Error in checkTransactionStatus:", error);
    throw error;
  }
};

// Get all schools (for dropdown)
export const getSchools = async () => {
  if (USE_MOCK_DATA) {
    await delay(300); // Simulate network delay
    return {
      success: true,
      data: mockSchools
    };
  }
  
  const response = await api.get('/schools');
  return response.data;
};

// Logout function to clear token
export const logout = () => {
  localStorage.removeItem('token');
  window.location.href = '/sign-in';
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

export default api;
