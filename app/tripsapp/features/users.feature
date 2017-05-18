Feature: user API

  Scenario: Logged in user to see users page
    Given I have a working user
    When I access the url /user/login with the correct credentials
    Then I get logged in

  Scenario: POST invalid user JSON
    Given I am logged in
    When I post invalid user JSON to /user/
    Then I get a 422

  Scenario: POST valid user JSON to create user
    When I post valid user JSON to /user/
    Then I get a 201

  Scenario: GET a user 
    When I access the url /user/id
    Then I get a valid JSON response

  Scenario: GET a list of users
    When I access the url /user/
    Then I get a list of users
    And I get a valid JSON response
    


