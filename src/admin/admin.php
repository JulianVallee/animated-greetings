<?php

/**
 * The admin-specific functionality of the plugin.
 *
 * @link       https://vallee.io/
 * @since      1.0.0
 *
 * @package    Animated_Greetings
 * @subpackage Animated_Greetings/admin
 */

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package Animated_Greetings
 * @subpackage Animated_Greetings/admin
 * @author Julian Vallée <julian@vallee-design.de>
 */
class Animated_Greetings_Admin
{

    /**
     * The ID of this plugin.
     *
     * @since 1.0.0
     * @access private
     * @var string $plugin_name The ID of this plugin.
     */
    private $plugin_name;

    /**
     * The version of this plugin.
     *
     * @since 1.0.0
     * @access private
     * @var string $version The current version of this plugin.
     */
    private $version;

    /**
     * Initialize the class and set its properties.
     *
     * @param string $plugin_name The name of this plugin.
     * @param string $version The version of this plugin.
     * @since 1.0.0
     */
    public function __construct($plugin_name, $version)
    {
        $this->plugin_name = $plugin_name;
        $this->version = $version;
    }

    /**
     * Register the stylesheets for the admin area.
     *
     * @since 1.0.0
     */
    public function enqueue_styles()
    {
        wp_enqueue_style($this->plugin_name, plugin_dir_url(__FILE__) . 'css/animated-greetings-admin.css', array(), $this->version, 'all');
    }

    /**
     * Register the JavaScript for the admin area.
     *
     * @since 1.0.0
     */
    public function enqueue_scripts()
    {
        wp_enqueue_script($this->plugin_name, plugin_dir_url(__FILE__) . 'bundle.js', array('jquery'), $this->version, true);
    }

}
