# RBAC Web Application

A complete Role-Based Access Control (RBAC) system built with Angular 17, featuring authentication, role management, user management, and fine-grained permission control.

## 🎯 Features

### ✅ Authentication
- Dummy login with Admin role
- Session persistence using localStorage
- AuthGuard for route protection
- Automatic redirect to login for unauthorized access

### 🔐 Role Management (Admin Only)
- Complete CRUD operations for roles
- Assign page and feature-level permissions
- Visual permission management interface
- Pre-configured roles (Admin, Manager, Viewer)

### 👥 User Management
- List all users with their assigned roles
- Add, edit, and delete users
- Assign roles to users
- Permission-based UI controls (Edit/Delete buttons only visible with proper permissions)

### 🛡️ RBAC Enforcement
- **Route Guard**: Restricts access to pages based on role permissions
- **Directive**: `*appHasPermission` directive to show/hide UI elements
- **Page Permissions**: Dashboard, Users, Roles
- **Feature Permissions**: Add User, Edit User, Delete User, Add Role, Edit Role, Delete Role

### 📱 Pages
- `/login` - Authentication page
- `/dashboard` - Main dashboard with statistics and quick actions
- `/users` - User management interface
- `/roles` - Role and permission management

## 🚀 Tech Stack

- **Angular 17** - Latest standalone components
- **TypeScript** - Type-safe development
- **Bootstrap 5** - Responsive UI framework
- **Bootstrap Icons** - Icon library
- **RxJS** - Reactive programming
- **Signals** - Modern Angular reactivity

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Setup Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run the Application**
   ```bash
   npm start
   ```

3. **Access the Application**
   Open your browser and navigate to:
   ```
   http://localhost:4200
   ```

## 🔑 Login Credentials

Use the following credentials to login:

- **Username**: `admin`
- **Password**: `admin`

This will log you in as an Admin user with full permissions.

## 📂 Project Structure

```
src/app/
├── components/          # Application components
│   ├── login/          # Login page
│   ├── dashboard/      # Dashboard page
│   ├── users/          # User management
│   └── roles/          # Role management
├── models/             # TypeScript interfaces
│   ├── user.model.ts
│   ├── role.model.ts
│   └── permission.model.ts
├── services/           # Business logic services
│   ├── auth.service.ts
│   ├── user.service.ts
│   └── role.service.ts
├── guards/             # Route guards
│   ├── auth.guard.ts
│   └── role.guard.ts
├── directives/         # Custom directives
│   └── has-permission.directive.ts
└── app.routes.ts       # Application routing
```

## 🎨 Features Overview

### 1. Authentication System
- Secure login with credential validation
- Session management using localStorage
- Automatic redirect for unauthorized users
- Current user state using Angular Signals

### 2. Dashboard
- Statistics cards showing total users, active users, and roles
- Recent users list
- Quick action buttons
- User's permission overview

### 3. User Management
- Responsive table view of all users
- Add/Edit/Delete operations with modals
- Role assignment to users
- Active/Inactive status toggle
- Avatar indicators with user initials

### 4. Role Management
- Card-based view of all roles
- Create custom roles with specific permissions
- Edit existing roles and permissions
- Visual permission grouping (Page vs Feature)
- Delete roles with confirmation

### 5. Permission System
- **Page Permissions**: Control access to entire pages
  - Dashboard Access
  - Users Access
  - Roles Access

- **Feature Permissions**: Control specific actions
  - Add User
  - Edit User
  - Delete User
  - Add Role
  - Edit Role
  - Delete Role

## 🛠️ Development

### Build for Production
```bash
npm run build
```

### Run Tests
```bash
npm test
```

### Code Linting
The project uses Angular's built-in linting. Code follows Angular style guide and best practices.

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- ✅ Desktop (1920x1080 and above)
- ✅ Laptop (1366x768)
- ✅ Tablet (768x1024)
- ✅ Mobile (375x667 and above)

## 🔒 Security Features

- Input validation on all forms
- XSS protection using Angular's built-in sanitization
- CSRF protection ready
- Role-based access control at multiple levels
- Secure password storage concept (ready for backend integration)

## 🎯 Pre-configured Data

The application comes with pre-configured data for demonstration:

### Default Roles:
1. **Admin** - Full access to all pages and features
2. **Manager** - Can manage users but limited role access
3. **Viewer** - Read-only access to dashboard and users

### Default Users:
1. **Admin User** - Full admin access
2. **John Manager** - Manager role
3. **Jane Viewer** - Viewer role

All data is stored in localStorage and persists across sessions.

## 🚀 Future Enhancements

- Backend API integration
- Real authentication with JWT
- Password reset functionality
- User profile management
- Audit logs
- Advanced filtering and search
- Bulk operations
- Export to CSV/Excel
- Email notifications
- Multi-factor authentication

## 📝 Notes

- All data is stored in localStorage (no backend required)
- The application uses Angular 17 standalone components
- Bootstrap 5 is used for styling
- The app follows Angular best practices and coding standards

## 👨‍💻 Development Guidelines

- Uses TypeScript strict mode
- Follows Angular style guide
- Implements reactive programming with Signals and RxJS
- Component-based architecture
- Standalone components (no NgModules)
- Type-safe with interfaces
- Responsive design with Bootstrap

## 📄 License

This project is created for demonstration purposes.

---

**Built with ❤️ using Angular 17**
