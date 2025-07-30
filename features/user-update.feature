Feature: Update User Record
  As a system administrator
  I want to update existing user records
  So that I can modify user information

  Background:
    Given I have seeded users in the system
    And I am on the dashboard
    And the table is ready
    And I refresh the table
    And I open the details for the first seeded user

  Scenario: Update user with valid data
    When I update the user with the following data:
      | field    | value            |
      | username | updated_username |
      | name     | Updated Name     |
    Then the user should be updated successfully with status 200
    And I should see a success message "Successfully updated record."

  Scenario: Update user with invalid email
    When I attempt to update the user with invalid email "invalid-email"
    Then I should see a validation error "Email is not valid"
    And I should close the user form
