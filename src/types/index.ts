export interface Transaction {
  _id?: string;
  collect_id: string;
  school_id: string;
  gateway: string;
  order_amount: number;
  transaction_amount: number;
  status: string;
  custom_order_id: string;
  payment_time?: string;
  payment_mode?: string;
  payment_details?: string;
}

export interface School {
  _id: string;
  name: string;
}

export interface TransactionFilters {
  status: string[];
  school_ids: string[];
  startDate: Date | null;
  endDate: Date | null;
  page: number;
  limit: number;
  sort: string;
  order: 'asc' | 'desc';
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success?: boolean;
  data: T;
  meta?: PaginationMeta;
  message?: string;
}

export interface User {
  email: string;
  role: 'school' | 'admin';
  schoolId?: string;
  password: string;
}
