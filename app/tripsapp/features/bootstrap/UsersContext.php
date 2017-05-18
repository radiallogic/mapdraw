<?php

use Behat\Behat\Context\Context;
use Behat\Gherkin\Node\PyStringNode;
use Behat\Gherkin\Node\TableNode;

/**
 * Defines application features from the specific context.
 */
class UsersContext extends mainContext
{
    /**
     * @When I access the url \/user\/login with the correct credentials
     */
    public function iAccessTheUrlUserLoginWithTheCorrectCredentials()
    {
        throw new PendingException();
    }

    /**
     * @Then I get logged in
     */
    public function iGetLoggedIn()
    {
        throw new PendingException();
    }

    /**
     * @Given I am logged in
     */
    public function iAmLoggedIn()
    {
        throw new PendingException();
    }

    /**
     * @When I post invalid user JSON to \/user\/
     */
    public function iPostInvalidUserJsonToUser()
    {
        $json = '';
        $res = $this->client->post('/user/' . $json);
    }

    /**
     * @When I post valid user JSON to \/user\/
     */
    public function iPostValidUserJsonToUser()
    {
        $json = '';
        $res = $this->client->post('/user/' . $json);
    }

    /**
     * @When I access the url \/user\/id
     */
    public function iAccessTheUrlUserId()
    {
        $id = '';
        $res = $this->client->get('/users/' . $id);
    }

    /**
     * @Given there is more than one user in the database
     */
    public function thereIsMoreThanOneUserInTheDatabase()
    {
        throw new PendingException();
    }

    /**
     * @When I access the url \/user\/
     */
    public function iAccessTheUrlUser()
    {
        $res = $this->client->get('/user/' );
    }

    /**
     * @Then I get a list of users
     */
    public function iGetAListOfUsers()
    {
        $this->isList();
    }
}
