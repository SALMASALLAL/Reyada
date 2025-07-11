# ReyadaTasks - Full-Stack User Management System

A modern full-stack web application featuring Django REST API backend with React.js frontend for complete user authentication and profile management.

## 🌟 Overview

ReyadaTasks is a comprehensive user management system that demonstrates modern web development practices with:
- **Backend**: Django REST Framework with JWT authentication
- **Frontend**: React.js with modern hooks, routing, and form validation
- **Database**: PostgreSQL (production ready)
- **Styling**: Tailwind CSS for responsive, modern UI
- **Authentication**: Secure JWT tokens with automatic refresh
- **File Uploads**: Profile image management with Django media handling

## 🚀 Quick Start

### Prerequisites
- Python 3.8+ installed
- Node.js 16+ and npm/pnpm installed
- Git for version control

### 1. Backend Setup (Django REST API)
```bash
# Clone the repository
git clone <repository-url>
cd ReyadaTasks

# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Run database migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Start development server
python manage.py runserver
```
**Backend will be available at: http://localhost:8000**

### 2. React Frontend Setup (Recommended)
```bash
# Open new terminal and navigate to React frontend
cd ReactFrontend

# Install dependencies
npm install
# or
pnpm install

# Start development server
npm run dev
# or
pnpm run dev
```
**Frontend will be available at: http://localhost:3000**

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
├── README.md                         # This comprehensive guide
├── .gitignore                        # Git ignore rules
├── start_frontend.bat               # Windows React startup script
│
├── backend/                          # Django REST API
│   ├── manage.py                    # Django management script
│   ├── requirements.txt             # Python dependencies
│   ├── media/                       # User uploaded files
│   │   └── profile_images/          # Profile pictures
│   ├── ReyadaTasks/                 # Django project settings
│   │   ├── __init__.py
│   │   ├── settings.py              # CORS, JWT, database config
│   │   ├── urls.py                  # Main URL routing
│   │   ├── wsgi.py                  # WSGI application
│   │   └── asgi.py                  # ASGI application
│   └── user/                        # User authentication app
│       ├── models.py                # User & Profile models
│       ├── serializers.py           # DRF serializers
│       ├── views.py                 # ViewSet-based API endpoints
│       ├── urls.py                  # User app URL patterns
│       ├── admin.py                 # Django admin configuration
│       ├── apps.py                  # App configuration
│       ├── tests.py                 # Unit tests
│       ├── README.md                # User app documentation
│       └── migrations/              # Database migrations
│           ├── 0001_initial.py
│           └── 0002_alter_user_managers.py
│
└── ReactFrontend/                    # React.js Frontend
    ├── package.json                 # Node.js dependencies & scripts
    ├── pnpm-lock.yaml              # PNPM lock file
    ├── vite.config.js               # Vite configuration
    ├── tailwind.config.js           # Tailwind CSS configuration
    ├── postcss.config.js            # PostCSS configuration
    ├── .eslintrc.cjs               # ESLint configuration
    ├── .gitignore                   # Frontend git ignore
    ├── index.html                   # HTML entry point
    ├── README.md                    # React-specific documentation
    └── src/                         # React source code
        ├── main.jsx                 # React entry point
        ├── App.jsx                  # Main App component
        ├── index.css                # Global styles & Tailwind
        ├── components/              # Reusable React components
        │   ├── Input.jsx            # Form input component
        │   ├── Navbar.jsx           # Navigation component
        │   └── ProtectedRoute.jsx   # Route protection component
        ├── pages/                   # Page components
        │   ├── LoginPage.jsx        # User login page
        │   ├── RegisterPage.jsx     # User registration page
        │   └── ProfilePage.jsx      # User profile management
        ├── context/                 # React Context providers
        │   └── AuthContext.jsx      # Authentication state management
        └── services/                # API integration
            └── api.js               # Axios configuration & API calls
```

## 🛠️ Technology Stack

### Backend Technologies
- **Django 5.2** - Python web framework
- **Django REST Framework** - RESTful API toolkit
- **Simple JWT** - JWT authentication for Django
- **Django CORS Headers** - Cross-Origin Resource Sharing
- **Pillow** - Python imaging library for file uploads
- **SQLite** - Default database (development)
- **PostgreSQL** - Production database support
- **drf-yasg** - Swagger/OpenAPI documentation

### Frontend Technologies
- **React 18** - Modern JavaScript library
- **Vite** - Fast build tool and dev server
- **React Router DOM** - Client-side routing
- **Axios** - Promise-based HTTP client
- **React Hook Form** - Performant forms with validation
- **Yup** - Schema validation library
- **Tailwind CSS** - Utility-first CSS framework
- **React Hot Toast** - Toast notifications
- **PostCSS & Autoprefixer** - CSS processing

### Development Tools
- **ESLint** - JavaScript linting
- **PNPM** - Fast package manager
- **VS Code** - Recommended IDE
- **Git** - Version control

## 🎯 Project Features & Highlights

### Architecture Highlights
- **Separation of Concerns**: Clear separation between backend API and frontend client
- **Modern React Patterns**: Hooks, Context API, and functional components
- **RESTful API Design**: Standard HTTP methods and status codes
- **Token-Based Auth**: Stateless JWT authentication with refresh capabilities
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Performance**: Optimized bundle size and lazy loading capabilities

### Code Quality Features
- **Type Safety**: PropTypes and consistent data flow
- **Form Validation**: Schema-based validation with Yup
- **Code Splitting**: Optimized build with Vite
- **Modern Tooling**: ESLint, Prettier, and development hot reload
- **Security Best Practices**: XSS protection, CSRF tokens, secure headers

### User Experience Features
- **Intuitive Navigation**: Clear user flows and feedback
- **Loading States**: Smooth transitions and loading indicators
- **Error Messages**: Clear, actionable error messages
- **Responsive Design**: Works seamlessly on all device sizes
- **Accessibility**: Semantic HTML and keyboard navigation support

## 🔧 Development Tools & Scripts

### Package.json Scripts (React)
```json
{
  "scripts": {
    "dev": "vite",                    // Start development server
    "build": "vite build",            // Build for production
    "lint": "eslint . --ext js,jsx",  // Lint JavaScript files
    "preview": "vite preview"         // Preview production build
  }
}
```

### Django Management Commands
```bash
# Database management
python manage.py makemigrations    # Create new migrations
python manage.py migrate           # Apply migrations
python manage.py showmigrations    # Show migration status

# User management
python manage.py createsuperuser   # Create admin user
python manage.py changepassword    # Change user password

# Development
python manage.py runserver         # Start development server
python manage.py shell            # Interactive Django shell
python manage.py collectstatic    # Collect static files
```

### Git Workflow
```bash
# Feature development
git checkout -b feature/new-feature
git add .
git commit -m "Add new feature"
git push origin feature/new-feature

# Code review and merge
# Create pull request on GitHub
# Review and merge to main branch
```

## 📚 Learning Resources

### Django & DRF
- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Django JWT Authentication](https://django-rest-framework-simplejwt.readthedocs.io/)

### React & Modern JavaScript
- [React Documentation](https://react.dev/)
- [React Router](https://reactrouter.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Tailwind CSS](https://tailwindcss.com/)

### Development Tools
- [Vite Documentation](https://vitejs.dev/)
- [Axios Documentation](https://axios-http.com/)
- [PNPM](https://pnpm.io/)

## 🤝 Contributing

### Getting Started
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Code Style Guidelines
- **Python**: Follow PEP 8 conventions
- **JavaScript**: Use ESLint configuration
- **Git Commits**: Use conventional commit messages
- **Documentation**: Update README for significant changes

### Testing
- Write unit tests for new backend features
- Test React components with user interactions
- Ensure API endpoints work correctly
- Verify responsive design across devices

## 📞 Support & Contact

### Getting Help
1. **Check Documentation**: Review this README and inline code comments
2. **Search Issues**: Look through existing GitHub issues
3. **Django Admin**: Use the admin panel for data inspection
4. **API Documentation**: Test endpoints with Swagger UI

### Reporting Issues
When reporting bugs, please include:
- Operating system and version
- Python and Node.js versions
- Steps to reproduce the issue
- Error messages and stack traces
- Screenshots if applicable

### Feature Requests
- Describe the feature and its benefits
- Provide use cases and examples
- Consider backward compatibility
- Discuss implementation approach

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Django Team** - For the excellent web framework
- **React Team** - For the powerful UI library
- **Django REST Framework** - For making API development simple
- **Tailwind CSS** - For the utility-first CSS framework
- **Open Source Community** - For the amazing tools and libraries

---

**ReyadaTasks** demonstrates modern full-stack development practices with Django and React, providing a solid foundation for building scalable web applications with user authentication and profile management.

*Happy coding! 🚀*