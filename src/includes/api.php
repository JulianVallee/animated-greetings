<?php

require_once plugin_dir_path(dirname(__FILE__)) . 'includes/router.php';

class Api extends Router
{
    public function __construct()
    {
        $this->get('link/:uid', function($req) {
            $params = $req->get_params();

            if(!array_key_exists('uid', $params)) {
                return new WP_Error('missing_parameter', "Parameter 'uid' is missing.", ['status' => 403]);
            }

            require_once plugin_dir_path(dirname(__FILE__)) . 'includes/models/link.php';
            $data = Link::get($params['uid']);

            if($data instanceof WP_ERROR) {
                return $data;
            }

            return [
                "data" => $data,
                "params" => $params
            ];
        });

        $this->post('link', function($req) {
            $params = $req->get_params();

            if(!array_key_exists('inputs', $params)) {
                return new WP_Error('missing_parameter', "Parameter 'inputs' is missing.", ['status' => 403]);
            }

            require_once plugin_dir_path(dirname(__FILE__)) . 'includes/models/link.php';
            $uid = Link::create($params);

            if($uid instanceof WP_ERROR) {
                return $uid;
            }

            return [
                "uid" => $uid,
                "params" => $params
            ];
        });
    }
}
