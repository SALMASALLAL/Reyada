# Reyada Tasks - React Frontend

A modern React frontend application that integrates with the Django REST API backend for user authentication and profile management.

## 🚀 Features

- **User Authentication**: Login and registration with JWT tokens
- **Profile Management**: View and edit user profiles with image uploads
- **Password Management**: Secure password change functionality
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Protected Routes**: Route protection based on authentication status
- **Form Validation**: Client-side validation with React Hook Form and Yup
- **Toast Notifications**: User feedback with react-hot-toast
- **Token Management**: Automatic token refresh and logout on expiration

## 🛠️ Tech Stack

- **React 18** - Modern React with hooks
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client with interceptors
- **React Hook Form** - Form management and validation
- **Yup** - Schema validation
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server
- **React Hot Toast** - Toast notifications

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   ├── Input.jsx       # Form input component
│   ├── Navbar.jsx      # Navigation component
│   └── ProtectedRoute.jsx  # Route protection
├── context/
│   └── AuthContext.jsx # Authentication context
├── pages/              # Page components
│   ├── LoginPage.jsx   # Login form
│   ├── RegisterPage.jsx # Registration form
│   └── ProfilePage.jsx # User profile management
├── services/
│   └── api.js         # API client configuration
├── App.jsx            # Main app component
├── main.jsx          # App entry point
└── index.css         # Global styles with Tailwind
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Django backend running on http://localhost:8000

### Installation

1. **Navigate to the frontend directory**
   ```bash
   cd ReactFrontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔧 Configuration

### API Configuration

The API base URL is configured in `src/services/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:8000/api'
```

### Backend API Endpoints

The frontend integrates with these Django backend endpoints:

- `POST /api/users/` - User registration
- `POST /api/users/login/` - User login
- `POST /api/users/logout/` - User logout
- `GET /api/users/profile/` - Get user profile
- `PATCH /api/users/update_profile/` - Update profile
- `POST /api/token/refresh/` - Refresh JWT token

## 🔐 Authentication Flow

### Registration
1. User fills registration form
2. Form validates client-side with Yup schema
3. POST request to `/api/users/`
4. On success: tokens stored, user redirected to profile

### Login
1. User enters email/password
2. POST request to `/api/users/login/`
3. JWT tokens stored in localStorage
4. User profile fetched and stored
5. Redirect to profile page

### Token Management
- Access tokens automatically added to requests
- Refresh tokens used to get new access tokens
- Automatic logout on token expiration
- Token cleanup on manual logout

## 🎨 Styling

The app uses Tailwind CSS with custom utility classes:

- `.btn-primary` - Primary button styles
- `.btn-secondary` - Secondary button styles
- `.input-field` - Form input styles
- `.card` - Card container styles
- `.error-text` - Error message styles

## 📱 Pages Overview

### Login Page (`/login`)
- Email and password fields
- Form validation
- Automatic redirect if already authenticated
- Link to registration page

### Registration Page (`/register`)
- First name, last name, email, password fields
- Password confirmation validation
- Auto-login after successful registration
- Link to login page

### Profile Page (`/profile`)
- Protected route (requires authentication)
- View profile information
- Edit profile with image upload
- Change password functionality
- Responsive layout with sidebar and main content

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Token Refresh**: Automatic token renewal
- **Protected Routes**: Route-level access control
- **Form Validation**: Client-side input validation
- **XSS Protection**: React's built-in XSS protection
- **Secure Storage**: Tokens stored in localStorage (consider httpOnly cookies for production)

## 🚀 Production Deployment

### Build for Production

```bash
npm run build
```

### Environment Variables

Create a `.env` file for production:

```
VITE_API_BASE_URL=https://your-api-domain.com/api
```

Update `src/services/api.js`:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
```

### Deployment Options

- **Vercel**: `npm run build` then deploy `dist` folder
- **Netlify**: Connect GitHub repo, auto-deploy on push
- **GitHub Pages**: Use `gh-pages` package
- **AWS S3**: Upload `dist` folder to S3 bucket

## 🐛 Troubleshooting

### Common Issues

**CORS Errors:**
- Ensure Django backend CORS settings include your frontend URL
- Check that backend is running on port 8000

**Authentication Issues:**
- Clear localStorage: `localStorage.clear()`
- Check browser network tab for API responses
- Verify backend JWT settings

**Build Errors:**
- Clear node_modules: `rm -rf node_modules && npm install`
- Check for missing dependencies
- Verify Node.js version compatibility

### Debug Mode

Add this to localStorage for debug info:
```javascript
localStorage.setItem('debug', 'true')
```

## 🔄 Integration with Backend

### User Registration Flow
```
Frontend → POST /api/users/ → Backend
Backend → Returns user + tokens → Frontend
Frontend → Stores tokens → Redirects to profile
```

### Profile Update with Image
```
Frontend → FormData with image → PATCH /api/users/update_profile/
Backend → Processes image → Returns updated user
Frontend → Updates local state → Shows success message
```

## 📚 API Integration Examples

### Making Authenticated Requests

```javascript
import api from '../services/api'

// The axios instance automatically adds auth headers
const response = await api.get('/users/profile/')
```

### Handling File Uploads

```javascript
const formData = new FormData()
formData.append('profile_image', file)
formData.append('first_name', 'John')

const response = await api.patch('/users/update_profile/', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
})
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙋‍♂️ Support

For issues or questions:
1. Check the troubleshooting section
2. Review browser console for errors
3. Check network tab for API responses
4. Ensure backend is running and accessible
