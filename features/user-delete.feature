Feature: Delete User Record
  As a system administrator
  I want to delete user records through the UI
  So that I can remove users from the system

  Background:
    Given I have seeded users in the system
    And I am on the dashboard
    And the table is ready
    And I refresh the table

  Scenario: Delete an existing user record
    When I delete the first seeded user
    Then the user should be deleted successfully with status 204
    And the user should no longer appear in the table
    And I should see a success message "Successfully deleted the selected record."
