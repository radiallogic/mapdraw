<?php
include('GuzzleContext.php'); // for all other contexts
//kitlists

use Behat\Behat\Context\Context;
use Behat\Gherkin\Node\PyStringNode;
use Behat\Gherkin\Node\TableNode;

/**
 * Defines application features from the specific context.
 */
class FeatureContext implements Context
{
    /**
     * Initializes context.
     *
     * Every scenario gets its own context instance.
     * You can also pass arbitrary arguments to the
     * context constructor through behat.yml.
     */
    public function __construct()
    {
    }

    /**
     * @Then I get a valid JSON response
     */
    public function iGetAValidJsonResponse()
    {
        if( ! empty($this->json) ){
            
            $result = json_decode($this->json);
            
            if($result == false){
                throw new Exception('failed json decode');
            }
        }
    }
    
    /**
     *
     */
    public function isList(){
        
        $this->json = $res->getBody()->getContents();
        $this->json = json_decode($this->json, true);
        
        if( empty($this->json) || count( $this->json ) == 0){
            throw new Exception(" Not a list of kit lists" . print_r($this->json, 1) );
        }
        
    }
    
    /**
     * @Then I get a :arg1
     */
    public function iGetA($arg1)
    {
        $code = $this->res->getStatusCode();
        if($code == $arg1){
            echo "Received " . $arg1;
        }else{
            throw new Exception("Received " . $code . " not " . $arg1);
        }
    }
}
