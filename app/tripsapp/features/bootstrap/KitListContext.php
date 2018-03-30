<?php



use Behat\Behat\Context\Context;
use Behat\Gherkin\Node\PyStringNode;
use Behat\Gherkin\Node\TableNode;

/**
 * Defines application features from the specific context.
 */
class KitListContext extends GuzzleContext
{
    public function __construct()
    {
      parent::__construct();

    }

    /**
     * @When I post invalid kitList JSON to \/kitList\/
     */
    public function iPostInvalidKitlistJsonToKitlist()
    {
        $json = "{/}";
        $res = $this->client->post('/kitlist', $json);
        
        
        $ex = false; 
        try{
        
            $res = $this->client->post('/dictionary/keyword',
                array( 'json' => array(
                  'project' => 'cairo',
                  'label' => 'boop',
                  'sport' => 'football',
                  'category' => 'game'
                  )
                )
            );

        } catch (Exception $e) {
            $ex = true;
            echo 'Caught exception: ',  $e->getMessage(), "\n";
        }
        if($ex == false){
            throw new exception('No error thrown');
        }
        
    }

    /**
     * @Given I have a working user
     */
    public function iHaveAWorkingUser()
    {
        throw new PendingException();
    }

    /**
     * @When I post valid kitList JSON to \/kitList\/
     */
    public function iPostValidKitlistJsonToKitlist()
    {
        $json = "";
    
        $res = $this->client->get('/kitlist/' . $json);
        $this->json = $res->getBody()->getContents();
    }

    /**
     * @When I access the url \/kitList\/id
     */
    public function iAccessTheUrlKitlistId()
    {
        $id = "";
        $res = $this->client->get('/kitlist/' . $id);
    }

    /**
     * @Given there is more than one kitList in the database
     */
    public function thereIsMoreThanOneKitlistInTheDatabase()
    {
        throw new PendingException();
    }

    /**
     * @When I access the url \/kitList\/
     */
    public function iAccessTheUrlKitlist()
    {
        $res = $this->client->get('/kitlist/');
    }

    /**
     * @Then I get a list of kitLists
     */
    public function iGetAListOfKitlists()
    {
        $this->isList();
    }
    
}
