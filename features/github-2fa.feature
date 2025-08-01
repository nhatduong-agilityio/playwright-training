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
    And I enter "TEST_GOOGLE_EMAIL" and "TEST_GOOGLE_PASSWORD" credentials on Google
    And I select the verification from otp code option
    And I generate and enter real OTP code
    And I allow permissions to login with Google
    Then I should be logged into GitHub successfully
    And I should see "TEST_GITHUB_USERNAME" account name displayed correctly
