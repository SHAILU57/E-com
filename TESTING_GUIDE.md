# Local Testing Guide

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (Local or Atlas)
- npm or yarn

## Setup Instructions

### 1. Backend Setup

```bash
cd f:\Sailu_Project\E-com

# Install dependencies
npm install

# Create .env file from template
copy .env.example .env

# Edit .env with your MongoDB connection
# For Local: mongodb://localhost:27017/ecommerce
# For Atlas: mongodb+srv://username:password@cluster.mongodb.net/ecommerce
```

### 2. Frontend Setup

```bash
cd client

# Install dependencies
npm install

# Create .env file
copy .env.example .env

# Keep REACT_APP_API_URL=http://localhost:5000/api
```

### 3. MongoDB Setup

**Option A: Local MongoDB**
```powershell
# Windows - Start MongoDB Service
net start MongoDB

# Or if using standalone:
# Run mongod.exe from MongoDB installation directory
```

**Option B: MongoDB Atlas (Cloud)**
- Go to https://www.mongodb.com/cloud/atlas
- Create free account and cluster
- Get connection string and update .env

### 4. Start Servers

**Terminal 1 - Backend:**
```bash
cd f:\Sailu_Project\E-com
npm run dev
# Expected: 🚀 Server is running on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd f:\Sailu_Project\E-com\client
npm start
# Expected: Opens http://localhost:3000
```

## Testing Workflow

### Step 1: Test Registration
1. Navigate to http://localhost:3000/register
2. Fill in form:
   - Name: Test User
   - Email: test@example.com
   - Mobile: 9876543210
   - Password: Test@123456 (must have uppercase, lowercase, number)
3. Click Register
4. **Verify:** User appears in MongoDB > ecommerce > users collection

### Step 2: Test Login
1. Navigate to http://localhost:3000/login
2. Enter credentials from Step 1
3. Click Login
4. **Verify:** Redirected to home page, token stored in localStorage

### Step 3: Test Address Management
1. Click Profile in navbar
2. Add Address:
   - Name: Home
   - Mobile: 9876543210
   - Address: 123 Main Street
   - City: San Francisco
   - State: California
   - Pincode: 410123
3. **Verify:** Address appears in profile

### Step 4: Test Products
1. Go to Products page
2. **Verify:** Products load (uses featured products from home)
3. Filter by:
   - Category
   - Price range
   - Search bar
4. Click product to view details

### Step 5: Test Cart Operations
1. From product list or detail, click "Add to Cart"
2. Go to Cart page
3. **Verify:** Product appears with:
   - Correct name and image
   - Quantity controls
   - Total amount updated
4. Test:
   - Increase/decrease quantity
   - Remove item
   - Clear cart

### Step 6: Test Order Creation
1. Add product to cart
2. Click "Checkout"
3. Select or add shipping address
4. Select payment method:
   - Cash on Delivery (COD)
   - Card
   - UPI
   - Wallet
5. Click "Place Order"
6. **Verify:**
   - Order created with unique order number (ORD...)
   - Cart cleared
   - Stock decremented
   - Pricing correct:
     - Subtotal calculated
     - Shipping: Free if >500, else ₹40
     - Tax: 18%
     - Total = Subtotal + Shipping + Tax

### Step 7: Test Order History
1. Click "Orders" in navbar
2. **Verify:** Order appears with:
   - Order number
   - Total amount
   - Date/time
   - Status (pending)

## API Testing with curl/Postman

### Register
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "mobile": "9876543210",
  "password": "Test@123456"
}
```

### Login
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Test@123456"
}
```

### Add to Cart
```bash
POST http://localhost:5000/api/cart/add
Authorization: Bearer <token_from_login>
Content-Type: application/json

{
  "productId": "product_id_here",
  "quantity": 1
}
```

### Create Order
```bash
POST http://localhost:5000/api/orders
Authorization: Bearer <token_from_login>
Content-Type: application/json

{
  "shippingAddressId": "address_id_from_profile",
  "paymentMethod": "cod"
}
```

Or with direct address:
```bash
{
  "shippingAddress": {
    "name": "Home",
    "mobile": "9876543210",
    "address": "123 Main St",
    "city": "San Francisco",
    "state": "California",
    "pincode": "410123"
  },
  "paymentMethod": "cod"
}
```

## Debugging

### Backend Issues
- Check console in Terminal 1
- Verify MongoDB connection: `npm run dev` should show ✅ MongoDB Connected
- Check network tab in browser DevTools

### Frontend Issues
- Check browser console (F12)
- Check REACT_APP_API_URL in .env matches backend PORT
- Clear localStorage: `localStorage.clear()` in console

### Database Issues
- Verify MongoDB is running
- Check connection string in .env
- View collections: `db.getCollectionNames()`

## All Fixes Applied ✅

1. ✅ Added database indexes on Order, Product, and Cart models
2. ✅ Fixed cart response to include updated totalAmount
3. ✅ Enhanced order creation with address lookup by ID
4. ✅ Added User import to orders.js for address validation
5. ✅ Improved payment status logic
6. ✅ Added field validation for order creation
