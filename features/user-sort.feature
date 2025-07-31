Feature: Sort User Records
  As a system administrator
  I want to sort user records by different fields
  So that I can organize the user list effectively

  Background:
    Given I have seeded users in the system
    And I am on the dashboard
    And the table is ready
    And I refresh the table

  Scenario Outline: Sort users by different fields
    When I sort users by "<field>" in ascending order
    Then the sort request should return status 200
    And the users should be sorted by "<field>" in ascending order
    When I sort users by "<field>" in descending order
    Then the sort request should return status 200
    And the users should be sorted by "<field>" in descending order

    Examples:
      | field    |
      | id       |
      | email    |
      | username |
      | name     |
      | created  |
      | updated  |
