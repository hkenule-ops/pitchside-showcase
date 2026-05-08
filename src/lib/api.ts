// Google Apps Script API client for ATYRAU OIL REFINERY ANPZ LLP
import {
  Candle, StockQuote, User, Transaction, Withdrawal, Dividend, Announcement, AdminLog,
} from "./types";
import { generateCandles, mockTicker, mockAnnouncements } from "./mock";

const API_KEY = "anpz_api_url";
const TOKEN_KEY = "anpz_token";
const USER_KEY = "anpz_user";

export const getApiUrl = () => localStorage.getItem(API_KEY) || "";
export const setApiUrl = (url: string) => localStorage.setItem(API_KEY, url.trim());
export const isApiConfigured = () => !!getApiUrl();
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const getStoredUser = (): User | null => {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? (JSON.parse(raw) as User) : null;
};
const setSession = (token: string, user: User) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};
export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

async function apiGet<T>(action: string, params: Record<string, string> = {}): Promise<T> {
  const url = getApiUrl();
  if (!url) throw new Error("API_NOT_CONFIGURED");
  const qs = new URLSearchParams({ action, ...params }).toString();
  const res = await fetch(`${url}?${qs}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error || "API error");
  return json.data as T;
}

async function apiPost<T>(body: Record<string, unknown>): Promise<T> {
  const url = getApiUrl();
  if (!url) throw new Error("API_NOT_CONFIGURED");
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify({ ...body, token: getToken() }),
  });
  const json = await res.json();
  if (!json.success && json.error) throw new Error(json.error);
  return json as T;
}

// Public — fall back to mock if backend not configured
export async function fetchCandles(symbol = "ANPZ"): Promise<Candle[]> {
  try { return await apiGet<Candle[]>("getCandlestickData", { symbol }); }
  catch { return generateCandles(220, 142.5, symbol.length + 7); }
}

export async function fetchStockPrices(): Promise<StockQuote[]> {
  try { return await apiGet<StockQuote[]>("getStockPrices"); }
  catch { return mockTicker; }
}

export async function fetchAnnouncements(): Promise<Announcement[]> {
  try { return await apiGet<Announcement[]>("getAnnouncements"); }
  catch { return mockAnnouncements; }
}

// Auth
export async function login(email: string, password: string): Promise<User> {
  const res = await apiPost<{ success: boolean; token: string; user: User }>({
    action: "login", email, password,
  });
  setSession(res.token, res.user);
  return res.user;
}

export async function register(name: string, email: string, password: string): Promise<User> {
  const res = await apiPost<{ success: boolean; token: string; user: User }>({
    action: "register", name, email, password,
  });
  setSession(res.token, res.user);
  return res.user;
}

export async function logout(): Promise<void> {
  try { await apiPost({ action: "logout" }); } catch { /* ignore */ }
  clearSession();
}

// Investor
export const fetchPortfolio = () => apiGet<User>("getPortfolio");
export const fetchTransactions = () => apiGet<Transaction[]>("getTransactions");
export const fetchDividends = () => apiGet<Dividend[]>("getDividends");
export const requestWithdrawal = (amount: number, method: string) =>
  apiPost({ action: "requestWithdrawal", amount, method });
export const placeOrder = (side: "buy" | "sell", amount: number, price: number) =>
  apiPost({ action: "placeOrder", side, amount, price });

// Admin
export const adminGetUsers = () => apiGet<User[]>("getAllUsers");
export const adminGetWithdrawals = () => apiGet<Withdrawal[]>("getAllWithdrawals");
export const adminGetLogs = () => apiGet<AdminLog[]>("getAdminLogs");
export const adminAdjustBalance = (userId: string, delta: number, note: string) =>
  apiPost({ action: "adjustBalance", userId, delta, note });
export const adminEditPortfolio = (userId: string, fields: Partial<User>) =>
  apiPost({ action: "editPortfolio", userId, fields });
export const adminApproveWithdrawal = (id: string) =>
  apiPost({ action: "approveWithdrawal", id });
export const adminRejectWithdrawal = (id: string) =>
  apiPost({ action: "rejectWithdrawal", id });
export const adminCreateTransaction = (userId: string, type: string, amount: number, note: string) =>
  apiPost({ action: "createTransaction", userId, type, amount, note });
export const adminFreeze = (userId: string, frozen: boolean) =>
  apiPost({ action: frozen ? "freezeAccount" : "unfreezeAccount", userId });
export const adminPushCandle = (symbol: string, candle: Candle) =>
  apiPost({ action: "pushCandle", symbol, candle });
export const adminSimulateMarket = (symbol: string, direction: "up" | "down", magnitude: number) =>
  apiPost({ action: "simulateMarket", symbol, direction, magnitude });
export const adminSetDividend = (userId: string, amount: number, period: string) =>
  apiPost({ action: "setDividend", userId, amount, period });
export const adminSetAnnouncement = (data: Partial<Announcement>) =>
  apiPost({ action: "setAnnouncement", data });
