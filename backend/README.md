# Stack Bloom Verse Backend

A Node.js/Express backend for the Stack Bloom Verse Q&A platform with MongoDB database.

## 🚀 Features

- **User Authentication** - Firebase integration with JWT tokens
- **Questions & Answers** - Full CRUD operations with voting system
- **User Management** - Profiles, reputation, and statistics
- **Admin Panel** - User moderation, content management, and analytics
- **Real-time Notifications** - Socket.io integration
- **Search & Filtering** - Advanced search with tags and filters
- **Content Moderation** - Report system and admin controls

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Firebase project (for authentication)

## 🛠️ Installation

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the backend directory:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:8080

   # Database
   MONGODB_URI=mongodb://localhost:27017/stack-bloom-verse

   # JWT Secret
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

   # Admin Credentials
   ADMIN_EMAIL=admin@qa-platform.com
   ADMIN_PASSWORD=admin123

   # Email Configuration (optional)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password

   # Cloudinary (optional)
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

3. **Start MongoDB:**
   ```bash
   # Local MongoDB
   mongod
   
   # Or use MongoDB Atlas (cloud)
   # Update MONGODB_URI in .env
   ```

4. **Run the server:**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Questions
- `GET /api/questions` - Get all questions (with filters)
- `GET /api/questions/:id` - Get single question
- `POST /api/questions` - Create new question
- `PUT /api/questions/:id` - Update question
- `DELETE /api/questions/:id` - Delete question
- `POST /api/questions/:id/vote` - Vote on question
- `GET /api/questions/tags/popular` - Get popular tags

### Answers
- `GET /api/answers/question/:questionId` - Get answers for question
- `POST /api/answers` - Create new answer
- `PUT /api/answers/:id` - Update answer
- `DELETE /api/answers/:id` - Delete answer
- `POST /api/answers/:id/vote` - Vote on answer
- `POST /api/answers/:id/accept` - Accept answer

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/:id` - Get public user profile
- `GET /api/users/:id/questions` - Get user's questions
- `GET /api/users/:id/answers` - Get user's answers

### Admin
- `GET /api/admin/dashboard` - Get admin dashboard stats
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/ban` - Ban/unban user
- `PUT /api/admin/users/:id/role` - Change user role
- `GET /api/admin/questions` - Get reported questions
- `PUT /api/admin/questions/:id/moderate` - Moderate question
- `GET /api/admin/answers` - Get reported answers
- `PUT /api/admin/answers/:id/moderate` - Moderate answer
- `GET /api/admin/stats` - Get detailed stats

### Notifications
- `GET /api/notifications` - Get user notifications
- `GET /api/notifications/unread-count` - Get unread count
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification

## 🔧 Database Models

### User
- Firebase UID integration
- Profile information (name, email, bio, avatar)
- Reputation system
- Admin privileges
- Ban system
- Statistics tracking

### Question
- Title, content, and tags
- Author reference
- Voting system (upvotes/downvotes)
- View tracking
- Solved status
- Report system

### Answer
- Content and question reference
- Author reference
- Voting system
- Accepted status
- Report system

### Notification
- Recipient and sender
- Different types (answer, vote, accept, admin)
- Read status
- Question/answer references

## 🔐 Authentication

The backend uses Firebase Authentication with JWT tokens:

1. User authenticates with Firebase on frontend
2. Frontend sends Firebase UID to backend
3. Backend creates/retrieves user and generates JWT
4. JWT used for subsequent API calls

## 🚨 Security Features

- JWT token authentication
- Rate limiting
- Input validation
- CORS configuration
- Helmet security headers
- Admin role verification
- Content moderation

## 📊 Real-time Features

Socket.io integration for:
- Real-time notifications
- Live updates
- User presence

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Health check
curl http://localhost:5000/api/health
```

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Environment Variables for Production
- Set `NODE_ENV=production`
- Use strong `JWT_SECRET`
- Configure MongoDB Atlas
- Set up proper CORS origins

## 📝 API Documentation

### Request Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### Response Format
```json
{
  "success": true,
  "data": {},
  "message": "Success message"
}
```

### Error Format
```json
{
  "error": "Error message",
  "details": "Additional details"
}
```

## 🔗 Frontend Integration

The backend is designed to work with the React frontend:

1. Frontend makes API calls to backend endpoints
2. JWT tokens stored in localStorage
3. Real-time updates via Socket.io
4. Firebase auth integration

## 📞 Support

For issues and questions:
1. Check the API documentation
2. Review error logs
3. Verify environment variables
4. Ensure MongoDB is running

## 🎯 Next Steps

- [ ] Add comprehensive testing
- [ ] Implement file uploads
- [ ] Add email notifications
- [ ] Enhance search functionality
- [ ] Add analytics tracking
- [ ] Implement caching
- [ ] Add API rate limiting per user 