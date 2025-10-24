# RBAC System - Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start the Application
```bash
npm start
```

### Step 3: Login
Open http://localhost:4200 and login with:
- **Username**: `admin`
- **Password**: `admin`

---

## 📋 What You Can Do

### As Admin (Default Login)
✅ View Dashboard with statistics
✅ Manage Users (Add, Edit, Delete)
✅ Manage Roles (Add, Edit, Delete)
✅ Assign roles to users
✅ Configure permissions for roles
✅ Full system access

---

## 🎯 Quick Navigation

| Page | URL | Description |
|------|-----|-------------|
| Login | `/login` | Authentication page |
| Dashboard | `/dashboard` | Overview and statistics |
| Users | `/users` | User management |
| Roles | `/roles` | Role and permission management |

---

## 🔐 Permission System

### Page Permissions (Route Access)
- **Dashboard** - Access to dashboard page
- **Users** - Access to users page
- **Roles** - Access to roles page

### Feature Permissions (UI Actions)
- **Add User** - Can add new users
- **Edit User** - Can edit existing users
- **Delete User** - Can delete users
- **Add Role** - Can add new roles
- **Edit Role** - Can edit existing roles
- **Delete Role** - Can delete roles

---

## 👥 Pre-configured Roles

### 1. Admin (Full Access)
- ✅ All page permissions
- ✅ All feature permissions

### 2. Manager (Limited Access)
- ✅ Dashboard access
- ✅ Users access
- ✅ Add & edit users
- ❌ No delete user
- ❌ No role management

### 3. Viewer (Read Only)
- ✅ Dashboard access
- ✅ Users access (view only)
- ❌ No add/edit/delete
- ❌ No role management

---

## 🛠️ Common Tasks

### Create a New User
1. Login as Admin
2. Navigate to Users page
3. Click "Add User" button
4. Fill in user details
5. Select a role
6. Click "Create User"

### Create a New Role
1. Login as Admin
2. Navigate to Roles page
3. Click "Add Role" button
4. Enter role name and description
5. Select desired permissions
6. Click "Create Role"

### Assign Role to User
1. Navigate to Users page
2. Click Edit icon for the user
3. Select role from dropdown
4. Click "Update User"

---

## 🎨 UI Features

### Responsive Design
- ✅ Works on desktop, tablet, and mobile
- ✅ Collapsible navigation on mobile
- ✅ Touch-friendly buttons
- ✅ Optimized layouts for all screens

### Visual Feedback
- ✅ Loading spinners
- ✅ Success/error messages
- ✅ Confirmation dialogs
- ✅ Hover effects
- ✅ Active state indicators

---

## 🐛 Troubleshooting

### Application won't start
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
npm start
```

### Port 4200 already in use
```bash
# Start on different port
ng serve --port 4300
```

### Icons not showing
- Check internet connection (Bootstrap Icons loaded from CDN)
- Verify `index.html` has Bootstrap Icons link

### Changes not reflecting
```bash
# Hard refresh browser
Ctrl + Shift + R (Windows/Linux)
Cmd + Shift + R (Mac)
```

---

## 📱 Test Responsive Design

### Desktop View
- Full navigation bar
- Multi-column layouts
- Detailed tables

### Tablet View
- Adjusted layouts
- Responsive tables
- Stacked columns

### Mobile View
- Hamburger menu
- Single column layouts
- Scrollable tables
- Large touch targets

---

## 🎯 Testing the System

### Test Authentication
1. Logout and try accessing `/users` directly
2. Should redirect to login page
3. After login, should redirect back to `/users`

### Test Permissions
1. Create a "Viewer" role user
2. Login with that user
3. Notice Add/Edit/Delete buttons are hidden
4. Try accessing `/roles` - should redirect

### Test CRUD Operations
1. Create multiple users
2. Edit user details
3. Assign different roles
4. Delete a user
5. Verify localStorage persistence

---

## 💡 Tips

1. **Data Persistence**: All data is stored in localStorage. Clear browser data to reset.

2. **Multiple Roles**: Create custom roles with specific permission combinations.

3. **Testing**: Use incognito/private windows to test different user roles simultaneously.

4. **Navigation**: Use browser back/forward - routing is properly configured.

5. **Mobile Testing**: Use Chrome DevTools (F12) → Device Toolbar for mobile simulation.

---

## 📦 Project Structure Summary

```
src/app/
├── components/     # UI Components
├── models/         # Data Models
├── services/       # Business Logic
├── guards/         # Route Protection
├── directives/     # Custom Directives
└── app.routes.ts   # Routing Config
```

---

## 🚀 Next Steps

1. ✅ Explore the dashboard
2. ✅ Try creating new users
3. ✅ Create custom roles
4. ✅ Test permission system
5. ✅ Check responsive design
6. ✅ Review the code structure

---

## 📚 Additional Resources

- `README.md` - Full documentation
- `IMPLEMENTATION_GUIDE.md` - Technical details
- Angular Docs: https://angular.io/docs

---

## ⚡ Commands Reference

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Lint code
ng lint
```

---

**Happy Coding! 🎉**

For any issues or questions, refer to the full README.md or IMPLEMENTATION_GUIDE.md

