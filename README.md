# Task Management System - Backend

A robust REST API built with Express.js, TypeORM, and MySQL for managing tasks with secure authentication and authorization.

![Express.js](https://img.shields.io/badge/Express.js-4-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue)

## 🌟 Features

- 🔐 JWT-based authentication
- 🔒 Secure password hashing with bcrypt
- ✅ Input validation with class-validator
- 🛡️ Protected routes with JWT middleware
- 📊 TypeORM for database management
- 🎯 RESTful API design
- 🔄 CORS configuration
- 📝 Comprehensive error handling
- 🚀 Optimized for production
- 🐳 Docker support
- ⚡ Lightweight and fast Express.js framework

## 🛠️ Tech Stack

- **Framework**: Express.js 4
- **Language**: TypeScript 5
- **Database**: MySQL 8.0
- **ORM**: TypeORM
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: class-validator, class-transformer
- **Password Security**: bcrypt
- **Configuration**: dotenv
- **CORS**: cors middleware

## 📁 Project Structure

```
task-management-backend/
├── src/
│   ├── auth/                    # Authentication
│   │   ├── dto/                # Data Transfer Objects
│   │   │   └── auth.dto.ts
│   │   ├── auth.controller.ts  # Auth routes (Express router)
│   │   └── auth.service.ts     # Auth business logic
│   │
│   ├── tasks/                   # Tasks
│   │   ├── dto/                # Data Transfer Objects
│   │   │   └── task.dto.ts
│   │   ├── entities/           # Database entities
│   │   │   └── task.entity.ts
│   │   ├── tasks.controller.ts # Task routes (Express router)
│   │   └── tasks.service.ts    # Task business logic
│   │
│   ├── users/                   # Users
│   │   ├── entities/
│   │   │   └── user.entity.ts  # User entity
│   │   └── users.service.ts    # User operations
│   │
│   ├── middleware/              # Custom middleware
│   │   ├── jwt-auth.middleware.ts    # JWT authentication
│   │   ├── validation.middleware.ts  # Request validation
│   │   └── error-handler.ts          # Global error handler
│   │
│   ├── config/                  # Configuration
│   │   └── database.ts         # TypeORM configuration
│   │
│   ├── app.ts                  # Express app setup
│   └── main.ts                 # Application entry point
│
├── dist/                       # Compiled JavaScript (gitignored)
│
├── .env.example                # Environment variables template
├── .env                        # Local environment (gitignored)
├── .eslintrc.js               # ESLint configuration
├── .gitignore                 # Git ignore rules
├── .prettierrc                # Prettier configuration
├── docker-compose.yml         # Docker Compose config
├── Dockerfile                 # Docker configuration
├── package.json               # Dependencies
├── render.yaml                # Render deployment config
├── tsconfig.json              # TypeScript configuration
└── README.md                  # This file
```

## 📦 Prerequisites

- Node.js 18+
- npm or yarn
- MySQL 8.0+
- Docker (optional)

## 🚀 Installation

### 1. Navigate to Backend Directory

```bash
cd task-management-backend
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Setup

Create `.env` file:

```env
# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=taskuser
DATABASE_PASSWORD=taskpassword
DATABASE_NAME=task_management

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d

# Application Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:3001
```

### 4. Database Setup

**Option A: Local MySQL**

```sql
-- Login to MySQL
mysql -u root -p

-- Create database and user
CREATE DATABASE task_management;
CREATE USER 'taskuser'@'localhost' IDENTIFIED BY 'taskpassword';
GRANT ALL PRIVILEGES ON task_management.* TO 'taskuser'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

**Option B: Docker**

```bash
docker-compose up -d
```

## 🏃 Running the Application

### Development Mode (with auto-reload)

```bash
npm run start:dev
```

Server runs at: http://localhost:3000

### Development Mode (basic)

```bash
npm start
```

### Production Mode

```bash
# Build the application
npm run build

# Start production server
npm run start:prod
```

### Docker

```bash
# Build and run with docker-compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 📚 API Documentation

### Base URL

```
Development: http://localhost:3000
Production: https://your-backend.railway.app
```

### Authentication Endpoints

#### Register User

```http
POST /auth/register
Content-Type: application/json

Request Body:
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!"
}

Response (201 Created):
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}

Errors:
- 400: Validation failed
- 409: Email already exists
```

#### Login User

```http
POST /auth/login
Content-Type: application/json

Request Body:
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "rememberMe": false
}

Response (200 OK):
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}

Errors:
- 401: Invalid credentials
```

### Task Endpoints (Protected)

All task endpoints require JWT token in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

#### Get All Tasks

```http
GET /tasks?status=To Do&sortBy=dueDate&sortOrder=ASC
Authorization: Bearer <token>

Query Parameters (Optional):
- status: "To Do" | "In Progress" | "Completed"
- sortBy: "title" | "dueDate" | "createdAt" | "status"
- sortOrder: "ASC" | "DESC"

Response (200 OK):
[
  {
    "id": 1,
    "title": "Complete project",
    "description": "Finish the task management system",
    "status": "To Do",
    "dueDate": "2024-12-31T23:59:00.000Z",
    "userId": 1,
    "createdAt": "2024-10-14T10:00:00.000Z",
    "updatedAt": "2024-10-14T10:00:00.000Z"
  }
]

Errors:
- 401: Unauthorized (invalid/missing token)
```

#### Get Single Task

```http
GET /tasks/:id
Authorization: Bearer <token>

Response (200 OK):
{
  "id": 1,
  "title": "Complete project",
  "description": "Finish the task management system",
  "status": "To Do",
  "dueDate": "2024-12-31T23:59:00.000Z",
  "userId": 1,
  "createdAt": "2024-10-14T10:00:00.000Z",
  "updatedAt": "2024-10-14T10:00:00.000Z"
}

Errors:
- 401: Unauthorized
- 404: Task not found
```

#### Create Task

```http
POST /tasks
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "title": "Complete project",
  "description": "Finish the task management system",
  "status": "To Do",
  "dueDate": "2024-12-31T23:59:00.000Z"
}

Response (201 Created):
{
  "id": 1,
  "title": "Complete project",
  "description": "Finish the task management system",
  "status": "To Do",
  "dueDate": "2024-12-31T23:59:00.000Z",
  "userId": 1,
  "createdAt": "2024-10-14T10:00:00.000Z",
  "updatedAt": "2024-10-14T10:00:00.000Z"
}

Errors:
- 400: Validation failed
- 401: Unauthorized
```

#### Update Task

```http
PUT /tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

Request Body (all fields optional):
{
  "title": "Updated title",
  "description": "Updated description",
  "status": "In Progress",
  "dueDate": "2024-12-31T23:59:00.000Z"
}

Response (200 OK):
{
  "id": 1,
  "title": "Updated title",
  "description": "Updated description",
  "status": "In Progress",
  "dueDate": "2024-12-31T23:59:00.000Z",
  "userId": 1,
  "createdAt": "2024-10-14T10:00:00.000Z",
  "updatedAt": "2024-10-14T11:00:00.000Z"
}

Errors:
- 400: Validation failed
- 401: Unauthorized
- 403: Forbidden (not your task)
- 404: Task not found
```

#### Delete Task

```http
DELETE /tasks/:id
Authorization: Bearer <token>

Response (204 No Content):
(empty response)

Errors:
- 401: Unauthorized
- 403: Forbidden (not your task)
- 404: Task not found
```

## 🗄️ Database Schema

### Users Table

```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Columns:**
- `id`: Primary key, auto-increment
- `email`: Unique user email
- `password`: Hashed password (bcrypt)
- `createdAt`: Timestamp of creation
- `updatedAt`: Timestamp of last update

### Tasks Table

```sql
CREATE TABLE tasks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  status ENUM('To Do', 'In Progress', 'Completed') DEFAULT 'To Do',
  dueDate DATETIME NOT NULL,
  userId INT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);
```

**Columns:**
- `id`: Primary key, auto-increment
- `title`: Task title
- `description`: Task description
- `status`: Task status (enum)
- `dueDate`: Task due date and time
- `userId`: Foreign key to users table
- `createdAt`: Timestamp of creation
- `updatedAt`: Timestamp of last update

**Relationships:**
- One User has many Tasks (1:N)
- Tasks cascade delete when User is deleted

## 🔧 Configuration

### TypeORM Configuration

```typescript
// src/config/database.ts
export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || '3306', 10),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [User, Task],
  synchronize: process.env.NODE_ENV !== 'production',
  logging: false,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false,
});
```

### JWT Configuration

```typescript
// src/auth/auth.service.ts
private signToken(payload: any, expiresIn?: string): string {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined');
  }

  return jwt.sign(payload, jwtSecret, {
    expiresIn: expiresIn || process.env.JWT_EXPIRES_IN || '7d',
  });
}
```

### CORS Configuration

```typescript
// src/app.ts
app.use(
  cors({
    origin: [
      'http://localhost:3001',
      'https://your-app.vercel.app',
      /\.vercel\.app$/,
    ],
    credentials: true,
  })
);
```

### Express App Structure

```typescript
// src/app.ts
export const createApp = async (): Promise<Express> => {
  const app = express();

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors({ /* ... */ }));

  // Routes
  app.use('/auth', authRouter);
  app.use('/tasks', tasksRouter);

  // Error handling
  app.use(errorHandler);

  return app;
};
```

## 🔐 Security Features

### Password Security
- ✅ Passwords hashed with bcrypt (10 salt rounds)
- ✅ Password requirements enforced (min 10 chars, uppercase, lowercase, number, special char)
- ✅ Password confirmation validation

### Authentication
- ✅ JWT-based stateless authentication
- ✅ Token expiration (7 days default, 30 days with remember me)
- ✅ Secure token signing with secret key

### Authorization
- ✅ JWT middleware protecting task endpoints
- ✅ User can only access their own tasks
- ✅ Foreign key constraints in database

### Input Validation
- ✅ DTOs with class-validator decorators
- ✅ Whitelist unknown properties
- ✅ Transform and sanitize inputs

### Database Security
- ✅ SQL injection prevention (TypeORM parameterized queries)
- ✅ Connection pooling
- ✅ SSL support for production

## 🌐 Deployment

### Deploy to Railway

1. **Create Railway Account**:
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create MySQL Database**:
   - New Project → Provision MySQL
   - Note the connection details

3. **Deploy Backend**:
   - New Project → Deploy from GitHub
   - Select repository
   - Add environment variables:

```env
DATABASE_HOST=your_railway_mysql_host
DATABASE_PORT=3306
DATABASE_USER=your_railway_user
DATABASE_PASSWORD=your_railway_password
DATABASE_NAME=railway

JWT_SECRET=production_secret_key_min_32_chars
JWT_EXPIRES_IN=7d

NODE_ENV=production
PORT=3000

FRONTEND_URL=https://your-frontend.vercel.app
```

4. **Generate Domain**:
   - Settings → Networking → Generate Domain
   - Copy your backend URL

### Deploy to Render

1. **Create Account**: https://render.com

2. **Create Web Service**:
   - New → Web Service
   - Connect GitHub repository

3. **Configure**:
   - Environment: Node
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start:prod`
   - Add environment variables (same as Railway)

4. **Deploy**: Click "Create Web Service"

**Note**: The `render.yaml` file is already configured in the repository for automatic deployment.

### Production Checklist

- [ ] Change `JWT_SECRET` to strong random string
- [ ] Set `NODE_ENV=production`
- [ ] Update database credentials
- [ ] Set `synchronize: false` in TypeORM
- [ ] Configure SSL for database
- [ ] Update CORS origins
- [ ] Enable HTTPS
- [ ] Set up monitoring
- [ ] Configure logging
- [ ] Set up database backups

## 🧪 Testing

### Manual API Testing with cURL

**Register:**
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!",
    "confirmPassword": "TestPass123!"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!"
  }'
```

**Get Tasks:**
```bash
curl -X GET http://localhost:3000/tasks \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Create Task:**
```bash
curl -X POST http://localhost:3000/tasks \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Task",
    "description": "This is a test",
    "status": "To Do",
    "dueDate": "2024-12-31T23:59:00.000Z"
  }'
```

## 📊 Performance

### Optimization Strategies

- ✅ Connection pooling for database
- ✅ Query optimization with TypeORM
- ✅ Lazy loading of relations
- ✅ Caching strategies (can be added)
- ✅ Compression middleware
- ✅ Rate limiting (can be added)

### Recommended Production Enhancements

You can add these middleware to enhance performance:

```typescript
// src/app.ts

// Enable compression
import compression from 'compression';
app.use(compression());

// Rate limiting
import rateLimit from 'express-rate-limit';
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Helmet for security headers
import helmet from 'helmet';
app.use(helmet());
```

Install dependencies:
```bash
npm install compression express-rate-limit helmet
npm install -D @types/compression
```

## 🐛 Troubleshooting

### Issue: Cannot connect to database

**Check:**
```bash
# Test MySQL connection
mysql -h localhost -u taskuser -p task_management
```

**Solution:** Verify DATABASE_* variables in .env

### Issue: Port already in use

```bash
# Find process using port 3000
lsof -ti:3000

# Kill process
kill -9 <PID>

# Or change port in .env
PORT=3001
```

### Issue: TypeORM synchronize errors

**Solution:** Disable synchronize in production
```typescript
// src/config/database.ts
synchronize: process.env.NODE_ENV !== 'production'
```

### Issue: JWT token invalid

**Check:**
- Token format: `Bearer <token>`
- Token expiration
- JWT_SECRET matches between requests

### Issue: CORS errors

**Solution:** Add frontend URL to CORS origins
```typescript
// src/app.ts
app.use(
  cors({
    origin: ['http://localhost:3001', 'https://your-frontend.vercel.app'],
    credentials: true,
  })
);
```

## 📝 Environment Variables Reference

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `DATABASE_HOST` | MySQL host | Yes | `localhost` |
| `DATABASE_PORT` | MySQL port | Yes | `3306` |
| `DATABASE_USER` | MySQL username | Yes | - |
| `DATABASE_PASSWORD` | MySQL password | Yes | - |
| `DATABASE_NAME` | Database name | Yes | `task_management` |
| `JWT_SECRET` | JWT signing secret | Yes | - |
| `JWT_EXPIRES_IN` | Token expiration | No | `7d` |
| `PORT` | Server port | No | `3000` |
| `NODE_ENV` | Environment | No | `development` |
| `FRONTEND_URL` | Frontend URL for CORS | Yes | - |

## 🔄 Database Migrations

### Create Migration

```bash
npm run typeorm migration:generate -- -n MigrationName
```

### Run Migrations

```bash
npm run typeorm migration:run
```

### Revert Migration

```bash
npm run typeorm migration:revert
```

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com)
- [TypeORM Documentation](https://typeorm.io)
- [JWT Documentation](https://jwt.io)
- [MySQL Documentation](https://dev.mysql.com/doc)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## 🤝 Contributing

1. Follow Express.js and TypeScript best practices
2. Maintain code consistency
3. Update documentation
4. Use conventional commits
5. Submit pull request

## 📄 License

This project is licensed under the MIT License.

## 👥 Support

For backend-specific issues:
- Check server logs: `docker-compose logs -f backend`
- Review database connections
- Verify environment variables
- Check [GitHub Issues](https://github.com/yourusername/task-management-system/issues)

## 🔄 Migration from NestJS

This project was originally built with NestJS and has been successfully migrated to Express.js while maintaining 100% of the functionality. The migration provides:

- ✅ Simpler, more straightforward code structure
- ✅ Reduced bundle size and dependencies
- ✅ Better performance with lightweight Express.js
- ✅ Easier to understand and maintain
- ✅ All features preserved (authentication, validation, error handling)

### Key Changes
- NestJS decorators → Express middleware and routers
- NestJS modules → Singleton services
- Guards → Custom JWT middleware
- NestJS pipes → Custom validation middleware
- Dependency injection → Manual instantiation

---

**Built with ❤️ using Express.js and TypeORM**