<?php

use Behat\Behat\Context\Context;
use Behat\Gherkin\Node\PyStringNode;
use Behat\Gherkin\Node\TableNode;


/**
 * Defines application features from the specific context.
 */
abstract class GuzzleContext implements Context {
    
    /**
     * Initializes context.
     *
     * Every scenario gets its own context instance.
     * You can also pass arbitrary arguments to the
     * context constructor through behat.yml.
     */
    public function __construct()
    {

        $this->client = new \GuzzleHttp\Client([
            'base_url' => ['http:/localhost:8888/api', ['version' => 'v1.0'] ],
            'defaults' => [
                'headers' => ['Accept'     => 'application/json', 'Content-Type' => 'application/json'],
                //'auth'    => ['cairo', 'jordan-INCREASE-state-STONE'],
            ]
        ]);
    }
    
    //protected $services;
    //
    //public function setServiceLocator(ServiceLocatorInterface $serviceLocator)
    //{
    //    $this->services = $serviceLocator;
    //}
    //
    //public function getServiceLocator()
    //{
    //    return $this->services;
    //}
    
    /** @BeforeSuite */
    public static function setup($scope)
    {
        
    }
    

}




?>