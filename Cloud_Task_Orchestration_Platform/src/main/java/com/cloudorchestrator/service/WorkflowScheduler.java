package com.cloudorchestrator.service;

import com.cloudorchestrator.model.Workflow;
import com.cloudorchestrator.repository.WorkflowRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.scheduling.support.CronExpression;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class WorkflowScheduler {

    private final WorkflowRepository repository;
    private final WorkflowOrchestrator orchestrator;

    public WorkflowScheduler(WorkflowRepository repository, WorkflowOrchestrator orchestrator) {
        this.repository = repository;
        this.orchestrator = orchestrator;
    }

    // Runs every 1 minute (60,000 ms)
    @Scheduled(fixedRate = 60000)
    public void scheduleCheck() {
        System.out.println("⏰ SCHEDULER: Checking schedules at " + LocalDateTime.now());

        List<Workflow> workflows = repository.findAll();

        for (Workflow wf : workflows) {
            if ("ACTIVE".equalsIgnoreCase(wf.getStatus()) && wf.getCronExpression() != null) {
                
                if (shouldRunNow(wf.getCronExpression())) {
                    System.out.println("    ⚡ IT IS TIME! Triggering: " + wf.getName());
                    orchestrator.runWorkflow(wf.getWorkflowId());
                }
            }
        }
    }

    /**
     * The Logic:
     * 1. Take the Cron String (e.g. "0 0 12 * * *")
     * 2. Calculate the "Next Execution Time" starting from 1 minute ago.
     * 3. If that "Next Time" is BEFORE right now, it means it's due!
     */
    private boolean shouldRunNow(String cron) {
        try {
            // Spring's built-in parser
            CronExpression expression = CronExpression.parse(cron);
            
            LocalDateTime now = LocalDateTime.now();
            LocalDateTime oneMinuteAgo = now.minusMinutes(1);

            // Ask: "When is the next run after 1 minute ago?"
            LocalDateTime nextRun = expression.next(oneMinuteAgo);

            // If the next run is in the past (or exactly now), we run it.
            if (nextRun != null && (nextRun.isBefore(now) || nextRun.equals(now))) {
                return true;
            }
        } catch (IllegalArgumentException e) {
            System.err.println("    ⚠️ Invalid Cron Expression: " + cron);
        }
        return false;
    }
}