<?php



use Behat\Behat\Context\Context;
use Behat\Gherkin\Node\PyStringNode;
use Behat\Gherkin\Node\TableNode;


/**
 * Defines application features from the specific context.
 */
class PlacesContext extends GuzzleContext
{
    
    /**
     * @When I post invalid place JSON to \/place\/
     */
    public function iPostInvalidPlaceJsonToPlace()
    {
        $json = '';
        $res = $this->client->post('/place/' . $json);
    }

    /**
     * @When I post valid place JSON to \/place\/
     */
    public function iPostValidPlaceJsonToPlace()
    {
        $json = '';
        $res = $this->client->place('/place/' . $json);
    }

    /**
     * @When I access the url \/place\/id
     */
    public function iAccessTheUrlPlaceId()
    {
        $res = $this->client->get('/place/' . $id);
    }

    /**
     * @Given there is more than one place in the database
     */
    public function thereIsMoreThanOnePlaceInTheDatabase()
    {
        throw new PendingException();
    }

    /**
     * @When I access the url \/place\/
     */
    public function iAccessTheUrlPlace()
    {
        $res = $this->client->get('/place/');
    }

    /**
     * @Then I get a list of places
     */
    public function iGetAListOfPlaces()
    {
        $this->isList();
    }
}
