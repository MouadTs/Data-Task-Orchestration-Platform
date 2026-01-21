package com.cloudorchestrator.repository;

import com.cloudorchestrator.model.Workflow;
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.Key;
import software.amazon.awssdk.enhanced.dynamodb.TableSchema;

import java.util.Iterator;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Repository
public class WorkflowRepository {

    private final DynamoDbTable<Workflow> workflowTable;

    public WorkflowRepository(DynamoDbEnhancedClient enhancedClient) {
        // Mapps the "Workflows" table in AWS to your Workflow.class
        this.workflowTable = enhancedClient.table("Workflow", TableSchema.fromBean(Workflow.class));
    }

    // Save (Create or Update)
    public Workflow save(Workflow workflow) {
        if (workflow.getWorkflowId() == null || workflow.getWorkflowId().isEmpty()) {
            workflow.setWorkflowId(UUID.randomUUID().toString()); // Generate ID if new
        }
        workflowTable.putItem(workflow);
        return workflow;
    }

    // Find One by ID
    public Workflow findById(String workflowId) {
        return workflowTable.getItem(Key.builder().partitionValue(workflowId).build());
    }

    // Find All (Scan - fine for small apps, use carefully in production)
    public List<Workflow> findAll() {
        List<Workflow> workflows = new ArrayList<>();
        Iterator<Workflow> results = workflowTable.scan().items().iterator();
        results.forEachRemaining(workflows::add);
        return workflows;
    }

    // Delete
    public void delete(String workflowId) {
        workflowTable.deleteItem(Key.builder().partitionValue(workflowId).build());
    }
}