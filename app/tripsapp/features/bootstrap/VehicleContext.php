<?php

use Behat\Behat\Context\Context;
use Behat\Gherkin\Node\PyStringNode;
use Behat\Gherkin\Node\TableNode;

/**
 * Defines application features from the specific context.
 */
class VehicleContext extends mainContext
{

   /**
     * @When I post invalid vehicle JSON to \/vehicle\/
     */
    public function iPostInvalidVehicleJsonToVehicle()
    {
        $json = '';
        $res = $this->client->post('/url/' . $json);
    }

    /**
     * @When I post valid vehicle JSON to \/vehicle\/
     */
    public function iPostValidVehicleJsonToVehicle()
    {
        $json = '';
        $res = $this->client->post('/url/' . $json);
    }

    /**
     * @Given I have already added the vehicle
     */
    public function iHaveAlreadyAddedTheVehicle()
    {
        $json = '';
        $res = $this->client->get('/url/' . $json);
    }

    /**
     * @When I access the url \/vehicle\/id
     */
    public function iAccessTheUrlVehicleId()
    {
        $json = '';
        $res = $this->client->get('/url/' . $json);
    }

    /**
     * @When I access the url \/vehicle\/
     */
    public function iAccessTheUrlVehicle()
    {
        $res = $this->client->get('/url/' );
    }

    /**
     * @Then I get a list of vehicles
     */
    public function iGetAListOfVehicles()
    {
        $this->isList();
    }
}
