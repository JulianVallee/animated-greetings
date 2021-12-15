<?php

/**
 * The file that defines the core plugin class
 *
 * A class definition that includes attributes and functions used across both the
 * public-facing side of the site and the admin area.
 *
 * @link       https://vallee.io/
 * @since      1.0.0
 *
 * @package    Animated_Greetings
 * @subpackage Animated_Greetings/includes
 */

/**
 * The core plugin class.
 *
 * This is used to define internationalization, admin-specific hooks, and
 * public-facing site hooks.
 *
 * Also maintains the unique identifier of this plugin as well as the current
 * version of the plugin.
 *
 * @author Julian Vallée <julian@vallee-design.de>
 * @package Animated_Greetings
 * @subpackage Animated_Greetings/includes
 * @since 1.0.0
 */
class Animated_Greetings
{
    const UID_LENGTH = 8;

    /**
     * The loader that's responsible for maintaining and registering all hooks that power
     * the plugin.
     *
     * @var Animated_Greetings_Loader $loader Maintains and registers all hooks for the plugin.
     * @since 1.0.0
     */
    protected $loader;

    /**
     * The class responsible for defining the WP Rest API endpoints.
     *
     * @var Animated_Greetings_Loader $loader Maintains and registers all hooks for the plugin.
     * @since 1.0.0
     */
    protected $api;

    /**
     * The unique identifier of this plugin.
     *
     * @var string $plugin_name The string used to uniquely identify this plugin.
     * @since 1.0.0
     */
    protected $plugin_name;

    /**
     * The current version of the plugin.
     *
     * @var string $version The current version of the plugin.
     * @since 1.0.0
     */
    protected $version;

    /**
     * Define the core functionality of the plugin.
     *
     * Set the plugin name and the plugin version that can be used throughout the plugin.
     * Load the dependencies, define the locale, and set the hooks for the admin area and
     * the public-facing side of the site.
     *
     * @since 1.0.0
     */
    public function __construct()
    {
        $this->version = ANIMATED_GREETINGS_VERSION;
        $this->plugin_name = 'animated-greetings';

        $this->load_dependencies();
        $this->set_locale();

        if (is_admin()) {
            $this->define_admin_hooks();

        } else {
            $this->define_public_hooks();

        }

    }

    /**
     * Load the required dependencies for this plugin.
     *
     * Include the following files that make up the plugin:
     *
     * - Animated_Greetings_Loader. Orchestrates the hooks of the plugin.
     * - Animated_Greetings_i18n. Defines internationalization functionality.
     * - Animated_Greetings_Admin. Defines all hooks for the admin area.
     * - Animated_Greetings_Public. Defines all hooks for the public side of the site.
     *
     * Create an instance of the loader which will be used to register the hooks
     * with WordPress.
     *
     * @since 1.0.0
     * @access private
     */
    private function load_dependencies()
    {
        /**
         * The class responsible for orchestrating the actions and filters of the
         * core plugin.
         */
        require_once plugin_dir_path(dirname(__FILE__)) . 'includes/class-animated-greetings-loader.php';
        $this->loader = new Animated_Greetings_Loader();

        /**
         * The class responsible for defining the WP Rest API endpoints.
         */
        require_once plugin_dir_path(dirname(__FILE__)) . 'includes/api.php';
        $this->api = new Api();

    }

    /**
     * Define the locale for this plugin for internationalization.
     *
     * Uses the Animated_Greetings_i18n class in order to set the domain and to register the hook
     * with WordPress.
     *
     * @since 1.0.0
     * @access private
     */
    private function set_locale()
    {
        require_once plugin_dir_path(dirname(__FILE__)) . 'includes/class-animated-greetings-i18n.php';
        $plugin_i18n = new Animated_Greetings_i18n();

        $this->loader->add_action('plugins_loaded', $plugin_i18n, 'load_plugin_textdomain');
    }

    /**
     * Register all the hooks related to the admin area functionality
     * of the plugin.
     *
     * @since 1.0.0
     * @access private
     */
    private function define_admin_hooks()
    {
        require_once plugin_dir_path(dirname(__FILE__)) . 'admin/admin.php';
        $plugin_admin = new Animated_Greetings_Admin($this->get_plugin_name(), $this->get_version());

        $this->loader->add_action('admin_enqueue_scripts', $plugin_admin, 'enqueue_styles');
        $this->loader->add_action('admin_enqueue_scripts', $plugin_admin, 'enqueue_scripts');
    }

    /**
     * Register all the hooks related to the public-facing functionality
     * of the plugin.
     *
     * @since 1.0.0
     * @access private
     */
    private function define_public_hooks()
    {
        require_once plugin_dir_path(dirname(__FILE__)) . 'public/public.php';
        $plugin_public = new Animated_Greetings_Public($this->get_plugin_name(), $this->get_version());

        $this->loader->add_action('wp_enqueue_scripts', $plugin_public, 'enqueue_styles');
        $this->loader->add_action('wp_enqueue_scripts', $plugin_public, 'enqueue_scripts');
    }

    /**
     * Run the loader to execute all the hooks with WordPress.
     *
     * @since 1.0.0
     */
    public function run()
    {
        $this->loader->run();
        $this->api->listen();
    }

    /**
     * The name of the plugin used to uniquely identify it within the context of
     * WordPress and to define internationalization functionality.
     *
     * @return string The name of the plugin.
     * @since 1.0.0
     */
    public function get_plugin_name()
    {
        return $this->plugin_name;
    }

    /**
     * The reference to the class that orchestrates the hooks with the plugin.
     *A
     * @return Animated_Greetings_Loader Orchestrates the hooks of the plugin.
     * @since 1.0.0
     */
    public function get_loader()
    {
        return $this->loader;
    }

    /**
     * Retrieve the version number of the plugin.
     *
     * @return string The version number of the plugin.
     * @since 1.0.0
     */
    public function get_version()
    {
        return $this->version;
    }

}
