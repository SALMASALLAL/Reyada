# ReyadaTasks - Frontend & Backend Integration Guide

## 🚀 Quick Start

### 1. Backend Setup (Django REST API)
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### 2. React Frontend Setup (Recommended)
```bash
cd ReactFrontend
npm install
npm run dev
```
**Access the app at: http://localhost:3000**

### 3. Alternative: HTML Frontend
Open any of these files in your browser:
- `frontend/index.html` - Main landing page
- `frontend/integrated_signup.html` - Sign up page
- `frontend/integrated_login.html` - Login page
- `frontend/dashboard.html` - User dashboard

### 4. Using Startup Scripts
**Windows:**
- `start_frontend.bat` - Start React frontend
- `start_server.bat` - Start Django backend

## 📁 Project Structure

```
ReyadaTasks/
├── backend/                          # Django REST API
│   ├── ReyadaTasks/                 # Project settings
│   │   ├── settings.py              # CORS & JWT configured
│   │   ├── urls.py                  # API routing
│   │   └── ...
│   ├── user/                        # User app
│   │   ├── models.py                # User & Profile models
│   │   ├── serializers.py           # API serializers
│   │   ├── views.py                 # API endpoints
│   │   ├── urls.py                  # User routes
│   │   └── ...
│   ├── manage.py
│   └── requirements.txt
├── ReactFrontend/                    # React Frontend (Recommended)
│   ├── src/
│   │   ├── components/              # Reusable components
│   │   ├── pages/                   # Login, Register, Profile pages
│   │   ├── context/                 # Auth context
│   │   └── services/                # API integration
│   ├── package.json
│   └── README.md                    # React-specific documentation
├── frontend/                         # HTML/CSS/JS frontend (Legacy)
│   ├── index.html                   # Landing page
│   ├── integrated_login.html        # Login system
│   ├── integrated_signup.html       # Registration system
│   ├── dashboard.html               # User dashboard
│   ├── task1.html                   # Original demo (enhanced)
│   ├── task12.html                  # Enhanced demo
│   └── README.md                    # Frontend documentation
├── start_server.bat                 # Windows startup script
└── README.md                        # This file
```

## 🔧 Features Implemented

### Backend API Endpoints
- `POST /api/auth/users/` - User registration
- `POST /api/auth/users/login/` - User login
- `POST /api/auth/users/logout/` - User logout
- `GET /api/auth/users/profile/` - Get user profile
- `PATCH /api/auth/users/update_profile/` - Update profile
- `PUT /api/auth/users/change_password/` - Change password
- `POST /api/auth/token/refresh/` - Refresh JWT token

### Frontend Features
- ✅ User registration with validation
- ✅ Secure login/logout
- ✅ Profile management
- ✅ Password change
- ✅ Token-based authentication
- ✅ Responsive design
- ✅ Error handling
- ✅ Loading states
- ✅ Session persistence

## 🔐 Security Features

### JWT Authentication
- Access tokens (1 hour expiry)
- Refresh tokens (7 days expiry)
- Token rotation on refresh
- Token blacklisting on logout

### CORS Configuration
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5500",
    "http://127.0.0.1:5500",
]
```

### Password Security
- Django's built-in password validation
- Secure password change workflow
- Password confirmation on registration

## 📱 Frontend Pages Overview

### 1. Index Page (`index.html`)
- Project overview and navigation
- Server status indicator
- Quick links to all features
- Responsive welcome interface

### 2. Registration Page (`integrated_signup.html`)
- Complete signup form
- Real-time password validation
- Automatic login after registration
- Profile display after success

### 3. Login Page (`integrated_login.html`)
- Secure authentication
- Profile dashboard after login
- Profile editing capabilities
- Token management

### 4. Dashboard (`dashboard.html`)
- Comprehensive user interface
- Profile management
- Password change
- Account statistics
- API documentation links

### 5. Demo Pages (Enhanced)
- `task1.html` - Original design with API integration
- `task12.html` - Enhanced UI with API integration

## 🛠️ Development Workflow

### Testing the Integration

1. **Start the backend server**
   ```bash
   cd backend
   python manage.py runserver
   ```

2. **Open frontend in browser**
   - Navigate to `frontend/index.html`
   - Or use Live Server for better development experience

3. **Test user flow**
   - Register a new account
   - Login with credentials
   - Update profile information
   - Change password
   - Logout securely

### Common Development Tasks

**Add new API endpoints:**
1. Create view in `backend/user/views.py`
2. Add URL pattern in `backend/user/urls.py`
3. Update frontend JavaScript to call new endpoint

**Modify frontend styling:**
1. Edit CSS in the `<style>` sections of HTML files
2. Maintain responsive design principles
3. Test across different screen sizes

**Add new features:**
1. Update backend models if needed
2. Create/update serializers
3. Implement API views
4. Add frontend interface
5. Test integration

## 🔍 API Documentation

### Swagger UI
Visit `http://127.0.0.1:8000/swagger/` for interactive API documentation

### ReDoc
Visit `http://127.0.0.1:8000/redoc/` for detailed API documentation

### Admin Panel
Visit `http://127.0.0.1:8000/admin/` for Django admin interface

## 📊 Database Models

### User Model
```python
class User(AbstractUser):
    username = None
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    # Uses email as USERNAME_FIELD
```

### Profile Model
```python
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    profile_image = models.ImageField(upload_to='profile_images/')
    birth_date = models.DateField(blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
```

## 🚨 Troubleshooting

### Common Issues

**CORS Errors:**
- Ensure Django server is running on port 8000
- Check `CORS_ALLOWED_ORIGINS` in `settings.py`
- Use Live Server instead of file:// protocol

**Authentication Issues:**
- Clear browser localStorage
- Check token expiration in network tab
- Verify credentials are correct

**Form Validation Errors:**
- Check required fields are filled
- Ensure password meets Django requirements
- Verify email format is valid

### Debug Steps

1. **Check browser console** (F12) for JavaScript errors
2. **Check network tab** for API request/response details
3. **Check Django server logs** for backend errors
4. **Verify database** using Django admin panel

## 🎯 Next Steps

### Potential Enhancements
- File upload for profile pictures
- Email verification system
- Password reset via email
- Social media authentication
- Real-time notifications
- Mobile app integration

### Production Deployment
- Configure production settings
- Set up proper CORS for production domain
- Use environment variables for secrets
- Implement proper logging
- Set up database backups

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review browser console errors
3. Check Django server logs
4. Verify API endpoints in Swagger documentation

---

This integration provides a complete, production-ready system that demonstrates modern web development practices with Django REST Framework and vanilla JavaScript frontend.
#   R e y a d a  
 