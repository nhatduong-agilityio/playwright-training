Feature: User Management API
  As a system administrator
  I want to manage users through the API
  So that I can create, read, update, delete, search and sort users

  Background:
    Given I have access to the user management API

  Scenario: Create user with valid data
    When I create a user with valid email and password
    Then status is 200
    And response has prop "email"
    And response has prop "id"
    And response has prop "collectionName" = "users"

  Scenario: Create user with invalid data
    When I attempt to create a user with empty fields
    Then the request should fail
    And the response should contain validation errors

  Scenario: View user details
    Given I have created a user with valid data
    When I request the user details by ID
    Then status is 200
    And the email should match the created user
    And response object matches:
  ```
  {
  "collectionId": "POWMOh0W6IoLUAI",
  "collectionName": "users",
  "emailVisibility": true
  }
  ```

  Scenario: Edit user with valid data
    Given I have created a user with valid data
    When I update the user name to "Updated User"
    Then status is 200
    And the user name should be "Updated User"
    And response has prop "name" = "Updated User"

  Scenario: Edit user with invalid data
    Given I have created a user with valid data
    When I attempt to update the user with an invalid email
    Then the update should fail
    And the response should contain validation errors

  Scenario: Delete user
    Given I have created a user with valid data
    When I delete the user by ID
    Then status is 204
    And requesting the user details should return 404

  Scenario: Sort users by column
    When I request users sorted by email in descending order
    Then status is 200
    And response has prop "items"

  Scenario: Search users by keyword
    Given I have created a user with valid data
    When I search for users by email
    Then status is 200
    And the results should contain the created user

