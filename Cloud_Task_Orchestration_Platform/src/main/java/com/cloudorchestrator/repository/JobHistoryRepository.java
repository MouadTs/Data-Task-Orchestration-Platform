package com.cloudorchestrator.repository;

import com.cloudorchestrator.model.JobHistory;
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.TableSchema;

import java.util.UUID;

@Repository
public class JobHistoryRepository {
    private final DynamoDbTable<JobHistory> table;

    public JobHistoryRepository(DynamoDbEnhancedClient client) {
        this.table = client.table("job_history", TableSchema.fromBean(JobHistory.class));
    }

    public JobHistory save(JobHistory job) {
        if (job.getJobId() == null) {
            job.setJobId(UUID.randomUUID().toString());
        }
        table.putItem(job);
        return job;
    }
}