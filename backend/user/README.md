# User App ViewSet Implementation

This document describes the ViewSet-based implementation of the user authentication system.

## ViewSets

### UserViewSet
The main ViewSet that handles all user-related operations.

**Base URL:** `/api/users/`

#### Available Endpoints:

1. **User Registration**
   - **URL:** `POST /api/users/`
   - **Description:** Register a new user
   - **Permission:** AllowAny
   - **Serializer:** UserRegistrationSerializer

2. **User Login**
   - **URL:** `POST /api/users/login/`
   - **Description:** Authenticate user and get JWT tokens
   - **Permission:** AllowAny
   - **Serializer:** CustomTokenObtainPairSerializer

3. **User Logout**
   - **URL:** `POST /api/users/logout/`
   - **Description:** Logout user by blacklisting refresh token
   - **Permission:** IsAuthenticated

4. **Get User Profile**
   - **URL:** `GET /api/users/profile/`
   - **Description:** Get current user's profile information
   - **Permission:** IsAuthenticated
   - **Serializer:** UserDetailSerializer

5. **Update User Profile**
   - **URL:** `PUT/PATCH /api/users/update_profile/`
   - **Description:** Update user profile information
   - **Permission:** IsAuthenticated
   - **Serializer:** ProfileUpdateSerializer

6. **Change Password**
   - **URL:** `PUT /api/users/change_password/`
   - **Description:** Change user password
   - **Permission:** IsAuthenticated
   - **Serializer:** ChangePasswordSerializer

7. **List Users** (Admin only)
   - **URL:** `GET /api/users/`
   - **Description:** List all users (inherited from ModelViewSet)
   - **Permission:** IsAuthenticated

8. **Get User Detail** (Admin only)
   - **URL:** `GET /api/users/{id}/`
   - **Description:** Get specific user details
   - **Permission:** IsAuthenticated

### ProfileViewSet
A separate ViewSet for managing user profiles.

**Base URL:** `/api/profiles/`

#### Available Endpoints:

1. **List User Profiles**
   - **URL:** `GET /api/profiles/`
   - **Description:** List profiles (filtered to current user)
   - **Permission:** IsAuthenticated

2. **Create Profile**
   - **URL:** `POST /api/profiles/`
   - **Description:** Create a new profile
   - **Permission:** IsAuthenticated

3. **Get Profile Detail**
   - **URL:** `GET /api/profiles/{id}/`
   - **Description:** Get specific profile details
   - **Permission:** IsAuthenticated

4. **Update Profile**
   - **URL:** `PUT/PATCH /api/profiles/{id}/`
   - **Description:** Update profile information
   - **Permission:** IsAuthenticated

5. **Delete Profile**
   - **URL:** `DELETE /api/profiles/{id}/`
   - **Description:** Delete profile
   - **Permission:** IsAuthenticated

## Additional Endpoints

- **Token Refresh:** `POST /api/token/refresh/`
- **Legacy Profile Detail:** `GET /api/profile/detail/` (for backward compatibility)

## Benefits of ViewSet Implementation

1. **Consistent API Structure:** ViewSets provide a standardized way to handle CRUD operations
2. **Automatic URL Generation:** Router automatically generates URLs for standard operations
3. **Flexible Actions:** Custom actions can be added using the `@action` decorator
4. **Permission Management:** Dynamic permission handling based on actions
5. **Serializer Selection:** Different serializers can be used for different actions
6. **Code Reusability:** Less code duplication compared to individual class-based views

## Usage Examples

### Registration
```json
POST /api/users/
{
    "email": "user@example.com",
    "password": "securepassword123",
    "password_confirm": "securepassword123",
    "first_name": "John",
    "last_name": "Doe"
}
```

### Login
```json
POST /api/users/login/
{
    "email": "user@example.com",
    "password": "securepassword123"
}
```

### Update Profile
```json
PUT /api/users/update_profile/
{
    "first_name": "Jane",
    "last_name": "Smith",
    "bio": "Updated bio",
    "phone": "+1234567890"
}
```

### Change Password
```json
PUT /api/users/change_password/
{
    "old_password": "oldpassword123",
    "new_password": "newpassword123",
    "new_password_confirm": "newpassword123"
}
```
