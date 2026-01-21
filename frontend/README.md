# Data Orchestration Platform - Frontend

React frontend for the Data Orchestration Platform that allows users to manage data processing tasks and workflows.

## Features

- **Dashboard**: Overview of tasks and workflows with statistics
- **Task Management**: Create tasks with API links and data cleaning options
- **Workflow Management**: Create and execute workflows that orchestrate multiple tasks
- **Modern UI**: Clean, responsive design with intuitive user experience

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend API running on `http://localhost:8080` (or configure via environment variable)

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

## Configuration

Create a `.env` file in the frontend directory to configure the API URL (optional, defaults to `http://localhost:8080`):

```
REACT_APP_API_URL=http://localhost:8080/api
```

## Running the Application

Start the development server:

```bash
npm start
```

The application will open at `http://localhost:3000` in your browser.

## Building for Production

To create a production build:

```bash
npm run build
```

The build folder will contain the optimized production build.

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Dashboard.js          # Main dashboard component
│   │   ├── CreateTask.js         # Task creation form
│   │   ├── WorkflowList.js       # Workflow listing and management
│   │   └── CreateWorkflow.js     # Workflow creation form
│   ├── services/
│   │   └── api.js                # API service layer
│   ├── App.js                    # Main app component with routing
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## Usage

1. **Create a Task**:
   - Navigate to "Create Task"
   - Enter task name and description
   - Provide the API URL containing your data
   - Select data cleaning options
   - Optionally configure Lambda function name and schedule

2. **Create a Workflow**:
   - Navigate to "Create Workflow"
   - Enter workflow name and description
   - Select one or more tasks to include
   - Set status and optional cron expression
   - Save the workflow

3. **Execute Workflows**:
   - Go to "Workflows" page
   - Click "Execute" on any workflow to run it
   - Monitor execution status

4. **View Dashboard**:
   - See overview statistics
   - View recent tasks and workflows

## Data Cleaning Options

The platform supports various data cleaning operations:
- Remove Duplicates
- Remove Null Values
- Normalize Case
- Trim Whitespace
- Validate Email Format
- Format Dates
- Remove Special Characters
- Convert Data Types

## API Integration

The frontend communicates with the backend REST API:
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a task
- `GET /api/workflows` - Get all workflows
- `POST /api/workflows` - Create a workflow
- `POST /api/workflows/{id}/execute` - Execute a workflow
- `DELETE /api/workflows/{id}` - Delete a workflow

## Technologies Used

- React 18
- React Router DOM
- Axios for API calls
- CSS3 for styling
