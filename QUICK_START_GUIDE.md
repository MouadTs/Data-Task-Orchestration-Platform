# 🚀 Quick Start Guide - Data Orchestration Platform

Complete step-by-step guide to run the project from scratch.

## 📋 Prerequisites Checklist

Before starting, ensure you have:

- ✅ **Java 21+** installed
  ```bash
  java -version
  # Should show version 21 or higher
  ```

- ✅ **Maven 3.6+** installed
  ```bash
  mvn -version
  # Should show version 3.6 or higher
  ```

- ✅ **Node.js 14+** and **npm** installed
  ```bash
  node -version
  npm -version
  ```

- ✅ **AWS Account** with:
  - DynamoDB access
  - Lambda access
  - Valid AWS credentials

---

## 🔧 Step 1: AWS Setup

### 1.1 Configure AWS Credentials

Edit `Cloud_Task_Orchestration_Platform/src/main/resources/application.properties`:

```properties
spring.application.name=Cloud_Task_Orchestration_Platform

aws.accessKeyId=YOUR_ACCESS_KEY_HERE
aws.secretAccessKey=YOUR_SECRET_KEY_HERE
aws.region=eu-north-1
```

**⚠️ Important:** Replace `YOUR_ACCESS_KEY_HERE` and `YOUR_SECRET_KEY_HERE` with your actual AWS credentials.

### 1.2 Create DynamoDB Tables

Go to AWS Console → DynamoDB and create these tables:

**Table 1: Tasks**
- Table name: `Tasks`
- Partition key: `taskId` (String)
- No sort key needed

**Table 2: Workflows**
- Table name: `Workflows`
- Partition key: `id` (String)
- No sort key needed

**Table 3: JobHistory**
- Table name: `JobHistory`
- Partition key: `jobId` (String)
- No sort key needed

**Note:** You can use AWS CLI or Console to create these tables.

---

## 🔴 Step 2: Start Backend (Spring Boot)

### 2.1 Navigate to Backend Directory

```bash
cd Cloud_Task_Orchestration_Platform
```

### 2.2 Build the Project

```bash
mvn clean install
```

This will:
- Download dependencies
- Compile the code
- Run tests
- Package the application

**Expected output:** `BUILD SUCCESS`

### 2.3 Run the Backend

```bash
mvn spring-boot:run
```

**Expected output:**
```
Started CloudTaskOrchestrationPlatformApplication in X.XXX seconds
```

The backend will be running on: **http://localhost:8080**

**✅ Verify Backend:**
- Open browser: `http://localhost:8080/api/tasks`
- Should see: `[]` (empty array) or JSON response
- Check console for any errors

**Keep this terminal window open!** The backend must stay running.

---

## 🟢 Step 3: Start Frontend (React)

### 3.1 Open a NEW Terminal Window

**Important:** Keep the backend terminal running, open a new terminal for frontend.

### 3.2 Navigate to Frontend Directory

```bash
cd frontend
```

### 3.3 Install Dependencies (First Time Only)

```bash
npm install
```

This will install all React dependencies. Takes 1-3 minutes.

**Expected output:** `added XXX packages`

### 3.4 Start the Frontend

```bash
npm start
```

**Expected output:**
```
Compiled successfully!

You can now view data-orchestration-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

The frontend will automatically open in your browser at: **http://localhost:3000**

**✅ Verify Frontend:**
- Browser should open automatically
- You should see the dashboard with sidebar navigation
- No console errors in browser DevTools (F12)

---

## 🎯 Step 4: Verify Everything Works

### 4.1 Check Backend API

Open a new browser tab and visit:
- `http://localhost:8080/api/tasks` → Should return `[]`
- `http://localhost:8080/api/workflows` → Should return `[]`

### 4.2 Check Frontend Connection

1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Refresh the page
4. Look for API calls to `localhost:8080/api/...`
5. Should see successful responses (200 status)

### 4.3 Test Creating a Task

1. Click **"Create Task"** in sidebar or **"New Task"** button
2. Fill in the form:
   - Task Name: `Test Task`
   - Description: `Testing the platform`
   - Data API URL: `https://jsonplaceholder.typicode.com/posts/1`
   - Select data cleaning options (optional)
3. Click **"Create Task"**
4. Should see success message
5. Go to Dashboard - should see the task in statistics

### 4.4 Test Creating a Workflow

1. Click **"Create Workflow"** in sidebar
2. Fill in the form:
   - Workflow Name: `Test Workflow`
   - Description: `Testing workflow`
   - Select Tasks: Choose the task you just created
   - Status: `Active`
3. Click **"Create Workflow"**
4. Should see success message
5. Go to **"Workflows"** page - should see your workflow

---

## 📱 Running Both Services

You need **TWO terminal windows** running simultaneously:

### Terminal 1 - Backend
```bash
cd Cloud_Task_Orchestration_Platform
mvn spring-boot:run
```
**Status:** Should show "Started CloudTaskOrchestrationPlatformApplication"

### Terminal 2 - Frontend
```bash
cd frontend
npm start
```
**Status:** Should show "Compiled successfully" and browser opens

---

## 🛠️ Troubleshooting

### Backend Won't Start

**Problem:** `java: command not found`
- **Solution:** Install Java 21+ and add to PATH

**Problem:** `mvn: command not found`
- **Solution:** Install Maven 3.6+ and add to PATH

**Problem:** `AWS credentials not found`
- **Solution:** Check `application.properties` has correct AWS credentials

**Problem:** `DynamoDB table not found`
- **Solution:** Create the DynamoDB tables in AWS Console first

**Problem:** Port 8080 already in use
- **Solution:** 
  ```bash
  # Windows
  netstat -ano | findstr :8080
  taskkill /PID <PID> /F
  
  # Mac/Linux
  lsof -ti:8080 | xargs kill
  ```

### Frontend Won't Start

**Problem:** `npm: command not found`
- **Solution:** Install Node.js 14+ from nodejs.org

**Problem:** `npm install` fails
- **Solution:** 
  ```bash
  npm cache clean --force
  rm -rf node_modules package-lock.json
  npm install
  ```

**Problem:** Frontend can't connect to backend
- **Solution:** 
  1. Verify backend is running on port 8080
  2. Check browser console for CORS errors
  3. Verify `REACT_APP_API_URL` in `.env` file (if exists)

**Problem:** Port 3000 already in use
- **Solution:**
  ```bash
  # Windows
  netstat -ano | findstr :3000
  taskkill /PID <PID> /F
  
  # Mac/Linux
  lsof -ti:3000 | xargs kill
  ```

### CORS Errors

**Problem:** Browser shows CORS errors
- **Solution:** 
  1. Verify `CorsConfig.java` exists in backend
  2. Verify `SecurityConfig.java` allows all requests
  3. Restart backend after changes

---

## 📊 Project Structure

```
Data-Orchestration-platform/
├── Cloud_Task_Orchestration_Platform/    # Backend (Spring Boot)
│   ├── src/main/java/com/cloudorchestrator/
│   │   ├── config/          # CORS, Security, DynamoDB config
│   │   ├── controller/      # REST API endpoints
│   │   ├── model/           # Data models
│   │   ├── repository/      # DynamoDB repositories
│   │   └── service/         # Business logic
│   └── src/main/resources/
│       └── application.properties
│
└── frontend/                 # Frontend (React)
    ├── src/
    │   ├── components/       # React components
    │   ├── services/         # API service layer
    │   └── App.js           # Main app
    └── package.json
```

---

## 🎓 Usage Workflow

1. **Create Task** → Define data source and cleaning options
2. **Create Workflow** → Combine multiple tasks
3. **Execute Workflow** → Run the workflow
4. **Monitor** → Check dashboard for statistics

---

## 🚀 Production Deployment

### Backend
```bash
cd Cloud_Task_Orchestration_Platform
mvn clean package
java -jar target/cloud-task-orchestration-platform-0.0.1-SNAPSHOT.jar
```

### Frontend
```bash
cd frontend
npm run build
# Deploy the 'build' folder to your web server
```

---

## 📞 Need Help?

1. Check backend console logs for errors
2. Check browser console (F12) for frontend errors
3. Verify AWS credentials and DynamoDB tables
4. Ensure both services are running on correct ports

---

## ✅ Quick Verification Checklist

- [ ] Java 21+ installed
- [ ] Maven 3.6+ installed
- [ ] Node.js 14+ installed
- [ ] AWS credentials configured
- [ ] DynamoDB tables created
- [ ] Backend running on port 8080
- [ ] Frontend running on port 3000
- [ ] Can create tasks
- [ ] Can create workflows
- [ ] Dashboard shows statistics

**Once all checked, you're ready to go! 🎉**
