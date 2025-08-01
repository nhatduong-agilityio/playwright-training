Feature: Create User Record
  As a system administrator
  I want to create new user records through the UI
  So that I can manage users in the system

  Background:
    Given I am on the dashboard
    And the table is ready
    When I click the new record button

  Scenario: Create user with valid data
    When I create a user with the following data:
      | field           | value    |
      | email           | email    |
      | password        | password |
      | username        | username |
      | name            | name     |
      | emailVisibility | true     |
    Then the user should be created successfully with status 200
    And the user should appear in the table
    And the user data should match what was entered

  Scenario: Create user with empty fields
    When I attempt to create a user with empty email and password
    Then I should see a validation error "Email is required"
    And I should close the user form

  Scenario: Create user with invalid email format
    When I attempt to create a user with invalid email "invalid-email"
    Then I should see a validation error "Email is not valid"
    And I should close the user form

  Scenario: Create user with mismatched password confirmation
    When I attempt to create a user with mismatched passwords
    Then I should see a validation error "Passwords do not match"
    And I should close the user form
