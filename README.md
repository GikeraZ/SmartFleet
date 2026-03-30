# SmartFleet Pro

**SmartFleet Pro** is a comprehensive Fleet & Garage Management System designed for transport companies that manage buses for worker transportation and provide vehicle maintenance services.

## Features

### Core Modules
- **Dashboard** - Real-time overview with charts and alerts
- **Fleet Management** - Buses, Drivers, Routes, Trips
- **Contract Management** - Client contracts and invoice generation
- **Garage Management** - Vehicle service tracking, spare parts inventory
- **Financial Management** - Income, expenses, payments, reports
- **User Management** - Role-based access control

### User Roles
- **Admin** - Full system access
- **Operations Manager** - Fleet and contract management
- **Accountant** - Financial management
- **Mechanic** - Garage operations
- **Driver** - Limited access

## Technology Stack

### Backend
- Node.js & Express.js
- MySQL with Sequelize ORM
- JWT Authentication
- Role-Based Access Control (RBAC)
- PDFKit for invoice generation

### Frontend
- React.js with Vite
- TailwindCSS
- Axios for API calls
- Chart.js for analytics
- React Router

## Getting Started

### Prerequisites
- Node.js 18+
- MySQL 8.0+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
cd SmartFleet Pro
```

2. **Setup Database**
```bash
# Create MySQL database
mysql -u root -p
CREATE DATABASE smartfleet_pro;
exit;
```

3. **Setup Backend**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run dev
```

4. **Setup Frontend**
```bash
cd frontend
npm install
npm run dev
```

5. **Access the Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Default Login
- **Email:** admin@smartfleet.com
- **Password:** admin123

## Project Structure

```
SmartFleet Pro/
├── backend/
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Auth & validation middleware
│   │   ├── models/          # Sequelize models
│   │   ├── routes/          # API routes
│   │   ├── utils/           # Utilities & seeders
│   │   └── index.js          # Entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── contexts/        # React contexts
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service functions
│   │   └── App.jsx          # Main app component
│   └── package.json
│
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get current user

### Dashboard
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/dashboard/alerts` - System alerts

### Fleet Management
- `GET/POST /api/buses` - List/Create buses
- `GET/PUT/DELETE /api/buses/:id` - Bus operations
- `GET/POST /api/drivers` - List/Create drivers
- `GET/PUT/DELETE /api/drivers/:id` - Driver operations
- `GET/POST /api/routes` - List/Create routes

### Contract & Invoice
- `GET/POST /api/contracts` - List/Create contracts
- `POST /api/contracts/:id/generate-invoice` - Generate invoice
- `GET/POST /api/invoices` - List/Create invoices
- `POST /api/invoices/:id/payment` - Record payment
- `GET /api/invoices/:id/pdf` - Download PDF

### Garage Management
- `GET/POST /api/vehicles` - List/Create client vehicles
- `GET/POST /api/services` - List/Create service records
- `GET/POST /api/spare-parts` - List/Create spare parts
- `POST /api/spare-parts/:id/adjust-stock` - Adjust stock

### Financial
- `GET/POST /api/expenses` - List/Create expenses
- `GET/POST /api/payments` - List/Create payments
- `GET /api/reports/financial` - Generate financial report
- `GET /api/reports/export` - Export data to CSV

## Database Schema

### Key Tables
- `users` - System users with roles
- `roles` - User roles and permissions
- `buses` - Fleet buses
- `drivers` - Driver information
- `routes` - Transport routes
- `trips` - Trip logs
- `contracts` - Client contracts
- `invoices` - Generated invoices
- `vehicles` - Client vehicles for service
- `service_records` - Service history
- `spare_parts` - Parts inventory
- `expenses` - Company expenses
- `payments` - Received payments

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based middleware
- Input validation
- Error handling middleware

## Sample Data

The seeder creates sample data including:
- 5 buses with various statuses
- 5 drivers
- 5 transport routes
- 4 contracts
- 5 client vehicles
- 10 spare parts
- Sample invoices and payments

## Development

```bash
# Run backend in development mode
cd backend
npm run dev

# Run frontend in development mode
cd frontend
npm run dev

# Seed database with sample data
cd backend
npm run seed
```

## Production Build

```bash
cd frontend
npm run build
```

The built files will be in the `dist` folder.

## License

MIT License - Feel free to use and modify for your needs.

## Support

For support and questions, please create an issue on the repository.
"# SmartFleet" 
