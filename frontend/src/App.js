import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';
import Dashboard from './components/Dashboard';
import CreateTask from './components/CreateTask';
import WorkflowList from './components/WorkflowList';
import CreateWorkflow from './components/CreateWorkflow';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="app">
        <Sidebar />
        <TopHeader />
        <main className="app-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tasks/create" element={<CreateTaskWrapper />} />
            <Route path="/workflows" element={<WorkflowList />} />
            <Route path="/workflows/create" element={<CreateWorkflowWrapper />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

// Wrapper components to handle navigation after creation
const CreateTaskWrapper = () => {
  const navigate = useNavigate();
  return (
    <CreateTask
      onTaskCreated={() => {
        setTimeout(() => navigate('/'), 2000);
      }}
    />
  );
};

const CreateWorkflowWrapper = () => {
  const navigate = useNavigate();
  return (
    <CreateWorkflow
      onWorkflowCreated={() => {
        setTimeout(() => navigate('/workflows'), 2000);
      }}
    />
  );
};

export default App;
