Feature: kitList API

  Scenario: POST invalid kitList JSON
    When I post invalid kitList JSON to /kitList/
    Then I get a 422

  Scenario: POST valid kitList JSON
    Given I have a working user
    When I post valid kitList JSON to /kitList/
    Then I get a 201

  Scenario: GET a kitList 
    When I access the url /kitList/id
    Then I get a valid JSON response

  Scenario: GET a list of kitLists
    Given there is more than one kitList in the database
    When I access the url /kitList/
    Then I get a list of kitLists
    And I get a valid JSON response

