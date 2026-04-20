# radha Admin

radha Admin is a comprehensive React-based admin dashboard designed for managing restaurant operations. It provides tools for handling orders, ingredients, recipes, invoices, payments, users, and more, streamlining the workflow for restaurant administrators.

## Features

### Order Management
- **All Orders**: View, edit, and manage all event bookings with detailed information including customer details, dates, and status.
- **Order Calculations**: Automatic calculation of dish amounts (per_dish_amount * estimated_person), total amounts including service charges, and pending balances.
- **Payment Processing**: Add payments, track advance and pending amounts, with transaction history.
- **Order Status Updates**: Mark orders as completed and update booking status.
- **PDF Generation**: Generate shareable PDFs for orders, including ingredient lists and order details.

### Ingredient & Recipe Management
- **Ingredient Creation**: Add new ingredients with details for recipe management.
- **Recipe Management**: Create and edit recipes with associated ingredients.
- **Ingredient Sharing**: Share ingredient lists for events, with PDF export capabilities.
- **Stock Tracking**: Manage stock categories and inventory levels.

### Category & Item Management
- **Category Organization**: Create and manage categories for organizing menu items.
- **Item Management**: Add and edit menu items within categories.
- **Category Swapping**: Reorder categories for better organization.

### Financial Management
- **Invoice Generation**: Create detailed invoices with PDF export for orders and bills.
- **Payment History**: Track all payment transactions with detailed records.
- **Expense Tracking**: Record and monitor business expenses.
- **Quotation System**: Generate quotations for potential orders.

### User Management
- **User Accounts**: Add, edit, and manage user accounts with role-based access.
- **Authentication**: Secure login system with JWT token-based authentication.
- **Profile Management**: User profile pages for account management.

### Additional Features
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS.
- **Real-time Notifications**: Toast notifications for user feedback.
- **Form Validation**: Comprehensive form validation with error handling.
- **PDF Export**: Multiple PDF generation options for orders, invoices, and reports.
- **Data Persistence**: Local storage for authentication tokens and user data.

## Architecture

### Frontend Architecture
The application follows a **component-based architecture** with separation of concerns:

- **Pages**: Each page consists of a Controller (business logic) and Component (UI rendering), following an MVC-like pattern.
- **Components**: Reusable UI components organized by feature (layout, common, specific modules).
- **State Management**: 
  - Redux for form data and complex state
  - React Context for user authentication state
- **API Layer**: Centralized API functions with error handling and authentication interceptors.
- **Routing**: Protected routes with authentication checks.

### Data Flow
1. **User Interaction**: User interacts with Components in pages.
2. **Controller Logic**: Controllers handle business logic, API calls, and state updates.
3. **API Communication**: Axios instance manages HTTP requests with automatic token injection.
4. **State Updates**: Redux/Context update application state.
5. **UI Re-rendering**: Components re-render based on state changes.

### Key Technologies Integration
- **React Router**: Client-side routing with protected routes.
- **Redux Toolkit**: Simplified state management for forms.
- **Axios Interceptors**: Automatic authentication and error handling.
- **React Hot Toast**: User notifications.
- **Tailwind CSS**: Utility-first styling.
- **Vite**: Fast build tool and development server.

## Application Workflow

### Typical User Journey
1. **Login**: User authenticates with username/password.
2. **Dashboard Navigation**: Access different modules via sidebar navigation.
3. **Order Management**: View all orders, edit details, process payments, generate PDFs.
4. **Menu Management**: Create/edit categories, items, ingredients, and recipes.
5. **Financial Operations**: Generate invoices, track payments, manage expenses.
6. **Reporting**: Export PDFs for orders, invoices, and ingredient lists.

### Business Rules
The application enforces business rules defined in `rules.json`, including:
- Advance payment requirements (30% upfront)
- Cancellation policies (5 days notice)
- Service charge calculations
- Event preparation guidelines

## Development

### Environment Setup
Create a `.env` file in the root directory:
```
VITE_API_BASE_URL=https://your-api-domain.com/api
```

### Available Scripts
- `npm run dev`: Start development server with hot reload
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint for code quality

### Code Quality
- **ESLint**: Configured for React and modern JavaScript
- **Prettier**: Code formatting (if configured)
- **Type Checking**: Basic PropTypes validation

## API Integration

The application communicates with a REST API backend. Key endpoints include:
- `/event-bookings/`: Order management
- `/ingredients/`: Ingredient CRUD operations
- `/payments/`: Payment processing
- `/invoices/`: Invoice generation
- `/users/`: User management

All API calls include automatic JWT authentication and error handling.

## Tech Stack

- **Frontend**: React 18, Vite
- **State Management**: Redux Toolkit, React Redux
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Icons**: React Icons, Huge Icons
- **UI Components**: Headless UI, HeroUI Date Picker
- **Animations**: Framer Motion
- **Notifications**: React Hot Toast
- **Forms**: React Datepicker
- **Build Tool**: Vite
- **Linting**: ESLint

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/radha-admin.git
   cd radha-admin
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your environment variables:
   ```
   VITE_API_BASE_URL=your_api_base_url_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173/radha` (or the port specified by Vite).

## Usage

- **Login**: Use your credentials to log in to the admin panel.
- **Navigation**: Use the sidebar to navigate between different sections like Orders, Ingredients, Recipes, etc.
- **Managing Data**: Add, edit, or delete items in each section as needed.
- **PDF Generation**: Generate PDFs for invoices and orders directly from the interface.
- **Calculations**: The system automatically handles calculations for orders, including totals and pending amounts.

## API Integration

The application integrates with a backend API for data management. Ensure the `VITE_API_BASE_URL` environment variable points to your API server. The app uses Axios for HTTP requests with automatic token authentication and error handling.

## Scripts

- `npm run dev`: Start the development server.
- `npm run build`: Build the project for production.
- `npm run lint`: Run ESLint for code linting.
- `npm run preview`: Preview the production build.

## Project Structure

```
src/
├── apis/                 # API functions for backend communication
│   ├── AuthApis.js       # Authentication-related API calls
│   ├── Fetch*.js         # GET requests for various modules (orders, ingredients, etc.)
│   └── Post*.js          # POST/PUT requests for creating/updating data
├── Components/           # Reusable UI components
│   ├── category/         # Category management components
│   ├── common/           # Shared components (Loader, forms, PDF pages, rules)
│   ├── completeInvoice/  # Invoice completion components
│   ├── ingredient/       # Ingredient management components
│   ├── layout/           # Main layout components (Header, Sidebar, Layout)
│   ├── recipeIngredient/ # Recipe and ingredient relation components
│   └── user/             # User management components
├── context/              # React context providers
│   └── UserContext.jsx   # User authentication and state management
├── data/                 # Static data files
│   └── rules.json        # Business rules and terms
├── pages/                # Page-level components following MVC pattern
│   ├── allOrder/         # All orders page (Component + Controller)
│   ├── category/         # Category management page
│   ├── createIngredient/ # Create ingredient page
│   ├── dish/             # Dish management page
│   ├── editOrder/        # Order editing pages (editDish, editItem)
│   ├── expense/          # Expense tracking page
│   ├── invoice/          # Invoice management page
│   ├── item/             # Item management page
│   ├── login/            # Authentication page
│   ├── paymentHistory/   # Payment history page
│   ├── profile/          # User profile page
│   ├── quotation/        # Quotation management page
│   ├── recipeIngredient/ # Recipe ingredient management page
│   ├── shareIngredient/  # Ingredient sharing page
│   ├── stock/            # Stock management page
│   ├── user/             # User management page
│   └── viewIngredient/   # View ingredient page
├── redux/                # Redux state management
│   ├── FormSlice.jsx     # Form data slice
│   └── Store.jsx         # Redux store configuration
├── routes/               # Route definitions
│   └── PrivateRoute.jsx  # Protected route component
├── services/             # API services
│   └── ApiInstance.js    # Axios instance with interceptors for auth and error handling
└── utils/                # Utility functions
    ├── Config.js         # Application configuration (base path)
    └── ResolvePath.js    # Asset path resolution utility
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and test them.
4. Submit a pull request with a clear description of your changes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contact

For questions or support, please contact the development team.
