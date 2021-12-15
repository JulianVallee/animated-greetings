<?php

class Link
{
//    public $id;
//
//    public $uid;
//
//    public $created;
//
//    public $data;

    private static $table_name = 'animated_greetings';

    public static function create($data)
    {
        global $wpdb;

        $uid = substr(md5(mt_rand()), 0, Animated_Greetings::UID_LENGTH);

        $result = $wpdb->insert(
            $wpdb->prefix . self::$table_name, [
                'uid' => $uid,
                'created' => current_time('mysql'),
                'data' => json_encode($data)
            ]
        );

        if(!$result) {
            return new WP_Error('database_error', "Failed to fetch animated greeting row from the database.", [
                'status' => 403,
                'message' => $wpdb->last_error,
                'query' => $wpdb->last_query
            ]);
        }

        return $uid;
    }

    public static function getData($uid)
    {
        global $wpdb;

        $result = $wpdb->get_var($wpdb->prepare("SELECT data FROM " . $wpdb->prefix . self::$table_name . " WHERE uid = %s;", [
            $uid
        ]));

        if(!$result) {
            return new WP_Error('database_error', "Failed to fetch animated greeting row from the database.", [
                'status' => 403,
                'message' => $wpdb->last_error,
                'query' => $wpdb->last_query
            ]);
        }

        return json_decode($result);
    }
}