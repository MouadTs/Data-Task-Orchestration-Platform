package com.cloudorchestrator.model;

import lombok.*;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.*;

import java.time.Instant;
import java.util.Map;

// Stores execution results from Lambda 
@DynamoDbBean
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExecutionLog {

    private String logId;
    private String taskId;
    private Instant executedAt;
    private String status; // SUCCESS / FAILED
    private Map<String, Object> response;
    private String errorMessage;

    @DynamoDbPartitionKey
    @DynamoDbAttribute("logId")
    public String getLogId() { return logId; }

    @DynamoDbSecondaryPartitionKey(indexNames = "TaskIndex")
    @DynamoDbAttribute("taskId")
    public String getTaskId() { return taskId; }
}
