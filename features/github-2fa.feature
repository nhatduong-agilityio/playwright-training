@skip
Feature: GitHub Google OAuth Login with 2FA
  As a user
  I want to log into GitHub using Google OAuth with 2FA
  So that I can access my GitHub account securely

  Background:
    Given I have navigated to GitHub
    And I have clicked the sign in button

  Scenario: Successful GitHub OAuth login with Google credentials and 2FA
    When I click Google sign in
    And I enter valid Google email and password
    And I verify and enter 2FA code using try another way
    And I generate and enter real TOTP code
    And I allow OAuth permissions
    Then I should be logged into GitHub successfully
    And I should see my username displayed correctly
