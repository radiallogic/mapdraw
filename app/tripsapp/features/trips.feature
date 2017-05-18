Feature: trip API

  Scenario: POST invalid trip JSON
    When I post invalid trip JSON to /trip/
    Then I get a 422

  Scenario: POST valid trip JSON
    Given I have a working user
    When I post valid trip JSON to /trip/
    Then I get a 201

  Scenario: GET a trip 
    When I access the url /trip/{id}
    Then I get a valid JSON response

  Scenario: GET a list of trips
    Given there is more than one trip in the database
    When I access the url /trip/
    Then I get a list of trips
    And I get a valid JSON response


