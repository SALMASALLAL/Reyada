# 📚 ReyadaTasks - Complete Developer Documentation

## 📦 Project Overview

**ReyadaTasks** is a full-stack web application built with Django REST Framework backend and React.js frontend. The system provides user authentication, profile management, and Bitrix24 CRM integration for contact management. It demonstrates modern web development practices with JWT authentication, form validation, file uploads, and external API integration.

### Key Features:
- 🔐 JWT-based authentication with automatic token refresh
- 👤 User registration, login, and profile management
- 📷 Profile image upload functionality  
- 🔗 Bitrix24 CRM integration for contact sync
- � Sales orders/deals management with payment processing
- 📋 Automated task creation for completed deals
- �📱 Responsive design with Tailwind CSS
- 🛡️ Protected routes and API security
- 📝 Form validation on frontend and backend
- 🔄 Management commands for data synchronization

---

## 📁 File/Folder Structure

```
ReyadaTasks/
├── backend/                          # Django REST API Backend
│   ├── manage.py                     # Django management script
│   ├── requirements.txt              # Python dependencies
│   ├── media/                        # User uploaded files (profile images)
│   │   └── profile_images/
│   ├── ReyadaTasks/                  # Main Django project
│   │   ├── __init__.py
│   │   ├── settings.py               # Django configuration & environment variables
│   │   ├── urls.py                   # Root URL routing
│   │   ├── wsgi.py                   # WSGI application entry point
│   │   └── asgi.py                   # ASGI application entry point
│   ├── user/                         # User management app
│   │   ├── models.py                 # User & Profile models
│   │   ├── views.py                  # User ViewSet & authentication endpoints
│   │   ├── serializers.py            # User serialization logic
│   │   ├── urls.py                   # User app URL patterns
│   │   ├── admin.py                  # Django admin configuration
│   │   ├── apps.py                   # App configuration
│   │   ├── tests.py                  # Unit tests (placeholder)
│   │   ├── README.md                 # User app documentation
│   │   └── migrations/               # Database migration files
│   │       ├── 0001_initial.py
│   │       └── 0002_alter_user_managers.py
│   └── bitrix/                       # Bitrix24 CRM integration app
│       ├── models.py                 # BitrixContact model
│       ├── views.py                  # Bitrix contact ViewSet & API endpoints
│       ├── serializers.py            # Bitrix contact serialization
│       ├── urls.py                   # Bitrix app URL patterns
│       ├── admin.py                  # Django admin for Bitrix contacts
│       ├── apps.py                   # App configuration
│       ├── migrations/               # Database migration files
│       │   ├── 0001_initial.py
│       │   └── 0002_bitrixcontact_phone.py
│       └── management/               # Django management commands
│           └── commands/
│               └── sync_bitrix_contacts.py  # Sync command from Bitrix24 API
│
├── ReactFrontend/                    # React.js Frontend
│   ├── index.html                    # HTML entry point
│   ├── package.json                  # Node.js dependencies & scripts
│   ├── pnpm-lock.yaml               # Package manager lock file
│   ├── vite.config.js               # Vite build configuration
│   ├── tailwind.config.js           # Tailwind CSS configuration
│   ├── postcss.config.js            # PostCSS configuration
│   ├── README.md                     # Frontend documentation
│   └── src/                          # React source code
│       ├── main.jsx                  # React application entry point
│       ├── App.jsx                   # Main App component with routing
│       ├── index.css                 # Global styles & Tailwind utilities
│       ├── components/               # Reusable React components
│       │   ├── Input.jsx             # Form input component
│       │   ├── Navbar.jsx            # Navigation component
│       │   ├── ContactForm.jsx       # Bitrix contact creation form
│       │   └── ProtectedRoute.jsx    # Route protection wrapper
│       ├── pages/                    # Page components
│       │   ├── LoginPage.jsx         # User login page
│       │   ├── RegisterPage.jsx      # User registration page
│       │   ├── ProfilePage.jsx       # User profile management
│       │   ├── SalesOrders.jsx       # Sales orders/deals management
│       │   └── BitrixContactsPage.jsx # Bitrix contacts list & management
│       ├── context/                  # React Context providers
│       │   └── AuthContext.jsx       # Authentication state management
│       └── services/                 # API integration
│           └── api.js                # Axios configuration & API calls
│
└── README.md                         # Main project documentation
```

---

## ⚙️ Functional Breakdown

### Backend Functions (Django)

#### User App (`backend/user/`)

**Models (`models.py`):**
- `UserManager` - Custom user manager for email-based authentication
  - `create_user()` - Creates regular user
  - `create_superuser()` - Creates admin user
- `User` - Custom user model extending AbstractUser
  - Uses email instead of username for authentication
  - Fields: email, first_name, last_name, date_joined, last_login
- `Profile` - User profile model with additional information
  - OneToOne relationship with User
  - Fields: profile_image, birth_date, bio, phone, created_at, updated_at

**Views (`views.py`):**
- `UserViewSet` - Main ViewSet handling user operations
  - `create()` - User registration with JWT token generation
  - `login()` - User authentication endpoint
  - `logout()` - Token blacklisting
  - `profile()` - Get current user profile
  - `update_profile()` - Update user profile information
  - `change_password()` - Password change functionality
- `ProfileViewSet` - Profile-specific operations
- `user_profile_view()` - Function-based view for backward compatibility

**Serializers (`serializers.py`):**
- `UserRegistrationSerializer` - User registration validation
- `CustomTokenObtainPairSerializer` - JWT token generation with email
- `UserDetailSerializer` - User details with profile information
- `ChangePasswordSerializer` - Password change validation
- `ProfileUpdateSerializer` - Profile update validation
- `UserProfileSerializer` - Profile information serialization

#### Bitrix App (`backend/bitrix/`)

**Models (`models.py`):**
- `BitrixContact` - Stores Bitrix24 CRM contact data
  - Fields: name, last_name, email (unique), phone, created_at, updated_at
  - Methods: `__str__()`, `full_name` property

**Views (`views.py`):**
- `BitrixContactViewSet` - ViewSet for Bitrix contact operations
  - `list()` - Get all contacts
  - `create()` - Create new contact and sync to Bitrix24
  - `update()` - Disabled (contacts managed in Bitrix24)
  - `destroy()` - Disabled (contacts managed in Bitrix24)
  - `_sync_contact_to_bitrix()` - Private method to sync contact to Bitrix24 API

**Management Commands:**
- `sync_bitrix_contacts.py` - Command to sync contacts from Bitrix24 API
  - Fetches contacts from Bitrix24 REST API
  - Creates/updates local BitrixContact records
  - Supports dry-run and verbose modes

### Frontend Functions (React)

#### Components (`src/components/`)

**Input.jsx:**
- Reusable form input component
- Handles validation errors and styling
- Props: label, name, type, register, error, placeholder, accept

**Navbar.jsx:**
- Navigation component with authentication state
- Shows different menus for authenticated/unauthenticated users
- Handles logout functionality

**ContactForm.jsx:**
- Form for creating new Bitrix contacts
- Client-side validation
- Integrates with backend Bitrix API
- Functions:
  - `handleChange()` - Form input handling
  - `validateForm()` - Client-side validation
  - `handleSubmit()` - Form submission to API

**ProtectedRoute.jsx:**
- Route wrapper component for authentication
- Redirects unauthenticated users to login
- Shows loading spinner during auth check

#### Pages (`src/pages/`)

**LoginPage.jsx:**
- User login form with validation
- Uses React Hook Form + Yup validation
- Redirects authenticated users
- Functions:
  - `onSubmit()` - Login form submission

**RegisterPage.jsx:**
- User registration form with file upload
- Password confirmation validation
- Profile image upload support
- Functions:
  - `onSubmit()` - Registration form submission

**ProfilePage.jsx:**
- User profile view and edit functionality
- Profile image upload and preview
- Password change form
- Functions:
  - `handleImageChange()` - Image file handling
  - `onSubmitProfile()` - Profile update submission
  - `onSubmitPassword()` - Password change submission
  - `formatDate()` - Date formatting utility
  - `getProfileImageUrl()` - Image URL generation

**BitrixContactsPage.jsx:**
- Displays list of Bitrix contacts
- Contact creation form toggle
- Responsive table/card views
- Functions:
  - `fetchContacts()` - Fetch contacts from API
  - `handleContactCreated()` - Refresh contacts after creation
  - `formatDate()` - Date formatting

**SalesOrders.jsx:**
- Sales orders/deals management interface
- Displays deals in "Waiting for Payment" stage
- Create new sales orders with comprehensive form
- Mark deals as paid with automated processing
- Components:
  - `DealCard` - Individual deal display component
  - `CreateSalesOrderModal` - Sales order creation form
- Functions:
  - `fetchDeals()` - Fetch deals from Bitrix24 API
  - `handleMarkAsPaid()` - Process payment and create tasks
  - `handleCreateSalesOrder()` - Open creation modal
  - `formatCurrency()` - Currency formatting utility
  - `formatDate()` - Date formatting utility

#### Context (`src/context/`)

**AuthContext.jsx:**
- Global authentication state management
- Token management and refresh
- User profile data handling
- Functions:
  - `login()` - User authentication
  - `register()` - User registration
  - `logout()` - User logout and cleanup
  - `updateUserProfile()` - Profile update
  - `refreshUserProfile()` - Refresh user data

#### Services (`src/services/`)

**api.js:**
- Axios HTTP client configuration
- Request/response interceptors for authentication
- API endpoint functions:
  - `authAPI.login()` - User login
  - `authAPI.register()` - User registration
  - `authAPI.logout()` - User logout
  - `authAPI.getProfile()` - Get user profile
  - `authAPI.updateProfile()` - Update profile
  - `authAPI.changePassword()` - Change password
  - `bitrixAPI.getContacts()` - Get Bitrix contacts
  - `bitrixAPI.createContact()` - Create Bitrix contact
  - `bitrixAPI.getDeals()` - Get Bitrix deals by stage
  - `bitrixAPI.createDeal()` - Create new sales order/deal
  - `bitrixAPI.updateDeal()` - Update deal information
  - `bitrixAPI.markDealAsPaid()` - Mark deal as won/paid
  - `bitrixAPI.createTask()` - Create task linked to deal

---

## 🔗 Routes & API Endpoints

### Backend API Endpoints

#### Authentication Routes (`/api/auth/`)
| Method | Path | Handler | Description | Auth Required |
|--------|------|---------|-------------|---------------|
| POST | `/api/auth/users/` | `UserViewSet.create` | User registration | No |
| POST | `/api/auth/users/login/` | `UserViewSet.login` | User login | No |
| POST | `/api/auth/users/logout/` | `UserViewSet.logout` | User logout | Yes |
| GET | `/api/auth/users/profile/` | `UserViewSet.profile` | Get user profile | Yes |
| PUT/PATCH | `/api/auth/users/update_profile/` | `UserViewSet.update_profile` | Update profile | Yes |
| PUT | `/api/auth/users/change_password/` | `UserViewSet.change_password` | Change password | Yes |
| POST | `/api/auth/token/refresh/` | `TokenRefreshView` | Refresh JWT token | No |
| GET | `/api/auth/profiles/` | `ProfileViewSet.list` | List profiles | Yes |
| GET | `/api/auth/profile/detail/` | `user_profile_view` | Profile detail (legacy) | Yes |

#### Bitrix Routes (`/api/`)
| Method | Path | Handler | Description | Auth Required |
|--------|------|---------|-------------|---------------|
| GET | `/api/bitrix-contacts/` | `BitrixContactViewSet.list` | List all contacts | Yes |
| POST | `/api/bitrix-contacts/` | `BitrixContactViewSet.create` | Create new contact | Yes |
| GET | `/api/bitrix-contacts/{id}/` | `BitrixContactViewSet.retrieve` | Get contact detail | Yes |
| PUT/PATCH | `/api/bitrix-contacts/{id}/` | `BitrixContactViewSet.update` | Update contact (disabled) | No |
| DELETE | `/api/bitrix-contacts/{id}/` | `BitrixContactViewSet.destroy` | Delete contact (disabled) | No |

#### Documentation Routes
| Method | Path | Description |
|--------|------|-------------|
| GET | `/swagger/` | Swagger UI documentation |
| GET | `/redoc/` | ReDoc API documentation |
| GET | `/swagger.json` | OpenAPI JSON schema |

### Frontend Routes

| Path | Component | Description | Protected |
|------|-----------|-------------|-----------|
| `/` | `Navigate to /login` | Root redirect | No |
| `/login` | `LoginPage` | User login form | No |
| `/register` | `RegisterPage` | User registration form | No |
| `/profile` | `ProfilePage` | User profile management | Yes |
| `/bitrix-contacts` | `BitrixContactsPage` | Bitrix contacts list | Yes |
| `/sales-orders` | `SalesOrders` | Sales orders/deals management | Yes |

---

## 🧠 Business Logic

### Authentication Flow
1. **Registration:**
   - User submits registration form with optional profile image
   - Backend validates data and creates User + Profile records
   - JWT tokens generated and returned
   - Frontend stores tokens and redirects to profile

2. **Login:**
   - User submits email/password
   - Backend authenticates and returns JWT tokens
   - Frontend fetches user profile and stores data
   - User redirected to profile page

3. **Token Management:**
   - Access tokens valid for 60 minutes
   - Refresh tokens valid for 7 days
   - Automatic token refresh on API calls
   - Token blacklisting on logout

### Profile Management
1. **Profile Updates:**
   - Users can update personal information and profile image
   - Images stored in Django media directory
   - Profile data validation on frontend and backend

2. **Password Changes:**
   - Requires current password verification
   - New password validation (minimum 8 characters)
   - Password confirmation matching

### Bitrix24 Integration
1. **Contact Creation Flow:**
   - User creates contact through frontend form
   - Contact saved to local database first
   - Contact synced to Bitrix24 CRM via REST API
   - Error handling for sync failures (contact remains in DB)

2. **Contact Synchronization:**
   - Management command fetches contacts from Bitrix24 API
   - Creates/updates local BitrixContact records
   - Handles duplicate detection by email
   - Supports dry-run mode for testing

### Sales Orders Page Integration

A custom page `SalesOrders.jsx` was created to manage deals in the "Waiting for the Payment" stage, providing comprehensive sales order management functionality.

#### ✅ Features:
1. **Deal Fetching:**
   - Fetches all Bitrix24 Deals where `STAGE_ID = UC_3MCI1C` (Waiting for Payment)
   - Uses direct Bitrix24 REST API calls bypassing Django backend
   - Displays deals in responsive card format

2. **Deal Display:**
   - Each deal is shown as a card including:
     - Title and Deal ID
     - Opportunity amount with currency formatting
     - Creation and modification dates
     - Current stage status indicator

3. **Sales Order Creation:**
   - Modal form for creating new sales orders/deals
   - Form fields include:
     - Title (required)
     - Amount and Currency selection
     - Tax Registration 
     - Contract status 
     - Paid checkbox 

4. **Payment Processing:**
   - When user marks a deal as "Paid":
     - Deal's `STAGE_ID` is updated to `WON` (Deal Won) using `crm.deal.update`
     - A new task is automatically created via `task.item.add.json` with:
       - Title: same as the deal title
       - Responsible user: predefined ID (17)
       - Linked to the deal using `UF_CRM_TASK: ["D_<dealId>"]`
       - Includes tax registration and contract values

#### ✅ Technical Implementation:
- **API Integration:** Direct calls to Bitrix24 REST API endpoints
- **Environment Configuration:** All API URLs stored in `.env` with VITE prefixes
- **Error Handling:** Comprehensive error handling with toast notifications
- **State Management:** Loading states and real-time UI updates
- **Responsive Design:** Tailwind CSS for mobile-friendly interface

#### ✅ Result:
- All paid deals are automatically moved to "Deal Won" stage
- Tasks are created and visible in:
  - Tasks and Projects → My Tasks
  - Deal timeline in CRM
  - Linked CRM entities

#### ✅ Configuration Notes:
- Custom fields `UF_CRM_TAX` and `UF_CRM_CONTRACT` must be added in Bitrix24 settings
- Environment variables required:
  - `VITE_BITRIX_BASE_URL` - Bitrix24 domain REST endpoint
  - `VITE_BITRIX_USER_ID` - User ID for API calls
  - `VITE_BITRIX_WEBHOOK` - Webhook token for authentication
  - `VITE_BITRIX_ADD_TASK_LEGACY` - Legacy task creation endpoint

### Data Validation
1. **Frontend Validation:**
   - React Hook Form with Yup schemas
   - Real-time validation feedback
   - Client-side email/phone format validation

2. **Backend Validation:**
   - Django REST Framework serializers
   - Custom validation methods
   - Email uniqueness enforcement
   - Password strength validation

---

## 🗃️ Models & Database Schema

### User App Models

**User Model:**
```python
class User(AbstractUser):
    username = None  # Disabled
    email = EmailField(unique=True)           # Primary login field
    first_name = CharField(max_length=100)    # User first name
    last_name = CharField(max_length=100)     # User last name
    date_joined = DateTimeField(auto_now_add=True)
    last_login = DateTimeField(null=True, blank=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
```

**Profile Model:**
```python
class Profile(Model):
    user = OneToOneField(User)                # 1:1 with User
    profile_image = ImageField(upload_to='profile_images/')
    birth_date = DateField(blank=True, null=True)
    bio = TextField(blank=True, null=True)
    phone = CharField(max_length=15, blank=True, null=True)
    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)
```

### Bitrix App Models

**BitrixContact Model:**
```python
class BitrixContact(Model):
    name = CharField(max_length=255, blank=True, null=True)
    last_name = CharField(max_length=255, blank=True, null=True)
    email = EmailField(unique=True)           # Required, unique constraint
    phone = CharField(max_length=20, blank=True, null=True)
    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['last_name', 'name']
```

### Database Relationships
```
User (1) ──────── (1) Profile
    │
    └── (authentication & profile data)

BitrixContact (standalone)
    │
    └── (synced with external Bitrix24 CRM)
```

---

## 🔄 Data Flow

### User Registration Flow
```
Frontend Form → Validation → API Call → Django Serializer → 
User Creation → Profile Creation → JWT Generation → 
Token Storage → Profile Redirect
```

### Profile Update Flow
```
Frontend Form → Image Preview → FormData Creation → API Call → 
Django Serializer → Model Update → File Storage → 
Response → State Update → Success Message
```

### Bitrix Contact Creation Flow
```
Frontend Form → Validation → API Call → Django Serializer → 
Database Save → Bitrix24 API Call → External CRM Sync → 
Response → Contact List Refresh → Success Notification
```

### Authentication Token Flow
```
Login → JWT Generation → Token Storage → API Requests → 
Token Validation → Auto Refresh → Expired Token → 
Refresh Attempt → Success/Logout
```

---

## 📌 Important Notes

### Security Considerations
- **JWT Tokens:** Access tokens are short-lived (60 min), refresh tokens rotate
- **CORS Configuration:** Specific origins allowed, not wildcard in production
- **File Uploads:** Profile images stored in media directory with validation
- **Password Validation:** Django's built-in validators enforced
- **API Authentication:** All endpoints except auth require JWT tokens

### Development Setup Requirements
- **Backend:** Python 3.8+, Django 5.2+, PostgreSQL recommended
- **Frontend:** Node.js 16+, React 18, Vite for bundling
- **Environment Variables:** Required for database, JWT secrets, Bitrix24 config
- **Media Files:** Django handles file uploads, needs writable media directory

### Bitrix24 Integration Notes
- **API Configuration:** Requires Bitrix24 domain, user ID, and API token
- **Rate Limiting:** External API calls may have rate limits
- **Error Handling:** Contact creation continues even if Bitrix sync fails
- **Sync Command:** Run `python manage.py sync_bitrix_contacts` for bulk import

### Known Limitations
- **Update/Delete Restrictions:** Bitrix contacts can only be created, not modified
- **File Storage:** Uses local file system (consider cloud storage for production)
- **Token Storage:** localStorage used (consider httpOnly cookies for enhanced security)
- **Mobile UI:** Responsive but could benefit from native app consideration

### Deployment Considerations
- **Static Files:** Collect static files for production
- **Media Files:** Configure proper media serving
- **Environment Variables:** Use proper secret management
- **Database Migrations:** Run migrations in production
- **CORS Settings:** Restrict to production domains
- **SSL/HTTPS:** Required for secure token transmission

### Testing Notes
- **Backend Tests:** Placeholder files exist, need implementation
- **Frontend Testing:** No test framework configured yet
- **API Testing:** Swagger/ReDoc available for manual testing
- **Management Commands:** Support dry-run mode for safe testing

### Maintenance Tasks
- **Token Cleanup:** Implement periodic cleanup of blacklisted tokens
- **Media Cleanup:** Clean up orphaned profile images
- **Log Rotation:** Configure proper logging in production
- **Backup Strategy:** Regular database and media file backups
- **Monitoring:** Implement API monitoring and error tracking

---

## 🔧 Environment Configuration

### Backend Environment Variables (.env)
```bash
SECRET_KEY=your-django-secret-key
DEBUG=True
DB_ENGINE=django.db.backends.postgresql
DB_NAME=reyada_tasks
DB_HOST=localhost
DB_PORT=5432
DB_USER=your-db-user
DB_PASSWORD=your-db-password
BITRIX24_DOMAIN=your-domain.bitrix24.com
BITRIX24_USER_ID=1
BITRIX24_TOKEN=your-bitrix-token
```

### Frontend Configuration
- **Vite Config:** Hot reload, proxy setup
- **Tailwind:** Utility-first CSS framework
- **API Base URL:** Configurable in `api.js`

This documentation provides a comprehensive overview of the ReyadaTasks application architecture, functionality, and development considerations for seamless project handover and maintenance.
