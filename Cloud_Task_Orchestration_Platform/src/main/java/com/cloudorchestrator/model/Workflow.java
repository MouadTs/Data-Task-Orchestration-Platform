package com.cloudorchestrator.model;

import lombok.*;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.*;
import java.time.Instant;
import java.util.List;

@DynamoDbBean
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Workflow {

    private String workflowId;
    private String name;
    private String description;
    
    // Links to the separate "Task" table
    private List<String> taskIds; 
    
    private String status; // e.g., "ACTIVE", "PAUSED"
    private Instant createdAt;
    private Instant updatedAt;
    
 // ⭐ NEW FIELD FOR SCHEDULER ⭐
    private String cronExpression; // e.g. "0/60 * * * * *" (Every minute)

    // --- AWS DYNAMODB CONFIGURATION ---

    public String getCronExpression() {
		return cronExpression;
	}

	public void setCronExpression(String cronExpression) {
		this.cronExpression = cronExpression;
	}

	@DynamoDbPartitionKey
    @DynamoDbAttribute("id") // Mapped to "id" because that is your AWS Table's Partition Key
    public String getWorkflowId() {
        return workflowId;
    }

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public List<String> getTaskIds() {
		return taskIds;
	}

	public void setTaskIds(List<String> taskIds) {
		this.taskIds = taskIds;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public Instant getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Instant createdAt) {
		this.createdAt = createdAt;
	}

	public Instant getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(Instant updatedAt) {
		this.updatedAt = updatedAt;
	}

	public void setWorkflowId(String workflowId) {
		this.workflowId = workflowId;
	}
}