// ============================================================
// GOOGLE APPS SCRIPT — ATYRAU OIL REFINERY ANPZ LLP
// Backend for the energy investment platform
// ============================================================
// SETUP:
// 1) script.google.com → New Project. Paste this entire file.
// 2) Create a Google Sheet with these tabs (exact names + headers):
//
//    Users:          id | email | passwordHash | name | role | status | balance | shares | portfolioValue | profitLoss | createdAt
//    Investments:    id | userId | package | shares | amount | startDate | status
//    Transactions:   id | userId | type | amount | status | timestamp | note
//    Stock_Prices:   symbol | name | price | change | changePct | updatedAt
//    Candlestick_Data: symbol | time | open | high | low | close | volume
//    Dividends:      id | userId | amount | period | status | paidAt
//    Withdrawals:    id | userId | userName | amount | method | status | requestedAt | processedAt
//    Admin_Logs:     id | adminUser | action | targetId | before | after | timestamp
//    Announcements:  id | title | body | date | pinned
//
// 3) Seed initial data:
//    Users: add a row with role=admin, status=active, password=admin123 (HASH it: see hashPassword() below)
//    Stock_Prices: ANPZ | Atyrau Refinery | 142.85 | 3.42 | 2.45 | (now)
//    Candlestick_Data: leave empty (auto-seeds on first read), or run seedCandles() once.
//
// 4) Replace SPREADSHEET_ID below with your sheet ID (from URL).
//
// 5) Deploy → New Deployment → Web App
//      Execute as: Me
//      Who has access: Anyone
//    Copy the URL and paste it in the app's Admin → Settings tab.
// ============================================================

const SPREADSHEET_ID = "YOUR_SPREADSHEET_ID_HERE";
const ADMIN_BOOTSTRAP_PASSWORD = "admin123"; // change after first login!

// ---------- Helpers ----------
function ss() { return SpreadsheetApp.openById(SPREADSHEET_ID); }
function sheet(name) { return ss().getSheetByName(name); }
function jsonOut(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
function uuid() { return Utilities.getUuid(); }
function nowIso() { return new Date().toISOString(); }
function hashPassword(pw) {
  var raw = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, "anpz_salt_" + pw);
  return raw.map(function(b){ return ("0" + (b & 0xFF).toString(16)).slice(-2); }).join("");
}
function getRows(name) {
  var sh = sheet(name); if (!sh) return [];
  var data = sh.getDataRange().getValues();
  if (data.length < 2) return [];
  var headers = data[0];
  return data.slice(1).map(function(row) {
    var o = {};
    headers.forEach(function(h, i) { o[h] = row[i]; });
    return o;
  });
}
function appendRow(name, obj) {
  var sh = sheet(name);
  var headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
  sh.appendRow(headers.map(function(h){ return obj[h] === undefined ? "" : obj[h]; }));
}
function updateRowById(name, id, patch) {
  var sh = sheet(name);
  var data = sh.getDataRange().getValues();
  var headers = data[0];
  var idCol = headers.indexOf("id");
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][idCol]) === String(id)) {
      var before = {};
      Object.keys(patch).forEach(function(k){
        var col = headers.indexOf(k);
        if (col >= 0) {
          before[k] = data[i][col];
          sh.getRange(i + 1, col + 1).setValue(patch[k]);
        }
      });
      return before;
    }
  }
  return null;
}
function logAdmin(adminUser, action, targetId, before, after) {
  appendRow("Admin_Logs", {
    id: uuid(), adminUser: adminUser, action: action, targetId: targetId,
    before: typeof before === "string" ? before : JSON.stringify(before),
    after: typeof after === "string" ? after : JSON.stringify(after),
    timestamp: nowIso()
  });
}

// ---------- Auth / Sessions ----------
function createSession(user) {
  var token = uuid();
  var props = PropertiesService.getScriptProperties();
  props.setProperty("session_" + token, JSON.stringify({
    userId: user.id, email: user.email, role: user.role, created: nowIso()
  }));
  return token;
}
function getSession(token) {
  if (!token) return null;
  var raw = PropertiesService.getScriptProperties().getProperty("session_" + token);
  return raw ? JSON.parse(raw) : null;
}
function requireAuth(token) {
  var s = getSession(token); if (!s) throw new Error("Unauthorized");
  return s;
}
function requireAdmin(token) {
  var s = requireAuth(token);
  if (s.role !== "admin") throw new Error("Admin only");
  return s;
}
function findUserByEmail(email) {
  return getRows("Users").find(function(u){ return String(u.email).toLowerCase() === String(email).toLowerCase(); });
}
function findUserById(id) {
  return getRows("Users").find(function(u){ return String(u.id) === String(id); });
}
function publicUser(u) {
  return {
    id: String(u.id), email: u.email, name: u.name, role: u.role || "investor",
    status: u.status || "active",
    balance: Number(u.balance) || 0, shares: Number(u.shares) || 0,
    portfolioValue: Number(u.portfolioValue) || 0, profitLoss: Number(u.profitLoss) || 0,
    createdAt: u.createdAt || nowIso()
  };
}

// ---------- Candle seeding / sim ----------
function seedCandles(symbol) {
  symbol = symbol || "ANPZ";
  var sh = sheet("Candlestick_Data");
  var existing = getRows("Candlestick_Data").filter(function(c){ return c.symbol === symbol; });
  if (existing.length > 0) return;
  var price = 120, t = Math.floor(Date.now() / 1000) - 86400 * 200;
  for (var i = 0; i < 200; i++) {
    var open = price;
    var drift = (Math.random() - 0.48) * 4;
    var close = Math.max(20, open + drift);
    var high = Math.max(open, close) + Math.random() * 1.8;
    var low = Math.min(open, close) - Math.random() * 1.8;
    var vol = Math.floor(500000 + Math.random() * 1500000);
    sh.appendRow([symbol, t, open, high, low, close, vol]);
    price = close; t += 86400;
  }
}

// ---------- doGet ----------
function doGet(e) {
  try {
    var action = e.parameter.action;
    switch (action) {
      case "getStockPrices": {
        var rows = getRows("Stock_Prices").map(function(r){
          return { symbol: r.symbol, name: r.name, price: Number(r.price), change: Number(r.change), changePct: Number(r.changePct) };
        });
        return jsonOut({ success: true, data: rows });
      }
      case "getCandlestickData": {
        var symbol = e.parameter.symbol || "ANPZ";
        seedCandles(symbol);
        var rows = getRows("Candlestick_Data").filter(function(r){ return r.symbol === symbol; }).map(function(r){
          return { time: Number(r.time), open: Number(r.open), high: Number(r.high), low: Number(r.low), close: Number(r.close), volume: Number(r.volume) };
        }).sort(function(a,b){ return a.time - b.time; });
        return jsonOut({ success: true, data: rows });
      }
      case "getAnnouncements": {
        var rows = getRows("Announcements").map(function(r){
          return { id: String(r.id), title: r.title, body: r.body, date: r.date, pinned: r.pinned === true || r.pinned === "TRUE" };
        });
        return jsonOut({ success: true, data: rows });
      }
      default: return jsonOut({ success: false, error: "Unknown GET action" });
    }
  } catch (err) {
    return jsonOut({ success: false, error: err.message });
  }
}

// ---------- doPost ----------
function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    var action = body.action;
    var token = body.token;

    // ----- Public auth -----
    if (action === "register") {
      if (findUserByEmail(body.email)) throw new Error("Email already registered");
      var u = {
        id: uuid(), email: body.email, name: body.name,
        passwordHash: hashPassword(body.password),
        role: "investor", status: "active",
        balance: 0, shares: 0, portfolioValue: 0, profitLoss: 0,
        createdAt: nowIso()
      };
      appendRow("Users", u);
      return jsonOut({ success: true, token: createSession(u), user: publicUser(u) });
    }
    if (action === "login") {
      var user = findUserByEmail(body.email);
      if (!user) throw new Error("Invalid credentials");
      // bootstrap allow plain admin password if hash blank
      var ok = (user.passwordHash && String(user.passwordHash) === hashPassword(body.password)) ||
               (!user.passwordHash && body.password === ADMIN_BOOTSTRAP_PASSWORD && user.role === "admin");
      if (!ok) throw new Error("Invalid credentials");
      if (user.status === "suspended") throw new Error("Account suspended");
      return jsonOut({ success: true, token: createSession(user), user: publicUser(user) });
    }
    if (action === "logout") {
      if (token) PropertiesService.getScriptProperties().deleteProperty("session_" + token);
      return jsonOut({ success: true });
    }

    // ----- Investor (auth) -----
    if (action === "getPortfolio") {
      var s = requireAuth(token);
      var u = findUserById(s.userId); if (!u) throw new Error("User not found");
      return jsonOut({ success: true, data: publicUser(u) });
    }
    if (action === "getTransactions") {
      var s = requireAuth(token);
      var rows = getRows("Transactions").filter(function(t){ return String(t.userId) === String(s.userId); })
        .sort(function(a,b){ return new Date(b.timestamp) - new Date(a.timestamp); });
      return jsonOut({ success: true, data: rows });
    }
    if (action === "getDividends") {
      var s = requireAuth(token);
      return jsonOut({ success: true, data: getRows("Dividends").filter(function(d){ return String(d.userId) === String(s.userId); }) });
    }
    if (action === "requestWithdrawal") {
      var s = requireAuth(token);
      var u = findUserById(s.userId);
      if (u.status !== "active") throw new Error("Account not active");
      if (Number(body.amount) > Number(u.balance)) throw new Error("Insufficient balance");
      var w = {
        id: uuid(), userId: s.userId, userName: u.name,
        amount: Number(body.amount), method: body.method || "bank",
        status: "pending", requestedAt: nowIso(), processedAt: ""
      };
      appendRow("Withdrawals", w);
      return jsonOut({ success: true, id: w.id });
    }
    if (action === "placeOrder") {
      var s = requireAuth(token);
      appendRow("Transactions", {
        id: uuid(), userId: s.userId, type: body.side,
        amount: Number(body.amount), status: "completed",
        timestamp: nowIso(), note: "Simulated " + body.side + " @ " + body.price
      });
      return jsonOut({ success: true });
    }

    // ----- Admin -----
    if (action === "getAllUsers") {
      requireAdmin(token);
      return jsonOut({ success: true, data: getRows("Users").map(publicUser) });
    }
    if (action === "getAllWithdrawals") {
      requireAdmin(token);
      return jsonOut({ success: true, data: getRows("Withdrawals") });
    }
    if (action === "getAdminLogs") {
      requireAdmin(token);
      var logs = getRows("Admin_Logs").sort(function(a,b){ return new Date(b.timestamp) - new Date(a.timestamp); });
      return jsonOut({ success: true, data: logs });
    }
    if (action === "adjustBalance") {
      var s = requireAdmin(token);
      var u = findUserById(body.userId); if (!u) throw new Error("User not found");
      var newBal = Number(u.balance) + Number(body.delta);
      updateRowById("Users", body.userId, { balance: newBal });
      appendRow("Transactions", {
        id: uuid(), userId: body.userId, type: "admin_adjust",
        amount: Number(body.delta), status: "completed",
        timestamp: nowIso(), note: body.note || "Admin balance adjustment"
      });
      logAdmin(s.email, "adjustBalance", body.userId, { balance: u.balance }, { balance: newBal });
      return jsonOut({ success: true });
    }
    if (action === "editPortfolio") {
      var s = requireAdmin(token);
      var u = findUserById(body.userId); if (!u) throw new Error("User not found");
      var allowed = ["balance", "shares", "portfolioValue", "profitLoss"];
      var patch = {}; var before = {};
      allowed.forEach(function(k){
        if (body.fields[k] !== undefined) { patch[k] = Number(body.fields[k]); before[k] = u[k]; }
      });
      updateRowById("Users", body.userId, patch);
      logAdmin(s.email, "editPortfolio", body.userId, before, patch);
      return jsonOut({ success: true });
    }
    if (action === "approveWithdrawal" || action === "rejectWithdrawal") {
      var s = requireAdmin(token);
      var status = action === "approveWithdrawal" ? "approved" : "rejected";
      var w = getRows("Withdrawals").find(function(x){ return String(x.id) === String(body.id); });
      if (!w) throw new Error("Not found");
      updateRowById("Withdrawals", body.id, { status: status, processedAt: nowIso() });
      if (status === "approved") {
        var u = findUserById(w.userId);
        var newBal = Number(u.balance) - Number(w.amount);
        updateRowById("Users", w.userId, { balance: newBal });
        appendRow("Transactions", {
          id: uuid(), userId: w.userId, type: "withdraw",
          amount: Number(w.amount), status: "completed",
          timestamp: nowIso(), note: "Withdrawal approved"
        });
      }
      logAdmin(s.email, action, body.id, w.status, status);
      return jsonOut({ success: true });
    }
    if (action === "createTransaction") {
      var s = requireAdmin(token);
      var t = { id: uuid(), userId: body.userId, type: body.type, amount: Number(body.amount), status: "completed", timestamp: nowIso(), note: body.note || "Manual" };
      appendRow("Transactions", t);
      logAdmin(s.email, "createTransaction", body.userId, "", t);
      return jsonOut({ success: true });
    }
    if (action === "freezeAccount" || action === "unfreezeAccount") {
      var s = requireAdmin(token);
      var status = action === "freezeAccount" ? "frozen" : "active";
      var u = findUserById(body.userId);
      updateRowById("Users", body.userId, { status: status });
      logAdmin(s.email, action, body.userId, u.status, status);
      return jsonOut({ success: true });
    }
    if (action === "simulateMarket") {
      var s = requireAdmin(token);
      var symbol = body.symbol || "ANPZ";
      var dir = body.direction === "down" ? -1 : 1;
      var mag = Number(body.magnitude) / 100;
      var sh = sheet("Candlestick_Data");
      var rows = getRows("Candlestick_Data").filter(function(r){ return r.symbol === symbol; })
        .sort(function(a,b){ return Number(a.time) - Number(b.time); });
      var last = rows[rows.length - 1] || { close: 100, time: Math.floor(Date.now()/1000) - 86400 };
      var open = Number(last.close);
      var close = open * (1 + dir * mag);
      var high = Math.max(open, close) * (1 + Math.random() * 0.01);
      var low = Math.min(open, close) * (1 - Math.random() * 0.01);
      var vol = Math.floor(800000 + Math.random() * 2000000);
      var t = Number(last.time) + 86400;
      sh.appendRow([symbol, t, open, high, low, close, vol]);
      // update Stock_Prices
      var spSheet = sheet("Stock_Prices");
      var sp = spSheet.getDataRange().getValues();
      for (var i = 1; i < sp.length; i++) {
        if (sp[i][0] === symbol) {
          var prev = Number(sp[i][2]);
          spSheet.getRange(i+1, 3).setValue(close);
          spSheet.getRange(i+1, 4).setValue(close - prev);
          spSheet.getRange(i+1, 5).setValue(((close - prev) / prev) * 100);
          spSheet.getRange(i+1, 6).setValue(nowIso());
          break;
        }
      }
      logAdmin(s.email, "simulateMarket", symbol, "$" + open.toFixed(2), "$" + close.toFixed(2));
      return jsonOut({ success: true });
    }
    if (action === "pushCandle") {
      var s = requireAdmin(token);
      var c = body.candle;
      sheet("Candlestick_Data").appendRow([body.symbol, c.time, c.open, c.high, c.low, c.close, c.volume]);
      logAdmin(s.email, "pushCandle", body.symbol, "", JSON.stringify(c));
      return jsonOut({ success: true });
    }
    if (action === "setDividend") {
      var s = requireAdmin(token);
      var d = { id: uuid(), userId: body.userId, amount: Number(body.amount), period: body.period, status: "paid", paidAt: nowIso() };
      appendRow("Dividends", d);
      // also credit balance
      var u = findUserById(body.userId);
      if (u) {
        updateRowById("Users", body.userId, { balance: Number(u.balance) + Number(body.amount) });
        appendRow("Transactions", {
          id: uuid(), userId: body.userId, type: "dividend",
          amount: Number(body.amount), status: "completed",
          timestamp: nowIso(), note: "Dividend " + body.period
        });
      }
      logAdmin(s.email, "setDividend", body.userId, "", d);
      return jsonOut({ success: true });
    }
    if (action === "setAnnouncement") {
      var s = requireAdmin(token);
      var a = Object.assign({ id: uuid(), pinned: false }, body.data || {});
      appendRow("Announcements", a);
      logAdmin(s.email, "setAnnouncement", a.id, "", a.title);
      return jsonOut({ success: true });
    }

    return jsonOut({ success: false, error: "Unknown POST action: " + action });
  } catch (err) {
    return jsonOut({ success: false, error: err.message });
  }
}

// ---------- Bootstrap utility (run from script editor once) ----------
function bootstrapAdmin() {
  var existing = findUserByEmail("admin@anpz.kz");
  if (existing) { Logger.log("Admin already exists"); return; }
  var u = {
    id: uuid(), email: "admin@anpz.kz", name: "ANPZ Administrator",
    passwordHash: hashPassword("admin123"),
    role: "admin", status: "active",
    balance: 0, shares: 0, portfolioValue: 0, profitLoss: 0,
    createdAt: nowIso()
  };
  appendRow("Users", u);
  // seed default stock
  if (!getRows("Stock_Prices").find(function(s){ return s.symbol === "ANPZ"; })) {
    appendRow("Stock_Prices", { symbol: "ANPZ", name: "Atyrau Refinery", price: 142.85, change: 3.42, changePct: 2.45, updatedAt: nowIso() });
  }
  seedCandles("ANPZ");
  Logger.log("Admin user created: admin@anpz.kz / admin123");
}
