Feature: User Login
  As a user
  I want to log into the application
  So that I can access my dashboard and use the system

  Background:
    Given I have a clean session with no stored authentication
    And I am on the login page

  Scenario: Successful login with valid credentials
    When I enter "TEST_EMAIL" and "TEST_PASSWORD" credentials
    And I submit the login form
    Then I should be logged in successfully
    And I should see the dashboard

  Scenario: Login fails with invalid password
    When I enter valid email "admin@example.com" and invalid password "wrongpass"
    And I submit the login form
    Then I should see an error message "Invalid login credentials"
    And I should remain on the login page

  Scenario: Login fails with empty credentials
    When I leave email and password fields empty
    And I submit the login form
    Then I should see validation errors for empty fields
    And I should remain on the login page

  Scenario Outline: Login fails with various invalid credentials
    When I enter email "<email>" and password "<password>"
    And I submit the login form
    Then I should see an error message "<error_message>"
    And I should remain on the login page

    Examples:
      | email             | password    | error_message             |
      | invalid@email.com | password123 | Invalid login credentials |
      | test@example.com  | wrongpass   | Invalid login credentials |
