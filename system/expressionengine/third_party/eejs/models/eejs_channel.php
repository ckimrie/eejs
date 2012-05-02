<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

//Load the Base Class
$ee =& get_instance();
$ee->load->file(PATH_THIRD."eejs/models/eejs_abstract.php");


/**
 * Channel Resources
 */
class Eejs_channel extends Eejs_abstract
{
    var $EE;


    public function entries()
    {
        return $this->EE->db->get("channel_titles")->result_array();
    }


    public function channels()
    {
        return $this->EE->db->get("channels")->result_array();
    }
}