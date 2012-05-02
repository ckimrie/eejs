<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');


/**
* 
*/
class Eejs_abstract extends CI_Model
{
    var $EE;

    function __construct()
    {
        parent::__construct();

        $this->EE =& get_instance();
    }
    
}