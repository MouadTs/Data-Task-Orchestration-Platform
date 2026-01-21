package com.cloudorchestrator.service;


import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.SdkBytes;
import software.amazon.awssdk.services.lambda.LambdaClient;
import software.amazon.awssdk.services.lambda.model.InvokeRequest;
import software.amazon.awssdk.services.lambda.model.InvokeResponse;

@Service
public class LambdaInvocationService {

    private final LambdaClient lambdaClient;

    // We inject the configured client from Step 1 here
    public LambdaInvocationService(LambdaClient lambdaClient) {
        this.lambdaClient = lambdaClient;
    }

    public String invokeFunction(String functionName, String jsonPayload) {
        try {
            SdkBytes payload = SdkBytes.fromUtf8String(jsonPayload);

            InvokeRequest request = InvokeRequest.builder()
                    .functionName(functionName)
                    .payload(payload)
                    .build();

            InvokeResponse response = lambdaClient.invoke(request);
            return response.payload().asUtf8String();

        } catch (Exception e) {
            System.err.println("Error invoking Lambda: " + e.getMessage());
            return "{\"error\": \"" + e.getMessage() + "\"}";
        }
    }
}