import React, { useState } from 'react';
import { taskService } from '../services/api';
import MultiSelectDropdown from './MultiSelectDropdown';
import './CreateTask.css';

// Database options with logos/icons
const DATABASE_OPTIONS = [
  {
    id: 'dynamodb',
    name: 'Amazon DynamoDB',
    logo: '🔶',
    description: 'Fully managed NoSQL database',
    color: '#4051b5',
    isAvailable: true
  },
  {
    id: 's3',
    name: 'Amazon S3',
    logo: '🪣',
    description: 'Object storage service',
    color: '#ff9900',
    isAvailable: false
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    logo: '🐘',
    description: 'Advanced open-source database',
    color: '#336791',
    isAvailable: false
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    logo: '🍃',
    description: 'Document-oriented database',
    color: '#47a248',
    isAvailable: false
  }
];

// CONFIGURATION
const TASK_TYPES = {
  COLLECTION: {
    id: 'collection',
    label: '📥 Data Collection (Fetch Data)',
    lambdaName: 'mock-data-collector',
    showUrl: true,
    showCleaning: false,
    showSource: false,
    showDatabase: false,
    showNotification: false
  },
  TRANSFORMATION: {
    id: 'transformation',
    label: '⚡ Data Transformation (Clean/Process)',
    lambdaName: 'mock-data-transformer',
    showUrl: false,
    showCleaning: true,
    showSource: true,
    showDatabase: false,
    showNotification: false
  },
  STORAGE: {
    id: 'storage',
    label: '💾 Data Storage (Save Results)',
    lambdaName: 'mock-data-storage',
    showUrl: false,
    showCleaning: false,
    showSource: true,
    showDatabase: true,
    showNotification: false
  },
  NOTIFICATION: {
    id: 'notification',
    label: '📬 Notification & Reporting',
    lambdaName: 'mock-notifier',
    showUrl: false,
    showCleaning: false,
    showSource: true,
    showDatabase: false,
    showNotification: true
  }
};

const DATA_CLEANING_OPTIONS = [
  { value: 'remove_null', label: 'Remove Null Values' },
  { value: 'remove_nan', label: 'Remove NaN Values' },
  { value: 'clean_structure', label: 'Clean Data Structure' },
  { value: 'extract_fields', label: 'Extract Specific Fields' },
];

const CreateTask = ({ onTaskCreated }) => {
  const [selectedType, setSelectedType] = useState('COLLECTION');
  const [selectedDatabase, setSelectedDatabase] = useState('dynamodb');

  const [formData, setFormData] = useState({
    taskId: '',
    name: '',
    description: '',
    lambdaFunctionName: TASK_TYPES.COLLECTION.lambdaName,
    apiUrl: '',
    sourceTaskName: '',
    dataCleaningOptions: [],
    scheduleExpression: '',
    tableName: '',
    partitionKey: '',
    sortKey: '',
    topicArn: '',
    notificationMessage: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleTypeChange = (e) => {
    const typeKey = e.target.value;
    setSelectedType(typeKey);
    
    setFormData(prev => ({
      ...prev,
      lambdaFunctionName: TASK_TYPES[typeKey].lambdaName,
      apiUrl: TASK_TYPES[typeKey].showUrl ? prev.apiUrl : '',
      sourceTaskName: TASK_TYPES[typeKey].showSource ? prev.sourceTaskName : '',
      dataCleaningOptions: TASK_TYPES[typeKey].showCleaning ? prev.dataCleaningOptions : [],
      tableName: '',
      partitionKey: '',
      sortKey: '',
      topicArn: TASK_TYPES[typeKey].showNotification ? prev.topicArn : '',
      notificationMessage: TASK_TYPES[typeKey].showNotification ? prev.notificationMessage : '',
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      dataCleaningOptions: e.target.value,
    }));
  };

  const handleDatabaseSelect = (databaseId) => {
    setSelectedDatabase(databaseId);
  };

  const generateTaskId = () => {
    return `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const taskId = formData.taskId || generateTaskId();
      const currentConfig = TASK_TYPES[selectedType];
      const parameters = {};
      
      // 1. Map URL
      if (currentConfig.showUrl) {
        parameters.url = formData.apiUrl;
      }
      
      // 2. Map Cleaning Options
      if (currentConfig.showCleaning) {
        parameters.dataCleaningOptions = formData.dataCleaningOptions;
      }

      // 3. Map Source Task
      if (currentConfig.showSource) {
        parameters.source_task = formData.sourceTaskName;
      }

      // 4. Map Database Configuration
      if (currentConfig.showDatabase) {
        parameters.database = {
          type: selectedDatabase,
          tableName: formData.tableName,
          partitionKey: formData.partitionKey,
          sortKey: formData.sortKey || undefined,
        };
      }

      // 5. Map Notification Configuration
      if (currentConfig.showNotification) {
        parameters.topic_arn = formData.topicArn;
        parameters.message = formData.notificationMessage || 'Workflow Completed Successfully';
      }

      const taskPayload = {
        taskId,
        name: formData.name,
        description: formData.description,
        lambdaFunctionName: formData.lambdaFunctionName,
        parameters,
        scheduleExpression: formData.scheduleExpression || null,
      };

      await taskService.create(taskPayload);
      setSuccess(`✅ Task created successfully! Type: ${currentConfig.label}`);
      
      // Reset form
      setFormData({
        taskId: '',
        name: '',
        description: '',
        lambdaFunctionName: TASK_TYPES[selectedType].lambdaName,
        apiUrl: '',
        sourceTaskName: '',
        dataCleaningOptions: [],
        scheduleExpression: '',
        tableName: '',
        partitionKey: '',
        sortKey: '',
        topicArn: '',
        notificationMessage: '',
      });

      if (onTaskCreated) {
        onTaskCreated();
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || '❌ Failed to create task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const currentView = TASK_TYPES[selectedType];
  const selectedDbInfo = DATABASE_OPTIONS.find(db => db.id === selectedDatabase);

  return (
    <div className="create-task">
      <div className="page-header">
        <h2 className="page-title">Create New Data Pipeline Task</h2>
        <p className="page-subtitle">Configure your data processing workflow step by step</p>
      </div>
      
      <form onSubmit={handleSubmit} className="task-form">
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="form-section">
          <div className="section-header">
            <span className="section-number">01</span>
            <h3 className="section-title">Task Type</h3>
          </div>
          <div className="form-group">
            <label htmlFor="taskType" className="form-label">
              <span className="label-icon">📋</span>
              Select Task Type *
            </label>
            <div className="type-selector">
              {Object.entries(TASK_TYPES).map(([key, config]) => (
                <div 
                  key={key}
                  className={`type-option ${selectedType === key ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedType(key);
                    setFormData(prev => ({
                      ...prev,
                      lambdaFunctionName: config.lambdaName,
                      apiUrl: config.showUrl ? prev.apiUrl : '',
                      sourceTaskName: config.showSource ? prev.sourceTaskName : '',
                      dataCleaningOptions: config.showCleaning ? prev.dataCleaningOptions : [],
                      tableName: '',
                      partitionKey: '',
                      sortKey: '',
                      topicArn: config.showNotification ? prev.topicArn : '',
                      notificationMessage: config.showNotification ? prev.notificationMessage : '',
                    }));
                  }}
                >
                  <div className="type-icon">
                    {config.label.charAt(0)}
                  </div>
                  <div className="type-info">
                    <div className="type-name">{config.label}</div>
                    <div className="type-description">
                      {config.id === 'collection' && 'Fetch data from external APIs'}
                      {config.id === 'transformation' && 'Process and clean data'}
                      {config.id === 'storage' && 'Save processed data to database'}
                      {config.id === 'notification' && 'Send email notifications and reports'}
                    </div>
                  </div>
                  <div className="type-check">
                    {selectedType === key && '✓'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="section-header">
            <span className="section-number">02</span>
            <h3 className="section-title">Basic Information</h3>
          </div>
          
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              <span className="label-icon">🏷️</span>
              Task Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="form-input"
              placeholder="e.g., Step 1: Fetch User Data from API"
            />
            <small className="form-hint">
              <span className="hint-icon">💡</span>
              Important: Remember this name for chaining tasks together!
            </small>
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
              placeholder="Describe what this task does, expected input/output, and any special requirements..."
            />
          </div>
        </div>

        {/* --- DYNAMIC FIELDS --- */}

        {currentView.showUrl && (
          <div className="form-section">
            <div className="section-header">
              <span className="section-number">03</span>
              <h3 className="section-title">Data Source Configuration</h3>
            </div>
            <div className="form-group">
              <label htmlFor="apiUrl" className="form-label">
                <span className="label-icon">🌐</span>
                API Endpoint URL *
              </label>
              <input
                type="url"
                id="apiUrl"
                name="apiUrl"
                value={formData.apiUrl}
                onChange={handleInputChange}
                required
                className="form-input"
                placeholder="https://api.example.com/data"
              />
            </div>
          </div>
        )}

        {currentView.showSource && (
          <div className="form-section">
            <div className="section-header">
              <span className="section-number">03</span>
              <h3 className="section-title">Input Configuration</h3>
            </div>
            <div className="form-group">
              <label htmlFor="sourceTaskName" className="form-label">
                <span className="label-icon">🔗</span>
                Source Task Name *
              </label>
              <input
                type="text"
                id="sourceTaskName"
                name="sourceTaskName"
                value={formData.sourceTaskName}
                onChange={handleInputChange}
                required
                className="form-input"
                placeholder="Enter the exact name of the previous task"
              />
              <small className="form-hint">
                <span className="hint-icon">🔍</span>
                This task will process data from: <strong>{formData.sourceTaskName || 'No source specified'}</strong>
              </small>
            </div>
          </div>
        )}

        {currentView.showCleaning && (
          <div className="form-section">
            <div className="section-header">
              <span className="section-number">04</span>
              <h3 className="section-title">Data Transformation Rules</h3>
            </div>
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">✨</span>
                Cleaning & Transformation Rules
              </label>
              <MultiSelectDropdown
                options={DATA_CLEANING_OPTIONS}
                value={formData.dataCleaningOptions}
                onChange={handleSelectChange}
                placeholder="Select transformation rules to apply..."
              />
            </div>
          </div>
        )}

        {currentView.showDatabase && (
          <div className="form-section">
            <div className="section-header">
              <span className="section-number">04</span>
              <h3 className="section-title">Storage Configuration</h3>
            </div>
            
            <div className="database-selection">
              <label className="form-label">
                <span className="label-icon">🗄️</span>
                Select Database
              </label>
              <div className="database-grid">
                {DATABASE_OPTIONS.map((db) => (
                  <div 
                    key={db.id}
                    className={`database-card ${selectedDatabase === db.id ? 'active' : ''} ${!db.isAvailable ? 'disabled' : ''}`}
                    onClick={() => db.isAvailable && handleDatabaseSelect(db.id)}
                    style={{ '--db-color': db.color }}
                  >
                    <div className="database-logo">{db.logo}</div>
                    <div className="database-info">
                      <div className="database-name">{db.name}</div>
                      <div className="database-description">{db.description}</div>
                    </div>
                    <div className="database-status">
                      {!db.isAvailable && (
                        <span className="status-badge">Coming Soon</span>
                      )}
                      {db.isAvailable && selectedDatabase === db.id && (
                        <div className="selected-indicator">
                          <span className="check-icon">✓</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {selectedDbInfo && (
                <div className="selected-database-info">
                  <div className="selected-database-header">
                    <span className="db-logo">{selectedDbInfo.logo}</span>
                    <span className="db-name">{selectedDbInfo.name}</span>
                    <span className="db-status available">● Available</span>
                  </div>
                  <div className="selected-database-description">
                    {selectedDbInfo.description}
                  </div>
                </div>
              )}
            </div>

            <div className="database-configuration">
              <div className="config-grid">
                <div className="form-group">
                  <label htmlFor="tableName" className="form-label">
                    Table Name *
                  </label>
                  <input
                    type="text"
                    id="tableName"
                    name="tableName"
                    value={formData.tableName}
                    onChange={handleInputChange}
                    required={currentView.showDatabase}
                    className="form-input"
                    placeholder="e.g., UserData"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="partitionKey" className="form-label">
                    Partition Key *
                  </label>
                  <input
                    type="text"
                    id="partitionKey"
                    name="partitionKey"
                    value={formData.partitionKey}
                    onChange={handleInputChange}
                    required={currentView.showDatabase}
                    className="form-input"
                    placeholder="e.g., userId"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="sortKey" className="form-label">
                    Sort Key (Optional)
                  </label>
                  <input
                    type="text"
                    id="sortKey"
                    name="sortKey"
                    value={formData.sortKey}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g., timestamp"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {currentView.showNotification && (
          <div className="form-section">
            <div className="section-header">
              <span className="section-number">04</span>
              <h3 className="section-title">Notification Configuration</h3>
            </div>
            
            <div className="form-group">
              <label htmlFor="topicArn" className="form-label">
                <span className="label-icon">📧</span>
                SNS Topic ARN *
              </label>
              <input
                type="text"
                id="topicArn"
                name="topicArn"
                value={formData.topicArn}
                onChange={handleInputChange}
                required
                className="form-input"
                placeholder="arn:aws:sns:region:account-id:topic-name"
              />
              <small className="form-hint">
                <span className="hint-icon">ℹ️</span>
                The SNS topic where notifications will be sent
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="notificationMessage" className="form-label">
                <span className="label-icon">💬</span>
                Custom Message (Optional)
              </label>
              <textarea
                id="notificationMessage"
                name="notificationMessage"
                value={formData.notificationMessage}
                onChange={handleInputChange}
                rows="3"
                className="form-textarea"
                placeholder="Enter a custom message for the notification. Leave empty for default."
              />
              <small className="form-hint">
                <span className="hint-icon">📄</span>
                The notification will include execution logs and storage details automatically
              </small>
            </div>
          </div>
        )}

        <div className="form-section">
          <div className="section-header">
            <span className="section-number">05</span>
            <h3 className="section-title">Schedule & Automation</h3>
          </div>
          <div className="form-group">
            <label htmlFor="scheduleExpression" className="form-label">
              <span className="label-icon">⏰</span>
              Cron Schedule Expression
            </label>
            <input
              type="text"
              id="scheduleExpression"
              name="scheduleExpression"
              value={formData.scheduleExpression}
              onChange={handleInputChange}
              className="form-input"
              placeholder="0 0 * * * (runs daily at midnight)"
            />
            <small className="form-hint">
              <span className="hint-icon">📅</span>
              Leave empty for one-time execution. Format: minute hour day month day-of-week
            </small>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span>
                Creating Task...
              </>
            ) : (
              '🚀 Create Task'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTask;