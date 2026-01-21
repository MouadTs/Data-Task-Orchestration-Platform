package com.cloudorchestrator.model;

import lombok.*;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.*;

// Useful for storing preferences & account-level data.
@DynamoDbBean
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfile {

    private String userId;
    private String email;
    private String role; // ADMIN / USER

    @DynamoDbPartitionKey
    @DynamoDbAttribute("userId")
    public String getUserId() { return userId; }

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}
    
    
}
