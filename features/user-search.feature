Feature: Search User Records
  As a system administrator
  I want to search for user records
  So that I can quickly find specific users

  Background:
    Given I have seeded users in the system
    And I am on the dashboard
    And the table is ready
    And I refresh the table

  Scenario Outline: Search users by different fields
    When I search for users by "<field>" with the first seeded user's "<field>" value
    Then the search should return results with status 200
    And the user should appear in the search results

    Examples:
      | field    |
      | email    |
      | username |
      | name     |

  Scenario: Clear search results
    Given I have performed a search
    When I clear the search
    Then all users should be visible again
