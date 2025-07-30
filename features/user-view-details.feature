Feature: View User Details
  As a system administrator
  I want to view detailed information about users
  So that I can see all user data

  Background:
    Given I have seeded users in the system
    And I am on the dashboard
    And the table is ready
    And I refresh the table

  Scenario: View details of an existing user
    When I open and wait for view the details for the first seeded user
    Then the user details request should return status 200
    And I should see the user details displayed correctly
    And I should close the user form
