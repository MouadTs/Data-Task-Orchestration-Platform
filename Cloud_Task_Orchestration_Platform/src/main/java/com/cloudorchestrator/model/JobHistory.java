package com.cloudorchestrator.model;

import java.time.Instant;
import java.util.List;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbAttribute;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbBean;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbPartitionKey;

@DynamoDbBean
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobHistory {
	private String jobId;
    private String workflowId;
    private String status; // "RUNNING", "COMPLETED", "FAILED"
    private Instant startTime;
    private Instant endTime;
    
    // Stores the sequence of what happened: 
    // [{"step": "TaskA", "result": "..."}, {"step": "TaskB", "result": "..."}]
    private List<Map<String, String>> logs; 
    
    
    public String getWorkflowId() {
		return workflowId;
	}


	public void setWorkflowId(String workflowId) {
		this.workflowId = workflowId;
	}


	public String getStatus() {
		return status;
	}


	public void setStatus(String status) {
		this.status = status;
	}


	public Instant getStartTime() {
		return startTime;
	}


	public void setStartTime(Instant startTime) {
		this.startTime = startTime;
	}


	public Instant getEndTime() {
		return endTime;
	}


	public void setEndTime(Instant endTime) {
		this.endTime = endTime;
	}


	public List<Map<String, String>> getLogs() {
		return logs;
	}


	public void setLogs(List<Map<String, String>> logs) {
		this.logs = logs;
	}


	public void setJobId(String jobId) {
		this.jobId = jobId;
	}


	@DynamoDbPartitionKey
    @DynamoDbAttribute("jobId")
    public String getJobId() { return jobId; }
}
