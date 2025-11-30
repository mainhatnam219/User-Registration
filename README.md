# User Registration System

A full-stack user authentication system built with NestJS, React, PostgreSQL, and Aiven.

##  Quick Start

### Prerequisites
- Node.js 18+
- npm

### Setup (2 steps)

**Terminal 1 - Backend:**
```bash
cd backend
npm install
cp .env.example .env
npm run build
npm run migration:run
npm run db:seed
npm run start:dev
```
Backend runs on `http://localhost:3000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
Frontend runs on `http://localhost:3001`

## Test It Out

1. Go to `http://localhost:3001`
2. **Sign Up** with any email/password
3. **Login** with the same credentials
4. Check **Browser Console** (F12) for detailed logs
5. Check **Backend Terminal** for database query logs

## Available Commands

### Backend
```bash
cd backend
npm run start:dev         # Dev server with hot reload
npm run build             # Build TypeScript
npm run migration:run     # Run database migrations
npm run migration:show    # View migration status
npm run db:seed           # Seed with example users
npm run start:prod        # Production mode
```

### Frontend
```bash
cd frontend
npm run dev               # Dev server
npm run build             # Build for production
npm run preview           # Preview production build
```

##  What's Included

### Backend
- **NestJS 10** - REST API framework
- **TypeORM** - Database ORM with migrations
- **PostgreSQL** (Aiven) - Cloud database
- **bcryptjs** - Password hashing
- **TypeScript** - Type-safe development

### Frontend
- **React 18** - UI library
- **Vite** - Lightning-fast build tool
- **React Router** - Page navigation
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Query** - Data fetching
- **React Hook Form** - Form management

### Database
- Aiven PostgreSQL with SSL
- UUID primary keys
- Bcrypt-hashed passwords
- Timestamps for user creation

## Features

### API Endpoints
- `POST /user/register` - Create new account
- `POST /user/login` - Login with email/password

### Pages
- `/` - Home page
- `/signup` - Registration form
- `/login` - Login form

### Logging
**Frontend Console Logs:**
- `[SIGNUP]` - Registration form actions
- `[LOGIN]` - Login form actions
- Shows input changes, validation, and API calls

**Backend Logs:**
- Database queries (SELECT, INSERT, etc.)
- Connection status
- Errors and warnings

## Troubleshooting

### Backend won't start
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
npm run start:dev
```

### Frontend won't connect to backend
- Verify backend is running on port 3000
- Check `frontend/.env` has `VITE_API_URL=http://localhost:3000`
- Check browser console for CORS errors

### Database connection failed
- Ensure internet connection (Aiven cloud DB)
- Verify `.env` has correct database credentials
- Check if your IP is not blocked by firewall

## Example Users (After Seeding)

| Email | Password |
|-------|----------|
| user1@example.com | password123 |
| user2@example.com | password456 |
| admin@example.com | adminpass123 |

## Deployment

### Deploy Backend (Railway/Render)
1. Push to GitHub
2. Create project on Railway/Render
3. Connect PostgreSQL database
4. Set environment variables (DATABASE_URL, etc.)
5. Build: `npm run build`
6. Start: `npm run start:prod`

### Deploy Frontend (Vercel)
1. Push to GitHub
2. Import on Vercel
3. Set root directory to `frontend`
4. Add `VITE_API_URL=your-backend-url.railway.app`
5. Deploy!

## Security Features

- Passwords hashed with bcryptjs (10 salt rounds)
- Unique email validation
- SSL/TLS database connection (Aiven)
- CORS enabled for frontend
- Environment variables for sensitive data

## Project Structure

```
User-Registration/
├── backend/
│   ├── src/
│   │   ├── user/           # User module (controller, service, entity)
│   │   ├── database/       # Migrations and seeds
│   │   ├── config/         # Database config
│   │   └── main.ts         # App bootstrap
│   ├── data-source.ts      # TypeORM configuration
│   ├── package.json        # Dependencies
│   └── .env                # Database credentials
│
├── frontend/
│   ├── src/
│   │   ├── pages/          # React pages (Login, SignUp, Home)
│   │   ├── components/     # Reusable components
│   │   ├── api/            # API client
│   │   └── main.tsx        # App entry
│   ├── package.json        # Dependencies
│   └── .env                # API URL
│
└── README.md               # This file
```

## 📝 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
```

## 🔄 Development Workflow

1. **Make changes** to backend/frontend code
2. **Auto-reload** happens in dev mode
3. **Check logs** in terminal (backend) and console (frontend)
4. **Test** the changes in browser
5. **Commit** and push to GitHub

## 📞 API Response Examples

### Register Success
```json
{
  "id": "uuid-here",
  "email": "test@example.com",
  "createdAt": "2024-01-15T10:30:00Z",
  "message": "User registered successfully"
}
```

### Login Success
```json
{
  "id": "uuid-here",
  "email": "test@example.com",
  "createdAt": "2024-01-15T10:30:00Z",
  "message": "Login successful"
}
```

### Error Response
```json
{
  "statusCode": 409,
  "message": "Email already registered",
  "error": "Conflict"
}
```

## Next Steps

- Add JWT authentication tokens
- Implement password reset
- Add email verification
- Create user profile page
- Add avatar uploads
- Implement two-factor authentication

## Useful Links

- [NestJS Docs](https://docs.nestjs.com)
- [React Docs](https://react.dev)
- [TypeORM Docs](https://typeorm.io)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite Guide](https://vitejs.dev)



---

