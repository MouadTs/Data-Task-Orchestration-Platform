package com.cloudorchestrator.service;

import com.cloudorchestrator.model.JobHistory;
import com.cloudorchestrator.model.Task;
import com.cloudorchestrator.model.Workflow;
import com.cloudorchestrator.repository.JobHistoryRepository;
import com.cloudorchestrator.repository.TaskRepository;
import com.cloudorchestrator.repository.WorkflowRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;

@Service
public class WorkflowOrchestrator {

    private final WorkflowRepository workflowRepository;
    private final TaskRepository taskRepository;
    private final JobHistoryRepository jobHistoryRepository;
    private final LambdaInvocationService lambdaService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public WorkflowOrchestrator(WorkflowRepository workflowRepository,
                                TaskRepository taskRepository,
                                JobHistoryRepository jobHistoryRepository,
                                LambdaInvocationService lambdaService) {
        this.workflowRepository = workflowRepository;
        this.taskRepository = taskRepository;
        this.jobHistoryRepository = jobHistoryRepository;
        this.lambdaService = lambdaService;
    }

    public void runWorkflow(String workflowId) {
        Workflow workflow = workflowRepository.findById(workflowId);
        if (workflow == null) return;

        // 1. Initialize Job History
        JobHistory job = new JobHistory();
        job.setWorkflowId(workflowId);
        job.setStatus("RUNNING");
        job.setStartTime(Instant.now());
        job.setLogs(new ArrayList<>());
        job = jobHistoryRepository.save(job);

        System.out.println("🚀 STARTED JOB: " + job.getJobId());

        Map<String, Object> globalContext = new HashMap<>();

        try {
            List<String> taskIds = workflow.getTaskIds();
            if (taskIds != null) {
                for (String taskId : taskIds) {
                    Task task = taskRepository.findById(taskId);
                    if (task != null) {
                        
                        // Execute and get result
                        String result = executeTask(task, globalContext);

                        // ⭐ LOG RESULT TO CONSOLE HERE ⭐
                        System.out.println("    ✅ Lambda Response: " + result);
                        Map<String, Object> lambdaInput = new HashMap<>();
                        // Save result to Context
                        globalContext.put(task.getName(), result);

                        // Add to Logs
                        Map<String, String> logEntry = new HashMap<>();
                        logEntry.put("task", task.getName());
                        logEntry.put("result", result);
                        job.getLogs().add(logEntry);
                        
                        jobHistoryRepository.save(job);
                    }
                }
            }
            job.setStatus("COMPLETED");

        } catch (Exception e) {
            job.setStatus("FAILED");
            System.err.println("Workflow Failed: " + e.getMessage());
        } finally {
            job.setEndTime(Instant.now());
            jobHistoryRepository.save(job);
            System.out.println("🏁 JOB FINISHED. Status: " + job.getStatus());
        }
    }

    private String executeTask(Task task, Map<String, Object> globalContext) {
        if (task.getLambdaFunctionName() == null) return "No-Op";

        try {
            Map<String, Object> lambdaInput = new HashMap<>();
            
            if (task.getParameters() != null) { 
                lambdaInput.putAll(task.getParameters()); 
            }
            
            lambdaInput.put("context", globalContext);

            String jsonPayload = objectMapper.writeValueAsString(lambdaInput);

            System.out.println("    >>> Invoking: " + task.getLambdaFunctionName());
            return lambdaService.invokeFunction(task.getLambdaFunctionName(), jsonPayload);

        } catch (Exception e) {
            return "{\"error\": \"" + e.getMessage() + "\"}";
        }
    }
}