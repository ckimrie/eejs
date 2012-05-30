<?php if (!defined("BASEPATH")) die("No direct script access allowed");

$extension_name = "EEJS";

class Eejs_ext {

    
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


    var $constantKeys = array();


    /**
     * Constructor
     *
     * @param   mixed   Settings array or empty string if none exist.
     */
    function __construct($settings='')
    {
        $this->EE =& get_instance();

        $this->settings = $settings;





        $this->constantKeys = array(
            "BASE"            => BASE,
            "SYSDIR"            => SYSDIR,
            "APP_NAME"          => APP_NAME,
            "APP_VER"           => APP_VER,
            "APP_BUILD"         => APP_BUILD,
            "CI_VERSION"        => CI_VERSION,
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

        //Replace &amp; -> & in BASE
        $obj['constants']['BASE'] = str_replace("&amp;", "&", $obj['constants']['BASE']);
        

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


    public function settings()
    {
        $resource = $this->EE->input->get("resource");
        $data = $this->$resource();

        $this->EE->output->send_ajax_response($data);
    }



    private function channels()
    {
        if($this->EE->input->get("channel_name")){
            $this->EE->db->where("channel_name", $this->EE->input->get("channel_name"));
        }

        if($this->EE->input->get("channel_id")){
            $this->EE->db->where("channel_id", $this->EE->input->get("channel_id"));
        }
        return $this->EE->db->get("channels")->result_array();
    }


    private function entries()
    {
        $this->EE->db->select("channel_titles.*");

        if($this->EE->input->get("channel_name")){
            $this->EE->db->where("channels.channel_name", $this->EE->input->get("channel_name"));
        }

        if($this->EE->input->get("channel_id")){
            $this->EE->db->where("channels.channel_id", $this->EE->input->get("channel_id"));
        }

        $this->EE->db->from("channel_titles");
        $this->EE->db->join("channels", "channels.channel_id = channel_titles.channel_id");
        return $this->EE->db->get()->result_array();
    }


    private function entry()
    {
    
        $this->EE->db->where("entry_id", $this->EE->input->get("entry_id"));
        return $this->EE->db->get("channel_titles")->result_array();
    }

}
// END CLASS