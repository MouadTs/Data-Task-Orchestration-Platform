import React, { useState, useEffect } from 'react';
import { workflowService, taskService } from '../services/api';
import MultiSelectDropdown from './MultiSelectDropdown';
import { 
  FiPlus, FiClock, FiList, FiActivity, 
  FiCalendar, FiInfo, FiCheck, FiGlobe,
  FiChevronRight, FiPlay, FiPause
} from 'react-icons/fi';
import './CreateWorkflow.css';

const CreateWorkflow = ({ onWorkflowCreated }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingTasks, setFetchingTasks] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    workflowId: '',
    name: '',
    description: '',
    taskIds: [],
    status: 'ACTIVE',
    cronExpression: '',
  });

  const [selectedTasks, setSelectedTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    const selected = tasks.filter(task => formData.taskIds.includes(task.taskId));
    setSelectedTasks(selected);
  }, [formData.taskIds, tasks]);

  const fetchTasks = async () => {
    try {
      const response = await taskService.getAll();
      setTasks(response.data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to load tasks');
    } finally {
      setFetchingTasks(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTaskSelectChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      taskIds: e.target.value,
    }));
  };

  const generateWorkflowId = () => {
    return `wf-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (formData.taskIds.length === 0) {
        setError('Please select at least one task');
        setLoading(false);
        return;
      }

      const workflowId = formData.workflowId || generateWorkflowId();

      const workflowPayload = {
        workflowId,
        name: formData.name,
        description: formData.description,
        taskIds: formData.taskIds,
        status: formData.status,
        cronExpression: formData.cronExpression || null,
      };

      await workflowService.create(workflowPayload);
      setSuccess('✨ Workflow created successfully!');

      // Reset form
      setFormData({
        workflowId: '',
        name: '',
        description: '',
        taskIds: [],
        status: 'ACTIVE',
        cronExpression: '',
      });

      if (onWorkflowCreated) {
        onWorkflowCreated();
      }
    } catch (err) {
      setError(err.response?.data?.message || '❌ Failed to create workflow. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = () => {
    setFormData(prev => ({
      ...prev,
      status: prev.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE'
    }));
  };

  const handleCronExamples = (example) => {
    setFormData(prev => ({
      ...prev,
      cronExpression: example
    }));
  };

  if (fetchingTasks) {
    return (
      <div className="create-workflow-loading">
        <div className="loading-spinner"></div>
        <p>Loading available tasks...</p>
      </div>
    );
  }

  return (
    <div className="create-workflow">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">
            <FiGlobe className="title-icon" />
            Create New Workflow
          </h1>
          <p className="page-subtitle">
            Orchestrate tasks into automated pipelines with scheduling and monitoring
          </p>
        </div>
        <div className="header-decoration">
          <div className="decoration-circle"></div>
          <div className="decoration-circle"></div>
          <div className="decoration-circle"></div>
        </div>
      </div>

      <div className="workflow-container">
        <div className="workflow-sidebar">
          <div className="sidebar-card">
            <h3 className="sidebar-title">
              <FiList />
              Quick Tips
            </h3>
            <ul className="tips-list">
              <li>
                <FiInfo />
                <span>Chain tasks in order for sequential execution</span>
              </li>
              <li>
                <FiClock />
                <span>Use cron expressions for scheduled automation</span>
              </li>
              <li>
                <FiActivity />
                <span>Monitor workflow execution in real-time</span>
              </li>
              <li>
                <FiCheck />
                <span>Test workflow before production deployment</span>
              </li>
            </ul>
          </div>

          <div className="sidebar-card">
            <h3 className="sidebar-title">
              <FiClock />
              Cron Examples
            </h3>
            <div className="cron-examples">
              <button 
                type="button"
                className="cron-example-btn"
                onClick={() => handleCronExamples('0 0 * * *')}
              >
                Daily at midnight
              </button>
              <button 
                type="button"
                className="cron-example-btn"
                onClick={() => handleCronExamples('0 */2 * * *')}
              >
                Every 2 hours
              </button>
              <button 
                type="button"
                className="cron-example-btn"
                onClick={() => handleCronExamples('0 9 * * 1-5')}
              >
                Weekdays at 9 AM
              </button>
              <button 
                type="button"
                className="cron-example-btn"
                onClick={() => handleCronExamples('*/15 * * * *')}
              >
                Every 15 minutes
              </button>
            </div>
          </div>
        </div>

        <div className="workflow-main">
          <form onSubmit={handleSubmit} className="workflow-form">
            {error && (
              <div className="alert alert-error">
                <div className="alert-icon">⚠️</div>
                <div className="alert-content">{error}</div>
              </div>
            )}
            
            {success && (
              <div className="alert alert-success">
                <div className="alert-icon">✅</div>
                <div className="alert-content">{success}</div>
              </div>
            )}

            <div className="form-sections">
              {/* Basic Information Section */}
              <div className="form-section">
                <div className="section-header">
                  <div className="section-icon">
                    <FiPlus />
                  </div>
                  <div className="section-info">
                    <h3 className="section-title">Basic Information</h3>
                    <p className="section-description">Define your workflow identity</p>
                  </div>
                  <div className="section-number">01</div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">
                      <span className="label-icon">🏷️</span>
                      Workflow Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                      placeholder="e.g., Daily Data Pipeline"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="workflowId" className="form-label">
                      <span className="label-icon">🆔</span>
                      Workflow ID
                    </label>
                    <input
                      type="text"
                      id="workflowId"
                      name="workflowId"
                      value={formData.workflowId}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Auto-generated if left empty"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="description" className="form-label">
                    <span className="label-icon">📝</span>
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="form-textarea"
                    placeholder="Describe what this workflow does, its purpose, and expected outcomes..."
                  />
                </div>
              </div>

              {/* Task Selection Section */}
              <div className="form-section">
                <div className="section-header">
                  <div className="section-icon">
                    <FiList />
                  </div>
                  <div className="section-info">
                    <h3 className="section-title">Task Configuration</h3>
                    <p className="section-description">Select and order your pipeline tasks</p>
                  </div>
                  <div className="section-number">02</div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span className="label-icon">⚡</span>
                    Select Tasks *
                  </label>
                  {tasks.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon">📭</div>
                      <h4 className="empty-title">No Tasks Available</h4>
                      <p className="empty-description">
                        Create tasks first to build your workflow pipeline
                      </p>
                    </div>
                  ) : (
                    <>
                      <MultiSelectDropdown
                        options={tasks.map(task => ({
                          value: task.taskId,
                          label: `${task.name}${task.description ? ` - ${task.description}` : ''}`
                        }))}
                        value={formData.taskIds}
                        onChange={handleTaskSelectChange}
                        placeholder="Search and select tasks..."
                      />
                      <small className="form-hint">
                        <FiInfo />
                        Tasks will execute in the selected order
                      </small>
                    </>
                  )}
                </div>

                {/* Selected Tasks Preview */}
                {selectedTasks.length > 0 && (
                  <div className="selected-tasks-preview">
                    <h4 className="preview-title">
                      <FiCheck />
                      Selected Tasks ({selectedTasks.length})
                    </h4>
                    <div className="tasks-flow">
                      {selectedTasks.map((task, index) => (
                        <div key={task.taskId} className="task-flow-item">
                          <div className="task-flow-number">{index + 1}</div>
                          <div className="task-flow-content">
                            <div className="task-flow-name">{task.name}</div>
                            <div className="task-flow-type">{task.lambdaFunctionName}</div>
                          </div>
                          {index < selectedTasks.length - 1 && (
                            <div className="task-flow-arrow">
                              <FiChevronRight />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Schedule & Settings Section */}
              <div className="form-section">
                <div className="section-header">
                  <div className="section-icon">
                    <FiCalendar />
                  </div>
                  <div className="section-info">
                    <h3 className="section-title">Schedule & Settings</h3>
                    <p className="section-description">Configure automation and runtime behavior</p>
                  </div>
                  <div className="section-number">03</div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="cronExpression" className="form-label">
                      <span className="label-icon">⏰</span>
                      Cron Schedule
                    </label>
                    <input
                      type="text"
                      id="cronExpression"
                      name="cronExpression"
                      value={formData.cronExpression}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="0 0 * * * (daily at midnight)"
                    />
                    <small className="form-hint">
                      <FiClock />
                      Leave empty for manual execution only
                    </small>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <span className="label-icon">⚙️</span>
                      Workflow Status
                    </label>
                    <div className="status-toggle">
                      <button
                        type="button"
                        className={`status-toggle-btn ${formData.status === 'ACTIVE' ? 'active' : ''}`}
                        onClick={handleStatusToggle}
                      >
                        <FiPlay />
                        Active
                      </button>
                      <button
                        type="button"
                        className={`status-toggle-btn ${formData.status === 'PAUSED' ? 'active' : ''}`}
                        onClick={handleStatusToggle}
                      >
                        <FiPause />
                        Paused
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={loading || tasks.length === 0}
              >
                {loading ? (
                  <>
                    <span className="btn-spinner"></span>
                    Creating Workflow...
                  </>
                ) : (
                  <>
                    <FiPlus />
                    Create Workflow
                  </>
                )}
              </button>
              
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => {
                  setFormData({
                    workflowId: '',
                    name: '',
                    description: '',
                    taskIds: [],
                    status: 'ACTIVE',
                    cronExpression: '',
                  });
                }}
              >
                Clear Form
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateWorkflow;