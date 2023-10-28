export interface PaymentResponse {
  payments: Payment[];
  total: number;
  totalPages: number;
}

export interface Payment {
  id: string;
  paymentRefId: string;
  date: string;
  amount: number;
  currency: string;
  thirdParty: string;
  customer: Customer;
}

export interface UserResponse {
  user: User;
}

interface User {
  id: string;
  username: string;
  active: boolean;
  customers: Customer[];
}

export interface Customer {
  id: string;
  companyName: string;
  country: string;
  active: boolean;
  businessSegment: string | null;
}
