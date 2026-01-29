# E-Commerce Login Debugging Guide

## ✅ Recent Fixes Applied

The following issues have been identified and fixed:

### 1. **Auth Middleware Typo (CRITICAL FIX)**
- **Issue**: Line 11 in `middleware/auth.js` had `[[1]]` instead of `[1]`
- **Impact**: Token extraction was failing, causing authentication errors
- **Status**: ✅ FIXED

### 2. **Improved Error Messages**
- **Frontend**: Enhanced `AuthContext.tsx` with detailed error handling
- **Backend**: Added comprehensive logging for login/register endpoints
- **Status**: ✅ FIXED

### 3. **CORS Configuration**
- **Backend**: Configured to accept requests from `http://localhost:3000` (or assigned port)
- **Status**: ✅ CONFIGURED

---

## 🧪 Test Credentials

Use these pre-seeded test accounts to verify login:

### Admin Account
```
Email: admin@ecommerce.com
Password: admin123
Mobile: 9876543210
```

### Regular User Account
```
Email: john@example.com
Password: user123
Mobile: 9876543211
```

### Create New Test Account
```
Email: test@example.com
Password: TestPass123
Mobile: 9000000000
```

---

## 🔍 Troubleshooting Steps

### **Problem 1: Login shows "Network error - is the backend server running on port 5001?"**

**Solution:**
1. Check backend is running: Look for `🚀 Server is running on http://localhost:5001` in terminal
2. Verify port 5001 is correct in `.env` file: `PORT=5001`
3. Verify frontend API URL: `REACT_APP_API_URL=http://localhost:5001/api` in `client/.env`

### **Problem 2: "Invalid email or password" error**

**Solution:**
1. **Check email spelling** - Email is case-sensitive in some cases
2. **Verify password**:
   - Use test accounts above (case-sensitive)
   - Password requires: at least 6 characters
3. **Check if user exists**:
   - Register a new account first if needed
   - Or use one of the test accounts above
4. **Check database connection**:
   ```
   Look for: "✅ MongoDB Connected: localhost" in backend terminal
   ```

### **Problem 3: "Email already registered" or "Mobile number already registered"**

**Solution:**
- Use a different email/mobile number
- Or seed the database fresh:
  ```bash
  node seed.js
  ```
  This will reset all data with fresh test users.

### **Problem 4: "Account is deactivated"**

**Solution:**
- The user account exists but is inactive
- Contact admin to reactivate the account
- Or register a new account

---

## 📊 How to Check Backend Logs

The backend logs important information:

```
[LOGIN] Attempting login for email: john@example.com
[LOGIN] Login successful for email: john@example.com
[REGISTER] Attempting registration for email: test@example.com
[REGISTER] Registration successful for email: test@example.com
```

**To see logs:**
1. Look in the backend terminal (where `npm run dev` is running)
2. Errors start with `[LOGIN]` or `[REGISTER]`

---

## 🌐 How to Check Frontend Logs

**Open Browser Developer Tools:**

**Chrome/Edge:**
1. Press `F12` or `Ctrl+Shift+I`
2. Go to **Console** tab
3. Look for messages starting with:
   - `"Starting login process..."`
   - `"Login successful!"`
   - `"Login failed: ..."`

**Check Console Output:**
```javascript
API_URL: http://localhost:5001/api
Starting login process...
```

---

## 🔧 Configuration Files to Verify

### Backend `.env` (root folder)
```
PORT=5001
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=ecommerce_super_secret_jwt_key_2026_production
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

### Frontend `.env` (client folder)
```
REACT_APP_API_URL=http://localhost:5001/api
REACT_APP_ENV=development
```

---

## 📱 API Endpoints Reference

| Endpoint | Method | Purpose | Requires Auth |
|----------|--------|---------|-------|
| `/api/auth/login` | POST | User login | No |
| `/api/auth/register` | POST | User registration | No |
| `/api/auth/profile` | GET | Get user profile | Yes |
| `/api/auth/profile` | PUT | Update user profile | Yes |

### Login Request Format
```json
{
  "email": "john@example.com",
  "password": "user123"
}
```

### Login Success Response
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "mobile": "9876543211",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

## 🚀 Quick Restart Steps

If login still not working:

1. **Stop everything** (Ctrl+C in all terminals)
2. **Clear any stale processes**:
   ```powershell
   powershell -ExecutionPolicy Bypass -Command "Stop-Process -Name 'node' -Force -ErrorAction SilentlyContinue"
   ```
3. **Restart backend**:
   ```powershell
   cd "c:\Users\Sailaja Narada\e-commese"
   npm run dev
   ```
4. **Restart frontend** (in new terminal):
   ```powershell
   cd "c:\Users\Sailaja Narada\e-commese\client"
   npm start
   ```
5. **Try login with test credentials**

---

## 📝 Common Password Requirements

Frontend validation requires:
- **At least 6 characters**
- **At least 1 uppercase letter** (A-Z)
- **At least 1 lowercase letter** (a-z)
- **At least 1 number** (0-9)

Example valid passwords:
- ✅ `Admin123`
- ✅ `Password1`
- ✅ `Test@Pass123`

Example invalid passwords:
- ❌ `pass123` (no uppercase)
- ❌ `Password` (no number)
- ❌ `12345` (no letters)

---

## 🆘 If Nothing Works

1. **Check Node.js version**:
   ```powershell
   node --version
   ```
   Should be v14 or higher

2. **Check MongoDB is running**:
   ```powershell
   mongo
   ```
   Should connect successfully

3. **Clear npm cache**:
   ```powershell
   npm cache clean --force
   ```

4. **Reinstall dependencies**:
   ```powershell
   cd "c:\Users\Sailaja Narada\e-commese"
   rm -r node_modules package-lock.json
   npm install
   
   cd client
   rm -r node_modules package-lock.json
   npm install
   ```

5. **Reseed database**:
   ```powershell
   cd "c:\Users\Sailaja Narada\e-commese"
   node seed.js
   ```

---

## ✨ Summary of Fixes

| Issue | Fix | Status |
|-------|-----|--------|
| Token extraction syntax error | Changed `[[1]]` to `[1]` in auth middleware | ✅ Fixed |
| Poor error messages | Added detailed error handling in frontend/backend | ✅ Fixed |
| Missing logging | Added console logs for login/register attempts | ✅ Fixed |
| CORS issues | Verified CORS configuration | ✅ Verified |
| Missing test data | Confirmed test users in seed.js | ✅ Available |

---

## 📧 Next Steps

1. Try logging in with test credentials above
2. Check browser console (F12) for detailed error messages
3. Check backend terminal for `[LOGIN]` logs
4. Follow troubleshooting steps above
5. If issues persist, check the specific error message in this guide

**Happy debugging! 🎉**
