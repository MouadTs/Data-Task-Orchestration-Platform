import React, { useState, useEffect } from 'react';
import { taskService, workflowService } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalTasks: 0,
    totalWorkflows: 0,
    activeWorkflows: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentTasks, setRecentTasks] = useState([]);
  const [recentWorkflows, setRecentWorkflows] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [tasksRes, workflowsRes] = await Promise.all([
        taskService.getAll(),
        workflowService.getAll(),
      ]);

      const tasks = tasksRes.data || [];
      const workflows = workflowsRes.data || [];

      setStats({
        totalTasks: tasks.length,
        totalWorkflows: workflows.length,
        activeWorkflows: workflows.filter((w) => w.status === 'ACTIVE').length,
      });

      setRecentTasks(tasks.slice(-5).reverse());
      setRecentWorkflows(workflows.slice(-5).reverse());
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Top Orchestration Assets</h2>
        <div className="dashboard-filters">
          <span className="filter-tag active">24H</span>
          <span className="filter-tag">All Tasks</span>
          <span className="filter-tag">Desc</span>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
          </div>
          <div className="stat-content">
            <h3>{stats.totalTasks}</h3>
            <p>Total Tasks</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
          </div>
          <div className="stat-content">
            <h3>{stats.totalWorkflows}</h3>
            <p>Total Workflows</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <div className="stat-content">
            <h3>{stats.activeWorkflows}</h3>
            <p>Active Workflows</p>
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="dashboard-section">
          <h3>Recent Tasks</h3>
          {recentTasks.length === 0 ? (
            <p className="empty-state">No tasks yet. Create your first task!</p>
          ) : (
            <div className="list-container">
              {recentTasks.map((task) => (
                <div key={task.taskId} className="list-item">
                  <div>
                    <strong>{task.name}</strong>
                    <p className="list-item-desc">{task.description || 'No description'}</p>
                  </div>
                  <span className="badge">{task.lambdaFunctionName || 'N/A'}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="dashboard-section">
          <h3>Recent Workflows</h3>
          {recentWorkflows.length === 0 ? (
            <p className="empty-state">No workflows yet. Create your first workflow!</p>
          ) : (
            <div className="list-container">
              {recentWorkflows.map((workflow) => (
                <div key={workflow.workflowId} className="list-item">
                  <div>
                    <strong>{workflow.name}</strong>
                    <p className="list-item-desc">{workflow.description || 'No description'}</p>
                  </div>
                  <span className={`badge badge-${workflow.status?.toLowerCase() || 'unknown'}`}>
                    {workflow.status || 'UNKNOWN'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
