# Task Management System - Backend

A robust REST API built with NestJS, TypeORM, and MySQL for managing tasks with secure authentication and authorization.

![NestJS](https://img.shields.io/badge/NestJS-10-red)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue)

## 🌟 Features

- 🔐 JWT-based authentication
- 🔒 Secure password hashing with bcrypt
- ✅ Input validation with class-validator
- 🛡️ Protected routes with guards
- 📊 TypeORM for database management
- 🎯 RESTful API design
- 🔄 CORS configuration
- 📝 Comprehensive error handling
- 🚀 Optimized for production
- 🐳 Docker support

## 🛠️ Tech Stack

- **Framework**: NestJS 10
- **Language**: TypeScript 5
- **Database**: MySQL 8.0
- **ORM**: TypeORM
- **Authentication**: JWT, Passport
- **Validation**: class-validator, class-transformer
- **Password Security**: bcrypt
- **Configuration**: @nestjs/config

## 📁 Project Structure

```
task-management-backend/
├── src/
│   ├── auth/                    # Authentication module
│   │   ├── dto/                # Data Transfer Objects
│   │   │   └── auth.dto.ts
│   │   ├── guards/             # Route guards
│   │   │   └── jwt-auth.guard.ts
│   │   ├── strategies/         # Passport strategies
│   │   │   └── jwt.strategy.ts
│   │   ├── auth.controller.ts  # Auth endpoints
│   │   ├── auth.service.ts     # Auth business logic
│   │   └── auth.module.ts      # Auth module config
│   │
│   ├── tasks/                   # Tasks module
│   │   ├── dto/                # Data Transfer Objects
│   │   │   └── task.dto.ts
│   │   ├── entities/           # Database entities
│   │   │   └── task.entity.ts
│   │   ├── tasks.controller.ts # Task endpoints
│   │   ├── tasks.service.ts    # Task business logic
│   │   └── tasks.module.ts     # Task module config
│   │
│   ├── users/                   # Users module
│   │   ├── entities/
│   │   │   └── user.entity.ts  # User entity
│   │   ├── users.service.ts    # User operations
│   │   └── users.module.ts     # User module config
│   │
│   ├── app.module.ts           # Root application module
│   └── main.ts                 # Application entry point
│
├── test/                       # Test files
│   └── app.e2e-spec.ts
│
├── .env.example                # Environment variables template
├── .env                        # Local environment (gitignored)
├── .eslintrc.js               # ESLint configuration
├── .gitignore                 # Git ignore rules
├── .prettierrc                # Prettier configuration
├── docker-compose.yml         # Docker Compose config
├── Dockerfile                 # Docker configuration
├── nest-cli.json              # Nest CLI configuration
├── package.json               # Dependencies
├── railway.json               # Railway deployment config
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

### Development Mode

```bash
npm run start:dev
# or
yarn start:dev
```

Server runs at: http://localhost:3000

### Production Mode

```bash
# Build the application
npm run build

# Start production server
npm run start:prod
```

### Watch Mode

```bash
npm run start:debug
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

Response (200 OK):
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
// app.module.ts
TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    type: 'mysql',
    host: configService.get('DATABASE_HOST'),
    port: configService.get('DATABASE_PORT'),
    username: configService.get('DATABASE_USER'),
    password: configService.get('DATABASE_PASSWORD'),
    database: configService.get('DATABASE_NAME'),
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: configService.get('NODE_ENV') !== 'production',
    logging: false,
    ssl: configService.get('NODE_ENV') === 'production' ? {
      rejectUnauthorized: false
    } : false,
  }),
  inject: [ConfigService],
}),
```

### JWT Configuration

```typescript
// auth.module.ts
JwtModule.registerAsync({
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    secret: configService.get('JWT_SECRET'),
    signOptions: {
      expiresIn: configService.get('JWT_EXPIRES_IN'),
    },
  }),
  inject: [ConfigService],
}),
```

### CORS Configuration

```typescript
// main.ts
app.enableCors({
  origin: [
    'http://localhost:3001',
    process.env.FRONTEND_URL,
    /\.vercel\.app$/,
  ],
  credentials: true,
});
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
- ✅ Route guards protecting task endpoints
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
   - Select repository and `task-management-backend` folder
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
   - Root directory: `task-management-backend`

3. **Configure**:
   - Environment: Node
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start:prod`
   - Add environment variables

4. **Deploy**: Click "Create Web Service"

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

### Unit Tests

```bash
npm run test
```

### E2E Tests

```bash
npm run test:e2e
```

### Test Coverage

```bash
npm run test:cov
```

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

### Recommended Production Settings

```typescript
// Enable compression
import * as compression from 'compression';
app.use(compression());

// Rate limiting
import * as rateLimit from 'express-rate-limit';
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  }),
);
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
synchronize: configService.get('NODE_ENV') !== 'production'
```

### Issue: JWT token invalid

**Check:**
- Token format: `Bearer <token>`
- Token expiration
- JWT_SECRET matches between requests

### Issue: CORS errors

**Solution:** Add frontend URL to CORS origins
```typescript
app.enableCors({
  origin: ['http://localhost:3001', 'https://your-frontend.vercel.app'],
  credentials: true,
});
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

- [NestJS Documentation](https://docs.nestjs.com)
- [TypeORM Documentation](https://typeorm.io)
- [JWT Documentation](https://jwt.io)
- [MySQL Documentation](https://dev.mysql.com/doc)

## 🤝 Contributing

1. Follow NestJS best practices
2. Write tests for new features
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

---

**Built with ❤️ using NestJS and TypeORM**