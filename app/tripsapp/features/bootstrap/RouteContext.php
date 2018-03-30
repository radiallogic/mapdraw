<?php

use Behat\Behat\Context\Context;
use Behat\Gherkin\Node\PyStringNode;
use Behat\Gherkin\Node\TableNode;

/**
 * Defines application features from the specific context.
 */
class RouteContext extends GuzzleContext
{
     /**
     * @When I post invalid route JSON to \/trip\/{id}\/route\/
     */
    public function iPostInvalidRouteJsonToTripIdRoute()
    {
        $json = '';
        $res = $this->client->post('/trip/'. $id . '/route/' . $json);
    }

    /**
     * @When I post valid route JSON to \/trip\/{id}\/route\/
     */
    public function iPostValidRouteJsonToTripIdRoute()
    {
        $json = '';
        $res = $this->client->post('/trip/'. $id . '/route/' . $json);
    }

    /**
     * @When I access the url \/trip\/{id}\/route\/{id}
     */
    public function iAccessTheUrlTripIdRouteId()
    {
        $res = $this->client->post('/trip/'. $id . '/route/' . $id);
    }

    /**
     * @Given there is more than one route in the database
     */
    public function thereIsMoreThanOneRouteInTheDatabase()
    {
        throw new PendingException();
    }

    /**
     * @When I access the url \/trip\/{id}\/route\/
     */
    public function iAccessTheUrlTripIdRoute()
    {
        $res = $this->client->get('/trip/'.$id . '/route/');
    }

    /**
     * @Then I get a list of routes
     */
    public function iGetAListOfRoutes()
    {
        $this->isList();
    }

    /**
     * @Given there is more than one route for a trip
     */
    public function thereIsMoreThanOneRouteForATrip()
    {
        throw new PendingException();
    }
    
    
}
