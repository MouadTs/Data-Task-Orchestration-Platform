import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { workflowService, taskService } from '../services/api';
import './WorkflowList.css';

const WorkflowList = () => {
  const [workflows, setWorkflows] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState(new Set());
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [workflowsRes, tasksRes] = await Promise.all([
        workflowService.getAll(),
        taskService.getAll(),
      ]);
      setWorkflows(workflowsRes.data || []);
      setTasks(tasksRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setMessage({ type: 'error', text: 'Failed to load workflows' });
    } finally {
      setLoading(false);
    }
  };

  const handleExecute = async (workflowId) => {
    setExecuting((prev) => new Set(prev).add(workflowId));
    setMessage({ type: '', text: '' });

    try {
      const response = await workflowService.execute(workflowId);
      setMessage({ type: 'success', text: response.data || 'Workflow execution started!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to execute workflow',
      });
    } finally {
      setExecuting((prev) => {
        const newSet = new Set(prev);
        newSet.delete(workflowId);
        return newSet;
      });
    }
  };

  const handleDelete = async (workflowId) => {
    if (!window.confirm('Are you sure you want to delete this workflow?')) {
      return;
    }

    try {
      await workflowService.delete(workflowId);
      setWorkflows((prev) => prev.filter((w) => w.workflowId !== workflowId));
      setMessage({ type: 'success', text: 'Workflow deleted successfully' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to delete workflow',
      });
    }
  };

  const getTaskNames = (taskIds) => {
    if (!taskIds || taskIds.length === 0) return 'No tasks';
    return taskIds
      .map((id) => {
        const task = tasks.find((t) => t.taskId === id);
        return task ? task.name : id;
      })
      .join(', ');
  };

  if (loading) {
    return <div className="workflow-list-loading">Loading workflows...</div>;
  }

  return (
    <div className="workflow-list">
      <div className="workflow-list-header">
        <h2 className="page-title">Workflows</h2>
        <NavLink to="/workflows/create" className="btn btn-primary">
          + Create Workflow
        </NavLink>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type}`}>{message.text}</div>
      )}

      {workflows.length === 0 ? (
        <div className="empty-state">
          <p>No workflows found. Create your first workflow to get started!</p>
        </div>
      ) : (
        <div className="workflow-grid">
          {workflows.map((workflow) => (
            <div key={workflow.workflowId} className="workflow-card">
              <div className="workflow-card-header">
                <h3>{workflow.name}</h3>
                <span className={`badge badge-${workflow.status?.toLowerCase() || 'unknown'}`}>
                  {workflow.status || 'UNKNOWN'}
                </span>
              </div>

              <p className="workflow-description">
                {workflow.description || 'No description'}
              </p>

              <div className="workflow-details">
                <div className="detail-item">
                  <strong>Tasks:</strong>
                  <span>{getTaskNames(workflow.taskIds)}</span>
                </div>
                {workflow.cronExpression && (
                  <div className="detail-item">
                    <strong>Schedule:</strong>
                    <span>{workflow.cronExpression}</span>
                  </div>
                )}
                {workflow.createdAt && (
                  <div className="detail-item">
                    <strong>Created:</strong>
                    <span>{new Date(workflow.createdAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              <div className="workflow-actions">
                <button
                  onClick={() => handleExecute(workflow.workflowId)}
                  className="btn btn-success"
                  disabled={executing.has(workflow.workflowId)}
                >
                  {executing.has(workflow.workflowId) ? 'Executing...' : '▶ Execute'}
                </button>
                <button
                  onClick={() => handleDelete(workflow.workflowId)}
                  className="btn btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkflowList;
