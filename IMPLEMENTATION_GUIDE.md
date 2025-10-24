# RBAC System - Implementation Guide

## Overview

This document provides a comprehensive overview of the RBAC (Role-Based Access Control) system implementation.

## Architecture

### 1. Data Models

#### Permission Model
```typescript
- PermissionType: 'page' | 'feature'
- PagePermission: 'dashboard' | 'users' | 'roles'
- FeaturePermission: 'add-user' | 'edit-user' | 'delete-user' | 'add-role' | 'edit-role' | 'delete-role'
```

#### Role Model
```typescript
- id: string
- name: string
- description: string
- permissions: Permission[]
- timestamps
```

#### User Model
```typescript
- id: string
- username: string
- email: string
- firstName: string
- lastName: string
- role: Role
- isActive: boolean
- timestamps
```

### 2. Services

#### AuthService
**Purpose**: Handles authentication and permission checking

**Key Methods**:
- `login(credentials)` - Authenticates user
- `logout()` - Clears session
- `getCurrentUser()` - Returns current logged-in user
- `hasPermission(code)` - Checks if user has specific permission
- `hasPageAccess(page)` - Checks if user can access a page

**State Management**: Uses Angular Signals for reactive state

#### UserService
**Purpose**: Manages user CRUD operations

**Key Methods**:
- `getAllUsers()` - Fetches all users
- `getUserById(id)` - Gets single user
- `createUser(user)` - Creates new user
- `updateUser(id, updates)` - Updates user
- `deleteUser(id)` - Deletes user

**Storage**: Uses localStorage with key 'rbac_users'

#### RoleService
**Purpose**: Manages role CRUD operations

**Key Methods**:
- `getAllRoles()` - Fetches all roles
- `getRoleById(id)` - Gets single role
- `createRole(role)` - Creates new role
- `updateRole(id, updates)` - Updates role
- `deleteRole(id)` - Deletes role
- `getAvailablePermissions()` - Returns all available permissions

**Storage**: Uses localStorage with key 'rbac_roles'

### 3. Guards

#### AuthGuard
**Purpose**: Protects routes from unauthenticated access

**Functionality**:
- Checks if user is authenticated
- Redirects to login if not authenticated
- Preserves return URL for post-login redirect

#### RoleGuard
**Purpose**: Implements page-level permission control

**Functionality**:
- Checks if user has required page permission
- Works in conjunction with AuthGuard
- Redirects to dashboard if permission denied

### 4. Directives

#### HasPermissionDirective
**Purpose**: Controls UI element visibility based on permissions

**Usage**:
```html
<button *appHasPermission="'add-user'">Add User</button>
```

**Functionality**:
- Removes element from DOM if user lacks permission
- Automatically updates when user permissions change
- Works with both page and feature permissions

### 5. Components

#### LoginComponent
- Simple authentication form
- Displays demo credentials
- Error handling
- Loading state
- Form validation

#### DashboardComponent
- Statistics overview
- Recent users list
- Quick action buttons
- Permission-based content display

#### UsersComponent
- User list table
- Add/Edit user modal
- Delete confirmation
- Role assignment
- Status management
- Permission-based action buttons

#### RolesComponent
- Role cards display
- Add/Edit role modal
- Permission checkboxes
- Grouped permissions (Page/Feature)
- Delete confirmation

## Security Implementation

### 1. Route Protection
```typescript
{
  path: 'users',
  component: UsersComponent,
  canActivate: [authGuard, roleGuard],
  data: { requiredPage: 'users' }
}
```

### 2. UI Element Protection
```html
<button *appHasPermission="'edit-user'">Edit</button>
```

### 3. Service-Level Checks
All services validate permissions before performing operations.

## Data Flow

### Authentication Flow
1. User enters credentials
2. AuthService validates credentials
3. User object stored in localStorage
4. User redirected to dashboard
5. Auth state updated via Signals

### Permission Check Flow
1. Component/Guard requests permission check
2. AuthService retrieves current user
3. Check user's role permissions
4. Return boolean result
5. UI updates accordingly

### CRUD Operation Flow
1. User initiates action
2. Component validates permission
3. Service performs operation
4. localStorage updated
5. Observable emits new data
6. UI reflects changes

## State Management

### Reactive State with Signals
```typescript
// AuthService
currentUserSignal = signal<AuthUser | null>(null);
isAuthenticated = computed(() => this.currentUserSignal() !== null);

// Component
currentUser = this.authService.currentUserSignal;
```

### Observable Streams
```typescript
// Services use BehaviorSubject for state
private usersSubject = new BehaviorSubject<User[]>([]);
public users$ = this.usersSubject.asObservable();
```

## Styling Architecture

### Global Styles (styles.scss)
- CSS Custom Properties for theming
- Base component styles
- Utility classes
- Responsive breakpoints

### Component Styles
- Scoped to component
- BEM-like naming when needed
- Bootstrap utility classes
- Custom animations

## Responsive Design

### Breakpoints
- Desktop: 1200px+
- Tablet: 768px - 1199px
- Mobile: < 768px

### Responsive Features
- Collapsible navigation
- Stacked cards on mobile
- Responsive tables
- Touch-friendly buttons
- Optimized modals

## Best Practices Implemented

### Angular Best Practices
✅ Standalone components
✅ Signal-based state management
✅ Reactive programming with RxJS
✅ Type safety with TypeScript
✅ Lazy loading ready
✅ OnPush change detection ready

### Code Organization
✅ Feature-based folder structure
✅ Barrel exports (index.ts)
✅ Single responsibility principle
✅ Dependency injection
✅ Reusable directives

### Security
✅ Input validation
✅ XSS protection (Angular built-in)
✅ Route guards
✅ Permission checks at multiple levels
✅ Secure data handling

### Performance
✅ Efficient change detection with Signals
✅ Virtual scrolling ready
✅ Optimized bundle size
✅ Lazy loading routes (ready)
✅ TrackBy functions for lists

## Testing Strategy (Ready for Implementation)

### Unit Tests
- Service methods
- Guard logic
- Directive behavior
- Component logic

### Integration Tests
- Component interactions
- Service interactions
- Route navigation

### E2E Tests
- Login flow
- CRUD operations
- Permission enforcement
- Navigation

## Deployment Checklist

- [ ] Environment configuration
- [ ] API endpoint configuration
- [ ] Build for production
- [ ] Configure server routes for SPA
- [ ] Set up SSL certificate
- [ ] Configure CORS
- [ ] Set up monitoring
- [ ] Configure logging
- [ ] Performance optimization
- [ ] Security headers

## Future Backend Integration

### API Endpoints Needed
```
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/users
GET    /api/users/:id
POST   /api/users
PUT    /api/users/:id
DELETE /api/users/:id
GET    /api/roles
GET    /api/roles/:id
POST   /api/roles
PUT    /api/roles/:id
DELETE /api/roles/:id
GET    /api/permissions
```

### Service Modifications Required
1. Replace localStorage with HTTP calls
2. Add error handling for network issues
3. Implement retry logic
4. Add caching strategy
5. Handle pagination
6. Implement WebSocket for real-time updates

## Troubleshooting

### Common Issues

**Issue**: Routes not working after refresh
**Solution**: Configure server to redirect all routes to index.html

**Issue**: Permissions not updating
**Solution**: Check if user state is properly updated in AuthService

**Issue**: Modal not closing
**Solution**: Ensure signal updates are triggering change detection

**Issue**: Icons not showing
**Solution**: Verify Bootstrap Icons CDN is loaded in index.html

## Performance Optimization Tips

1. **Use TrackBy in *ngFor**
```typescript
trackByUserId(index: number, user: User): string {
  return user.id;
}
```

2. **Implement OnPush Change Detection**
```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
```

3. **Use Async Pipe**
```html
<div *ngIf="users$ | async as users">
```

4. **Lazy Load Routes**
```typescript
{
  path: 'users',
  loadComponent: () => import('./components/users/users.component')
}
```

## Maintenance

### Regular Tasks
- Update dependencies
- Review and update permissions
- Check browser console for warnings
- Monitor bundle size
- Review security best practices
- Update documentation

### Code Review Checklist
- [ ] Type safety maintained
- [ ] No any types used
- [ ] Proper error handling
- [ ] Loading states implemented
- [ ] Responsive design verified
- [ ] Accessibility checked
- [ ] Performance impact assessed

---

**Document Version**: 1.0
**Last Updated**: 2024

