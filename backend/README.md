# Automation Database Backend API

A NestJS-based REST API for managing automation records and related data including artifacts, tools, environments, metrics, and more.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation & Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run start:dev
   ```

4. **Verify the server is running:**
   - API Server: http://localhost:5000
   - API Documentation: http://localhost:5000/api

## 📚 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run start` | Start the production server |
| `npm run start:dev` | Start development server with hot reload |
| `npm run start:debug` | Start server in debug mode |
| `npm run build` | Build the project for production |
| `npm run test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:e2e` | Run end-to-end tests |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |

## 🔄 Database Migration Guide

The backend is currently configured to use SQLite with better-sqlite3. Below are instructions for migrating to other database systems.

### 🐘 PostgreSQL Migration

1. **Install PostgreSQL driver:**
   ```bash
   npm install pg @types/pg
   npm uninstall better-sqlite3
   ```

2. **Update `app.module.ts`:**
   ```typescript
   TypeOrmModule.forRoot({
     type: 'postgres',
     host: process.env.DB_HOST || 'localhost',
     port: parseInt(process.env.DB_PORT, 10) || 5432,
     username: process.env.DB_USERNAME || 'postgres',
     password: process.env.DB_PASSWORD || 'password',
     database: process.env.DB_NAME || 'automation_db',
     entities: [__dirname + '/**/*.entity{.ts,.js}'],
     synchronize: process.env.NODE_ENV !== 'production',
     logging: process.env.NODE_ENV === 'development',
   }),
   ```

3. **Create `.env` file:**
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   DB_NAME=automation_db
   ```

4. **Update entity constraints for PostgreSQL:**
   - Ensure all entity decorators are PostgreSQL compatible
   - Update any SQLite-specific data types

### 🏢 Microsoft SQL Server Migration

1. **Install SQL Server driver:**
   ```bash
   npm install mssql @types/mssql
   npm uninstall better-sqlite3
   ```

2. **Update `app.module.ts`:**
   ```typescript
   TypeOrmModule.forRoot({
     type: 'mssql',
     host: process.env.DB_HOST || 'localhost',
     port: parseInt(process.env.DB_PORT, 10) || 1433,
     username: process.env.DB_USERNAME || 'sa',
     password: process.env.DB_PASSWORD || 'password',
     database: process.env.DB_NAME || 'automation_db',
     entities: [__dirname + '/**/*.entity{.ts,.js}'],
     synchronize: process.env.NODE_ENV !== 'production',
     logging: process.env.NODE_ENV === 'development',
     options: {
       encrypt: false, // Set to true for Azure
       trustServerCertificate: true,
     },
   }),
   ```

3. **Create `.env` file:**
   ```env
   DB_HOST=localhost
   DB_PORT=1433
   DB_USERNAME=sa
   DB_PASSWORD=your_password
   DB_NAME=automation_db
   ```

### 🔮 Oracle Database Migration

1. **Install Oracle driver:**
   ```bash
   npm install oracledb @types/oracledb
   npm uninstall better-sqlite3
   ```

2. **Update `app.module.ts`:**
   ```typescript
   TypeOrmModule.forRoot({
     type: 'oracle',
     host: process.env.DB_HOST || 'localhost',
     port: parseInt(process.env.DB_PORT, 10) || 1521,
     username: process.env.DB_USERNAME || 'system',
     password: process.env.DB_PASSWORD || 'password',
     database: process.env.DB_NAME || 'XE',
     serviceName: process.env.DB_SERVICE || 'XE',
     entities: [__dirname + '/**/*.entity{.ts,.js}'],
     synchronize: process.env.NODE_ENV !== 'production',
     logging: process.env.NODE_ENV === 'development',
   }),
   ```

3. **Create `.env` file:**
   ```env
   DB_HOST=localhost
   DB_PORT=1521
   DB_USERNAME=system
   DB_PASSWORD=your_password
   DB_NAME=XE
   DB_SERVICE=XE
   ```

### 🍃 MongoDB Migration

⚠️ **Note:** MongoDB requires significant changes since it's a NoSQL database and TypeORM has limited MongoDB support. Consider using Mongoose instead.

#### Option 1: TypeORM with MongoDB

1. **Install MongoDB driver:**
   ```bash
   npm install mongodb @types/mongodb
   npm uninstall better-sqlite3
   ```

2. **Update `app.module.ts`:**
   ```typescript
   TypeOrmModule.forRoot({
     type: 'mongodb',
     host: process.env.DB_HOST || 'localhost',
     port: parseInt(process.env.DB_PORT, 10) || 27017,
     database: process.env.DB_NAME || 'automation_db',
     entities: [__dirname + '/**/*.entity{.ts,.js}'],
     synchronize: process.env.NODE_ENV !== 'production',
     logging: process.env.NODE_ENV === 'development',
     useUnifiedTopology: true,
   }),
   ```

3. **Update entities for MongoDB:**
   ```typescript
   import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';
   
   @Entity('automations')
   export class Automation {
     @ObjectIdColumn()
     id: ObjectId;
     
     @Column()
     air_id: string;
     
     // ... other columns
   }
   ```

#### Option 2: Mongoose (Recommended for MongoDB)

1. **Install Mongoose:**
   ```bash
   npm install @nestjs/mongoose mongoose
   npm uninstall @nestjs/typeorm typeorm better-sqlite3
   ```

2. **Update `app.module.ts`:**
   ```typescript
   import { MongooseModule } from '@nestjs/mongoose';
   
   @Module({
     imports: [
       MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost/automation_db'),
       // ... other modules
     ],
   })
   ```

3. **Convert entities to Mongoose schemas:**
   ```typescript
   import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
   import { Document } from 'mongoose';
   
   @Schema()
   export class Automation extends Document {
     @Prop({ required: true })
     air_id: string;
     
     @Prop({ required: true })
     name: string;
     
     // ... other properties
   }
   
   export const AutomationSchema = SchemaFactory.createForClass(Automation);
   ```

### 🔧 General Migration Steps

1. **Backup your current data:**
   ```bash
   # For SQLite
   cp ../automation_database.db ../automation_database_backup.db
   ```

2. **Export existing data:**
   ```bash
   # Create data export script or use database tools
   ```

3. **Test the migration:**
   - Set up the new database in a test environment
   - Run migrations
   - Verify data integrity
   - Test all API endpoints

4. **Update environment variables:**
   - Create appropriate `.env` files for each environment
   - Update deployment configurations

5. **Update CI/CD pipelines:**
   - Update database setup in testing environments
   - Modify deployment scripts

### 📊 Database Comparison

| Database | Best For | Pros | Cons |
|----------|----------|------|------|
| **SQLite** | Small apps, development | Simple setup, no server needed | Limited concurrency |
| **PostgreSQL** | Most applications | Feature-rich, reliable, open source | Requires server setup |
| **SQL Server** | Enterprise, Windows | Excellent tooling, integration | Microsoft ecosystem, licensing |
| **Oracle** | Enterprise, complex apps | Powerful features, enterprise support | Expensive, complex |
| **MongoDB** | Document-based data | Flexible schema, horizontal scaling | NoSQL learning curve |

### ⚠️ Migration Considerations

- **Data Types:** Different databases support different data types
- **Constraints:** Foreign key constraints may behave differently
- **Indexing:** Index strategies vary between databases
- **Transactions:** Transaction handling may need updates
- **Connection Pooling:** Configure appropriate connection pools
- **Performance:** Query optimization strategies differ
- **Backup/Recovery:** Each database has different backup strategies

### 🧪 Testing After Migration

1. **Run all tests:**
   ```bash
   npm run test
   npm run test:e2e
   ```

2. **Test API endpoints:**
   ```bash
   # Test all CRUD operations
   curl http://localhost:5000/automations
   curl http://localhost:5000/artifacts
   ```

3. **Load testing:**
   - Test with realistic data volumes
   - Verify performance characteristics
   - Check memory usage

4. **Backup/Restore testing:**
   - Test backup procedures
   - Verify restore functionality

## 🗄️ Database

The API uses SQLite database with TypeORM as the ORM and better-sqlite3 driver. The database file is located at the root of the project (`automation_database.db`).

### Database Configuration
- **Type:** SQLite (better-sqlite3)
- **File:** `../automation_database.db`
- **Auto-sync:** Enabled in development
- **Logging:** Enabled in development

## 🌐 API Endpoints

### Base URL
```
http://localhost:5000
```

---

## 📋 Automations API

### Get All Automations
```bash
curl http://localhost:5000/automations
```

### Create New Automation
```bash
curl -X POST http://localhost:5000/automations \
  -H "Content-Type: application/json" \
  -d '{
    "air_id": "AIR-999",
    "name": "Sample Automation",
    "type": "RPA",
    "brief_description": "This is a sample automation",
    "complexity": "Medium",
    "coe_fed": "COE"
  }'
```

### Get Automation by AIR ID
```bash
curl http://localhost:5000/automations/AIR-001
```

### Search Automations
```bash
curl "http://localhost:5000/automations/search?q=email"
```

### Update Automation
```bash
curl -X PATCH http://localhost:5000/automations/AIR-001 \
  -H "Content-Type: application/json" \
  -d '{
    "brief_description": "Updated description",
    "complexity": "High"
  }'
```

### Delete Automation
```bash
curl -X DELETE http://localhost:5000/automations/AIR-001
```

---

## 🔧 Artifacts API

### Get All Artifacts
```bash
curl http://localhost:5000/artifacts
```

### Create New Artifact
```bash
curl -X POST http://localhost:5000/artifacts \
  -H "Content-Type: application/json" \
  -d '{
    "automation_id": "AIR-001",
    "artifacts_link": "https://example.com/artifacts",
    "code_review": "Completed",
    "demo": "Recorded",
    "rampup_issue_list": "Issue 1, Issue 2"
  }'
```

### Get Artifact by ID
```bash
curl http://localhost:5000/artifacts/1
```

### Update Artifact
```bash
curl -X PATCH http://localhost:5000/artifacts/1 \
  -H "Content-Type: application/json" \
  -d '{
    "code_review": "Reviewed and Approved",
    "demo": "Live Demo Completed"
  }'
```

### Delete Artifact
```bash
curl -X DELETE http://localhost:5000/artifacts/1
```

---

## 📊 Data Models

### Automation Model
```json
{
  "air_id": "string (required, max 20 chars)",
  "name": "string (required, max 300 chars)",
  "type": "string (required, max 100 chars)",
  "brief_description": "string (optional)",
  "coe_fed": "COE | FED (optional)",
  "complexity": "Low | Medium | High (optional)",
  "tool_id": "number (optional)",
  "tool_version": "string (optional, max 50 chars)",
  "process_details": "string (optional)",
  "object_details": "string (optional)",
  "queue": "string (optional, max 200 chars)",
  "shared_folders": "string (optional)",
  "shared_mailboxes": "string (optional, max 500 chars)",
  "qa_handshake": "string (optional, max 50 chars)",
  "preprod_deploy_date": "date (optional)",
  "prod_deploy_date": "date (optional)",
  "warranty_end_date": "date (optional)",
  "comments": "string (optional)",
  "documentation": "string (optional)",
  "modified": "datetime (optional)",
  "modified_by_id": "number (optional)",
  "path": "string (optional)"
}
```

### Artifact Model
```json
{
  "automation_id": "string (required, max 20 chars)",
  "artifacts_link": "string (optional)",
  "code_review": "string (optional, max 50 chars)",
  "demo": "string (optional, max 50 chars)",
  "rampup_issue_list": "string (optional)"
}
```

## 🔍 Using JSON Files for Testing

### Create test files for easier testing:

**Create automation (save as `test-automation.json`):**
```json
{
  "air_id": "AIR-999",
  "name": "Test Automation Process",
  "type": "RPA",
  "brief_description": "Automated testing process for validation",
  "complexity": "Medium",
  "coe_fed": "COE",
  "tool_version": "1.0.0",
  "process_details": "Detailed process description here",
  "comments": "This is a test automation"
}
```

**Create artifact (save as `test-artifact.json`):**
```json
{
  "automation_id": "AIR-001",
  "artifacts_link": "https://github.com/company/automation-artifacts",
  "code_review": "Completed",
  "demo": "Live Demo Available",
  "rampup_issue_list": "Setup documentation, Training materials, FAQ"
}
```

**Update artifact (save as `update-artifact.json`):**
```json
{
  "code_review": "Reviewed and Approved",
  "demo": "Production Demo Completed",
  "rampup_issue_list": "All issues resolved"
}
```

### Use the files with curl:
```bash
# Create automation
curl -X POST http://localhost:5000/automations \
  -H "Content-Type: application/json" \
  -d @test-automation.json

# Create artifact
curl -X POST http://localhost:5000/artifacts \
  -H "Content-Type: application/json" \
  -d @test-artifact.json

# Update artifact
curl -X PATCH http://localhost:5000/artifacts/1 \
  -H "Content-Type: application/json" \
  -d @update-artifact.json
```

## 🛡️ Error Handling

The API returns standard HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error

Example error response:
```json
{
  "statusCode": 400,
  "message": ["name should not be empty"],
  "error": "Bad Request"
}
```

## 🔧 Configuration

### Environment Variables (Optional)
Create a `.env` file in the backend directory for custom configuration:

**For SQLite (current setup):**
```env
# Server
PORT=5000
NODE_ENV=development

# Database (SQLite)
DB_PATH=../automation_database.db
```

**For PostgreSQL:**
```env
# Server
PORT=5000
NODE_ENV=development

# Database (PostgreSQL)
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=automation_db
```

**For SQL Server:**
```env
# Server
PORT=5000
NODE_ENV=development

# Database (SQL Server)
DB_TYPE=mssql
DB_HOST=localhost
DB_PORT=1433
DB_USERNAME=sa
DB_PASSWORD=password
DB_NAME=automation_db
DB_ENCRYPT=false
DB_TRUST_SERVER_CERTIFICATE=true
```

**For Oracle:**
```env
# Server
PORT=5000
NODE_ENV=development

# Database (Oracle)
DB_TYPE=oracle
DB_HOST=localhost
DB_PORT=1521
DB_USERNAME=system
DB_PASSWORD=password
DB_DATABASE=XE
DB_SERVICE_NAME=XE
```

**For MongoDB:**
```env
# Server
PORT=5000
NODE_ENV=development

# Database (MongoDB)
DB_TYPE=mongodb
MONGODB_URI=mongodb://localhost:27017/automation_db
```

### CORS Configuration
The API is configured to accept requests from:
- `http://localhost:3000` (Frontend)
- `http://localhost:3001`
- `http://localhost:5000`

## 📖 API Documentation

Visit http://localhost:5000/api when the server is running to access the interactive Swagger documentation where you can:
- View all available endpoints
- Test API calls directly from the browser
- See request/response schemas
- Download API specifications

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── app.module.ts           # Main application module
│   ├── main.ts                 # Application entry point
│   ├── artifacts/              # Artifacts module
│   │   ├── artifacts.controller.ts
│   │   ├── artifacts.service.ts
│   │   ├── artifacts.module.ts
│   │   ├── artifact.entity.ts
│   │   └── dto/
│   ├── automations/            # Automations module
│   │   ├── automations.controller.ts
│   │   ├── automations.service.ts
│   │   ├── automations.module.ts
│   │   ├── automation.entity.ts
│   │   └── dto/
│   ├── people/                 # People module
│   ├── tools/                  # Tools module
│   ├── environments/           # Environments module
│   └── metrics/                # Metrics module
├── package.json
├── tsconfig.json
└── nest-cli.json
```

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use:**
   ```bash
   # Kill process using port 5000
   npx kill-port 5000
   ```

2. **Database connection issues:**
   - Ensure SQLite database file exists in the root directory
   - Check file permissions
   - The project uses better-sqlite3 for better compatibility and performance

3. **Module not found errors:**
   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules
   npm install
   ```

4. **CORS errors:**
   - Check if your frontend is running on an allowed origin
   - Update CORS configuration in `main.ts` if needed

### Getting Help

- Check the server logs for detailed error messages
- Use the Swagger documentation at http://localhost:5000/api
- Ensure all required fields are provided in API requests
- Validate JSON syntax before sending requests

## 📚 Database Quick Reference

### SQLite Commands
```bash
# View database schema
sqlite3 ../automation_database.db ".schema"

# Export data
sqlite3 ../automation_database.db ".dump" > backup.sql

# Import data
sqlite3 ../automation_database.db < backup.sql

# Check database size
ls -lh ../automation_database.db
```

### PostgreSQL Commands
```bash
# Connect to database
psql -h localhost -U postgres -d automation_db

# Create backup
pg_dump -h localhost -U postgres automation_db > backup.sql

# Restore backup
psql -h localhost -U postgres -d automation_db < backup.sql

# Check database size
psql -h localhost -U postgres -c "SELECT pg_size_pretty(pg_database_size('automation_db'));"
```

### SQL Server Commands
```bash
# Connect using sqlcmd
sqlcmd -S localhost -U sa -P password -d automation_db

# Create backup (T-SQL)
BACKUP DATABASE automation_db TO DISK = 'C:\backup\automation_db.bak'

# Restore backup (T-SQL)
RESTORE DATABASE automation_db FROM DISK = 'C:\backup\automation_db.bak'
```

### MongoDB Commands
```bash
# Connect to MongoDB
mongo mongodb://localhost:27017/automation_db

# Create backup
mongodump --db automation_db --out ./backup

# Restore backup
mongorestore --db automation_db ./backup/automation_db

# Check database size
mongo automation_db --eval "db.stats()"
```

## 📝 Development Notes

- The API uses TypeScript for type safety
- All endpoints include proper validation using class-validator
- Relationships between entities are properly configured
- The database schema auto-syncs in development mode
- Swagger documentation is auto-generated from decorators
