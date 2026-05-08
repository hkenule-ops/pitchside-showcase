export interface User {
  id: string;
  email: string;
  name: string;
  role: "investor" | "admin";
  status: "active" | "frozen" | "suspended";
  balance: number;
  shares: number;
  portfolioValue: number;
  profitLoss: number;
  createdAt: string;
}

export interface Candle {
  time: number; // unix seconds
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePct: number;
}

export interface Transaction {
  id: string;
  userId: string;
  type: "deposit" | "withdraw" | "dividend" | "buy" | "sell" | "admin_adjust";
  amount: number;
  status: "completed" | "pending" | "rejected";
  timestamp: string;
  note?: string;
}

export interface Withdrawal {
  id: string;
  userId: string;
  userName?: string;
  amount: number;
  method: string;
  status: "pending" | "approved" | "rejected";
  requestedAt: string;
  processedAt?: string;
}

export interface Dividend {
  id: string;
  userId: string;
  amount: number;
  period: string;
  status: "scheduled" | "paid";
  paidAt?: string;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  date: string;
  pinned: boolean;
}

export interface AdminLog {
  id: string;
  adminUser: string;
  action: string;
  targetId: string;
  before: string;
  after: string;
  timestamp: string;
}
