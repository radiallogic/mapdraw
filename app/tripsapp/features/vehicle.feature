Feature: Vehicle API

  Scenario: POST invalid vehicle JSON
    When I post invalid vehicle JSON to /vehicle/
    Then I get a 422

  Scenario: POST valid vehicle JSON to add vehicle
    Given I have a working user
    When I post valid vehicle JSON to /vehicle/
    Then I get a 201

  Scenario: POST valid vehicle JSON that already exists
    Given I have a working user
    And I have already added the vehicle
    When I post valid vehicle JSON to /vehicle/
    Then I get a 201

  Scenario: GET a vehicle 
    When I access the url /vehicle/id
    Then I get a valid JSON response

  Scenario: GET a list of vehicles
    Given there is more than one vehicle in the database
    When I access the url /vehicle/
    Then I get a list of vehicles
    And I get a valid JSON response

