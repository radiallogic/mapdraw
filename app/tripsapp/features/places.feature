Feature: places API

  Scenario: POST invalid place JSON
    When I post invalid place JSON to /place/
    Then I get a 422

  Scenario: POST valid place JSON
    Given I have a working user
    When I post valid place JSON to /place/
    Then I get a 201

  Scenario: GET a place 
    When I access the url /place/id
    Then I get a valid JSON response

  Scenario: GET a list of places
    Given there is more than one place in the database
    When I access the url /place/
    Then I get a list of places
    And I get a valid JSON response
