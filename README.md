# MoonHaul Web Project

MoonHaul is a modern e-commerce web application specifically designed for K-Pop merchandise pre-orders. Built using a robust React (Vite) frontend and an Express.js backend powered by Prisma ORM and MySQL, it incorporates premium Korean Modern Aesthetics, responsive layouts, role-based authorization, payment proof uploads, order tracking, and comprehensive sales reports.

---

## Tech Stack

- **Frontend**:
  - React (Vite)
  - Tailwind CSS
  - React Router DOM
  - Axios (with global HTTP 401 Session Expiry Interceptor)
  - Heroicons
- **Backend**:
  - Node.js & Express.js
  - Prisma ORM & MySQL
  - JSON Web Tokens (JWT) for secure authentication
  - Multer for local file storage uploads
  - Bcrypt for secure password hashing

---

## Core Features

### 🛍️ Customer Portal
1. **Authentication**: Secure registration and login with real-time field validations.
2. **Merchandise Catalog**: Search products by name, filter by categories, and view merchandise details.
3. **Cart & Checkout**: Interactive shopping cart (increase/decrease item quantities, clear cart, automated subtotal calculations) and standard checkout process.
4. **Order History & Timeline**: Clear order records with chronological timeline tracking order statuses.
5. **Payment Upload**: Manual receipt image upload to verify pre-order payments.
6. **Dashboard & Profile**: Responsive dashboard summary stats, profile details updater, and password changer.

### 🛡️ Admin Portal
1. **Dashboard Overview**: Statistical aggregates (Total Revenue, Customer counts, Categories, Merchandise counts, and Payment Verification queues).
2. **Category Management**: Create, edit, search, and delete pre-order categories.
3. **Merchandise Management**: Create, update, search, and delete catalog products.
4. **Order Management**: Adjust delivery logistics status tracking (WAITING_PAYMENT, PAYMENT_VERIFICATION, PROCESSING, PACKED, SHIPPED, DELIVERED, CANCELLED).
5. **Payment Verification**: Verify or decline uploaded customer transfer proofs with custom note logs.
6. **Customer Directory**: View customer registrations, order volumes, total spent, and link directly to customer orders.
7. **Sales Reports**: Detailed financial summaries, monthly revenue lists, top-5 best selling merchandise ranks, and recent invoice transaction lists.

---

## Directory Structure

```text
moonhaul-web-project/
├── backend/
│   ├── controllers/       # Route request handlers
│   ├── middlewares/       # JWT auth & multer uploads
│   ├── prisma/            # DB Schema & migrations
│   ├── routes/            # Express endpoint maps
│   ├── uploads/           # Uploaded payment receipt storage
│   ├── utils/             # Prisma client instances
│   ├── index.js           # Server boot entry
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/    # Reusable UI widgets (cards, forms, sidebars)
    │   ├── contexts/      # React Auth Context API
    │   ├── layouts/       # Nested layout wrappers (Customer, Admin)
    │   ├── pages/         # View templates
    │   ├── services/      # Axios API request clients
    │   ├── routes/        # App routing definitions
    │   ├── App.jsx        # Root component
    │   └── main.jsx
    └── package.json
```

---

## Installation & Setup

### Database Configuration

1. Create a MySQL database named `moonhaul` in your local MySQL instance.
2. Configure database credentials in `backend/.env`.

### 1. Backend Setup

```bash
cd backend
npm install
```

Configure `backend/.env` environment variables:
```env
PORT=5000
DATABASE_URL="mysql://username:password@localhost:3306/moonhaul"
JWT_SECRET="your_secure_jwt_secret_key"
```

Apply database migrations:
```bash
npx prisma migrate dev
```

Seed default database accounts:
```bash
npm run seed
```

Start the backend server:
```bash
npm run dev
```

---

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Configure `frontend/.env` environment variables:
```env
VITE_API_URL="http://localhost:5000/api"
```

Start the Vite development server:
```bash
npm run dev
```

---

## Dummy Accounts

Use these accounts to test both Customer and Admin portals during review and presentation:

| Role | Email | Password |
|---|---|---|
| **ADMIN** | `admin@moonhaul.com` | `admin123` |
| **CUSTOMER** | `customer@moonhaul.com` | `customer123` |

---

## Core REST Endpoints

### 🔑 Authentication
- `POST /api/auth/register` - Create customer accounts.
- `POST /api/auth/login` - Authenticate accounts and retrieve JWT.
- `PUT /api/auth/profile` - Update full name or change account password.

### 📦 Customer Catalogs
- `GET /api/categories` - Fetch all category options.
- `GET /api/products` - Filter or search catalog products.
- `GET /api/products/:id` - Retrieve product details.

### 🛒 Shopping Cart & Checkout
- `GET /api/cart` - View items currently in cart.
- `POST /api/cart/items` - Add product items to cart.
- `PUT /api/cart/items/:id` - Change quantities of cart items.
- `DELETE /api/cart/items/:id` - Delete cart items.
- `DELETE /api/cart/clear` - Clear cart items.
- `POST /api/checkout` - Submit pre-order checkout.

### 💳 Payments & Orders
- `POST /api/payments/upload` - Upload payment transfer proof.
- `GET /api/payments/my` - Fetch client payment history logs.
- `GET /api/orders` - View list of customer order history.
- `GET /api/orders/:id` - View order detail progress timeline.

### 🛡️ Admin Controls
- `GET /api/admin/orders` - View all database orders.
- `PUT /api/admin/orders/:id/status` - Change order statuses.
- `GET /api/payments` - Retrieve all payment verify logs.
- `PUT /api/payments/:id/approve` - Approve pre-order payment.
- `PUT /api/payments/:id/reject` - Reject pre-order payment.
- `GET /api/admin/customers` - View customer registry directory.
- `GET /api/admin/sales-report` - Aggregate billing and sales spreadsheets.
- `GET /api/dashboard/admin` - Fetch admin statistics panels.