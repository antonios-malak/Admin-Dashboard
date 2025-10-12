# Mini Dashboard

A modern Vue 3 dashboard application built with TypeScript, Vite, Element Plus, and Tailwind CSS.

## Features

- 🔐 Authentication system (Login, Forgot Password, OTP, Reset Password)
- 👥 User management with roles and permissions
- 🎭 Role-based access control
- 📊 Dashboard with statistics
- 🌐 Multi-language support (English/Arabic)
- 📱 Responsive design
- 🎨 Modern UI with Element Plus and Tailwind CSS

## Tech Stack

- **Frontend**: Vue 3 + TypeScript + Vite
- **UI Library**: Element Plus
- **Styling**: Tailwind CSS
- **State Management**: Pinia
- **Routing**: Vue Router
- **HTTP Client**: Axios
- **Internationalization**: Vue I18n

## API Configuration

The application uses environment variables for API configuration. You can set these variables in your `.env.local` file:

```env
# API Configuration
VITE_API_BASE_URL=https://your-api-domain.com
VITE_API_TIMEOUT=10000

# App Configuration
VITE_APP_NAME=Mini Dashboard
VITE_APP_VERSION=1.0.0

# Development Configuration
VITE_DEBUG=false
```

### Default API Endpoints

The application expects the following API endpoints:

- **Authentication**: `/auth/*`
  - `POST /auth/login` - User login
  - `POST /auth/forgot-password` - Forgot password
  - `POST /auth/verify-otp` - Verify OTP
  - `POST /auth/reset-password` - Reset password

- **Users**: `/users`
  - `GET /users` - Get all users
  - `POST /users` - Create user
  - `PUT /users/:id` - Update user
  - `DELETE /users/:id` - Delete user
  - `PATCH /users/:id/toggle-status` - Toggle user status

- **Roles**: `/roles`
  - `GET /roles` - Get all roles
  - `POST /roles` - Create role
  - `PUT /roles/:id` - Update role
  - `DELETE /roles/:id` - Delete role
  - `PATCH /roles/:id/toggle-status` - Toggle role status

- **Permissions**: `/permissions`
  - `GET /permissions` - Get all permissions

- **Orders**: `/orders`
  - `GET /orders` - Get all orders
  - `POST /orders/:id/status` - Update order status

- **Products**: `/products`
  - `GET /products` - Get all products
  - `POST /products` - Create product
  - `PUT /products/:id` - Update product
  - `DELETE /products/:id` - Delete product

- **Categories**: `/categories`
  - `GET /categories` - Get all categories
  - `POST /categories` - Create category
  - `PUT /categories/:id` - Update category
  - `DELETE /categories/:id` - Delete category

- **Reports**: `/reports`
  - `GET /reports` - Get all reports
  - `POST /reports/:id/status` - Update report status

- **Settings**: `/languages`, `/currencies`
  - `GET /languages` - Get all languages
  - `POST /languages` - Create language
  - `PUT /languages/:id` - Update language
  - `DELETE /languages/:id` - Delete language
  - `GET /currencies` - Get all currencies
  - `POST /currencies` - Create currency
  - `PUT /currencies/:id` - Update currency
  - `DELETE /currencies/:id` - Delete currency

- **Statistics**: `/stats`
  - `GET /stats` - Get dashboard statistics

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Create a `.env.local` file in the root directory and configure your API settings.

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── App/            # Layout components
│   └── ...             # Other components
├── composables/        # Vue composables
├── locales/            # Internationalization files
├── middleware/         # Route middleware
├── pages/              # Page components
├── router/             # Vue Router configuration
├── stores/             # Pinia stores
├── utils/              # Utility functions
│   ├── api.ts         # API configuration
│   └── notify.ts      # Notification utilities
└── main.ts            # Application entry point
```

## Development

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).
