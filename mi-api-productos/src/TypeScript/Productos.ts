

export interface Product {
  id: number;
  name: string;
  price: number;
  inStock: boolean;
}

export interface ProductInput {
  name: string;
  price: number;
  inStock?: boolean; 
}


export interface OrderItem {
  productId: number;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: number;
  userId: number;
  status: string;       
  total: number;
  createdAt: string;    
  items: OrderItem[];  
}

export interface OrderInput {
  items: { productId: number; quantity: number; unitPrice?: number }[];
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;    
  password: string;
}

export interface UserInput {
  email: string;
  password: string;
  name: string;
  role: string;
}

export interface Payment {
  id: number;
  userId: number;
  orderId: number;
  transactionId: string;
  status: string;   
  amount: number;
}


export interface PaymentInput {
  orderId: number;
  paymentMethod: string; 
}

export interface Shipping {
  id: number;
  orderId: number;
  productId: number;
  productName: string;  
  userName: string;    
  direccion: string;   
  telefono: string;   
  referencia: string;   
  empresa: string;      
  guia: string;         
  fechaEstimada: string;
  status: string;       
}
