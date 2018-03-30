<?php

use Behat\Behat\Context\Context;
use Behat\Gherkin\Node\PyStringNode;
use Behat\Gherkin\Node\TableNode;

/**
 * Defines application features from the specific context.
 */
class TripsContext extends GuzzleContext
{
    
    /**
     * @When I post invalid trip JSON to \/trip\/
     */
    public function iPostInvalidTripJsonToTrip()
    {
        $json = '';
        $res = $this->client->post('/trip/' . $json);
    }

    /**
     * @When I post valid trip JSON to \/trip\/
     */
    public function iPostValidTripJsonToTrip()
    {
        $json = '';
        $res = $this->client->post('/trip/' . $json);
    }

    /**
     * @When I access the url \/trip\/{id}
     */
    public function iAccessTheUrlTripId()
    {
        $res = $this->client->get('/trip/' . $id);
    }

    /**
     * @Given there is more than one trip in the database
     */
    public function thereIsMoreThanOneTripInTheDatabase()
    {
        throw new PendingException();
    }

    /**
     * @When I access the url \/trip\/
     */
    public function iAccessTheUrlTrip()
    {
        $res = $this->client->get('/trip/');
    }

    /**
     * @Then I get a list of trips
     */
    public function iGetAListOfTrips()
    {
        $this->isList();
    }
}
