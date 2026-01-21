package com.cloudorchestrator.repository;


import com.cloudorchestrator.model.Task;
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.Key;
import software.amazon.awssdk.enhanced.dynamodb.TableSchema;

import java.util.List;
import java.util.UUID;

@Repository
public class TaskRepository {

    private final DynamoDbTable<Task> taskTable;

    public TaskRepository(DynamoDbEnhancedClient enhancedClient) {
        // Connects to AWS Table named "task"
        this.taskTable = enhancedClient.table("task", TableSchema.fromBean(Task.class));
    }

    public Task save(Task task) {
        if (task.getTaskId() == null || task.getTaskId().isEmpty()) {
            task.setTaskId(UUID.randomUUID().toString());
        }
        taskTable.putItem(task);
        return task;
    }

    public Task findById(String taskId) {
        return taskTable.getItem(Key.builder().partitionValue(taskId).build());
    }

    public List<Task> findAll() {
        return taskTable.scan().items().stream().toList();
    }
    
    public void delete(String taskId) {
        taskTable.deleteItem(Key.builder().partitionValue(taskId).build());
    }
}