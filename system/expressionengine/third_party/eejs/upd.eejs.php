<?php if (!defined("BASEPATH")) die("No direct script access allowed");


class Eejs_upd {

    private $EE;
    public $version = 1;
    
    public function __construct() {
        $this->EE =& get_instance();
    }
    

    public function install() {
        $module = array(
            'module_name'           => 'Eejs',
            'module_version'        => $this->version,
            'has_cp_backend'        => 'n',
            'has_publish_fields'    => 'n'
        );
        
        $this->EE->db->insert('modules', $module);
        
        $action = array(
            'class' => 'Eejs',
            'method' => 'script'
        );
        $this->EE->db->insert('actions', $action);

        $action = array(
            'class' => 'Eejs',
            'method' => 'api'
        );
        $this->EE->db->insert('actions', $action);
                        
        return TRUE;
    }

    public function uninstall() {
        $this->EE->db->where('module_name', 'Eejs')->delete('modules');
        $this->EE->db->where('class', 'Eejs')->delete('actions');
        
        return TRUE;
    }

    public function update($version = '') {
    
        return TRUE;
    }
}