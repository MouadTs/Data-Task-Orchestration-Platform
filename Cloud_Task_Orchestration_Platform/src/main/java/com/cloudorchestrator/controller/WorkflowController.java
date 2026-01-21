package com.cloudorchestrator.controller;

import com.cloudorchestrator.model.Workflow;
import com.cloudorchestrator.repository.WorkflowRepository;
import com.cloudorchestrator.service.WorkflowOrchestrator;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/workflows")
public class WorkflowController {

    private final WorkflowRepository repository;
    private final WorkflowOrchestrator orchestrator; // Inject the Engine

    // Constructor Injection for both Repository and Orchestrator
    public WorkflowController(WorkflowRepository repository, WorkflowOrchestrator orchestrator) {
        this.repository = repository;
        this.orchestrator = orchestrator;
    }

    // 1. Create Workflow
    @PostMapping
    public ResponseEntity<Workflow> createWorkflow(@RequestBody Workflow workflow) {
        workflow.setCreatedAt(Instant.now());
        workflow.setUpdatedAt(Instant.now());
        Workflow saved = repository.save(workflow);
        return ResponseEntity.ok(saved);
    }

    // 2. Get All
    @GetMapping
    public ResponseEntity<List<Workflow>> getAllWorkflows() {
        return ResponseEntity.ok(repository.findAll());
    }

    // 3. Get One
    @GetMapping("/{id}")
    public ResponseEntity<Workflow> getWorkflow(@PathVariable String id) {
        Workflow workflow = repository.findById(id);
        if (workflow == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(workflow);
    }

    // 4. Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWorkflow(@PathVariable String id) {
        repository.delete(id);
        return ResponseEntity.noContent().build();
    }

    // ⭐ 5. EXECUTE WORKFLOW  ⭐
    @PostMapping("/{id}/execute")
    public ResponseEntity<String> executeWorkflow(@PathVariable String id) {
        // Run the logic
        orchestrator.runWorkflow(id);
        
        return ResponseEntity.ok("Workflow execution started! Check your console logs.");
    }
}