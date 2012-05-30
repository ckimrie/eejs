<?php if (!defined("BASEPATH")) die("No direct script access allowed");

class Eejs {

    var $EE;
    var $ext;

    function __construct()
    {
        $this->EE =& get_instance();
    }

    public function api()
    {
        
    }


    public function script()
    {
        require_once(PATH_THIRD."eejs/ext.eejs.php");

        $this->ext = new Eejs_ext();
        $js = $this->ext->load_js();

        $this->EE->output->out_type = "js";
        $this->EE->output->set_output($js);
    }
}