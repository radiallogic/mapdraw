Feature: route API

  Scenario: POST invalid route JSON
    When I post invalid route JSON to /trip/{id}/route/
    Then I get a 422

  Scenario: POST valid route JSON
    Given I have a working user
    When I post valid route JSON to /trip/{id}/route/
    Then I get a 201

  Scenario: GET a route 
    When I access the url /trip/{id}/route/{id}
    Then I get a valid JSON response

  Scenario: GET a list of routes
    When I access the url /trip/{id}/route/
    Then I get a list of routes
    And I get a valid JSON response
    
  Scenario: GET a list of routes from a tripid
    Given there is more than one route for a trip
    When I access the url /trip/{id}/route/
    Then I get a list of routes
    And I get a valid JSON response

