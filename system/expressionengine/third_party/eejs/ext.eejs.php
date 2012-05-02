<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');




class Eejs_ext {

    var $name           = "EEJS";
    var $description    = "Javascript library for accessing ExpressionEngine resources";
    var $settings       = array();
    var $settings_exist = false;
    var $docs_url       = "";
    var $version        = 1;


    var $configKeys = array(

        //System
        'site_index',
        'site_url',
        'cp_url',
        'uri_protocol',
        'is_site_on',
        'site_404',

        //Email
        'webmaster_email', 
        'webmaster_name',

        // Localization preferences
        'server_timezone',
        'server_offset',
        'time_format',
        'daylight_savings',
        'honor_entry_dst',

        // Channel preferences
        'use_category_name',
        'word_separator',
        'reserved_category_word',

        // Template preferences
        'strict_urls',
        'save_tmpl_files',
        'save_tmpl_revisions',

        'theme_folder_url',

        'enable_online_user_tracking',
        'dynamic_tracking_disabling',
        'enable_hit_tracking',
        'enable_entry_view_tracking',
        'log_referrers',
        
        'allow_registration',
        'enable_emoticons',
        'enable_avatars',
        
        'avatar_url',
        'avatar_max_height',
        'avatar_max_width',
        'avatar_max_kb',

        'enable_photos',
        'photo_url',
        'photo_max_height',
        'photo_max_width',
        'photo_max_kb',

        'sig_allow_img_upload',
        'sig_img_url',
        'sig_img_max_height',
        'sig_img_max_width',
        'sig_img_max_kb',
        'sig_maxlength'
    );


    var $constantKeys = array(
        "SYSDIR"            => SYSDIR,
        "APP_NAME"          => APP_NAME,
        "APP_VER"           => APP_VER,
        "APP_BUILD"         => APP_BUILD,
        "CI_VERSION"        => CI_VERSION,
        "BASE"              => BASE,
        "AMP"               => AMP,
        "QUERY_MARKER"      => QUERY_MARKER,
        "URL_THIRD_THEMES"  => URL_THIRD_THEMES,
        "NBS"               => NBS,
        "BR"                => BR,
        "NL"                => NL,
        "LD"                => LD,
        "RD"                => RD,
        "DEBUG"             => DEBUG,
        "EXT"               => EXT,
        "UTF8_ENABLED"      => UTF8_ENABLED,
        "MB_ENABLED"        => MB_ENABLED
    );


    /**
     * Constructor
     *
     * @param   mixed   Settings array or empty string if none exist.
     */
    function __construct($settings='')
    {
        $this->EE =& get_instance();

        $this->settings = $settings;

    }



    /**
     * API Endpoint
     * 
     * ALthough this is 
     * 
     * @return [type] [description]
     */
    public function settings()
    {

        $resource = $this->EE->input->get("resource");
        $method = $this->EE->input->get("method");

        $filename = "eejs_".$resource;

        if(!$resource){
            $this->EE->output->set_status_header(400); //Bad request
            $this->EE->output->send_ajax_response(array("error"=>"Resource not specified"));
        }
        if(!$method){
            $this->EE->output->set_status_header(400); //Bad request
            $this->EE->output->send_ajax_response(array("error"=>"Method not specified"));
        }

        $this->EE->load->add_package_path(PATH_THIRD."eejs");
        $this->EE->load->model($filename);
        
        //Call the method
        $data = $this->EE->$filename->$method();

        $this->EE->output->send_ajax_response($data);
    }



    public function load_js()
    {
        $this->EE->load->helper("file");

        $js = $this->configJson();
        $js .= read_file(PATH_THIRD."eejs/javascript/eejs.js");

        return $js;
    }


    private function configJson()
    {
        $obj = array();

        //EE Constants
        $obj['constants'] = array();
        foreach($this->constantKeys as $key => $value){
            $obj['constants'][$key] = $value;
        }

        //EE Config Variables
        $obj['config'] = array();
        foreach($this->configKeys as $key){
            $obj['config'][$key] = $this->EE->config->item($key);
        }

        $actions = $this->EE->db->get("actions")->result_array();
        $obj['actions'] = array();
        foreach($actions as $row){
            $obj['actions'][$row['class']][$row['method']] = (int) $row['action_id'];
        }

        //Fix the CP BASE "&amp;" -> "&"
        $obj['constants']['BASE'] = str_replace("&amp;", "&", $obj['constants']['BASE']);

        //Actions
        return "var eejsConfig = ".json_encode($obj)."; \n";
    }



    function activate_extension()
    {

        $data = array(
            'class'     => __CLASS__,
            'method'    => 'load_js',
            'hook'      => 'cp_js_end',
            'settings'  => serialize(array()),
            'priority'  => 1,
            'version'   => $this->version,
            'enabled'   => 'y'
        );

        $this->EE->db->insert('extensions', $data);
    }


    function disable_extension()
    {
        $this->EE->db->where('class', __CLASS__);
        $this->EE->db->delete('extensions');
    }

    function update_extension($current = '')
    {
        if ($current == '' OR $current == $this->version)
        {
            return FALSE;
        }

        /*if ($current < '1.0')
        {
            // Update to version 1.0
        }*/

        $this->EE->db->where('class', __CLASS__);
        $this->EE->db->update(
            'extensions',
            array('version' => $this->version)
        );
    }
}
// END CLASS