<?php
declare(strict_types=1);

/**
 * The public-facing functionality of the plugin.
 *
 * @link       https://vallee.io/
 * @since      1.0.0
 *
 * @package    Animated_Greetings
 * @subpackage Animated_Greetings/public
 */

/**
 * The public-facing functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the public-facing stylesheet and JavaScript.
 *
 * @package    Animated_Greetings
 * @subpackage Animated_Greetings/public
 * @author     Julian Vallée <julian@vallee-design.de>
 */
class Animated_Greetings_Public
{

    /**
     * The ID of this plugin.
     *
     * @var string $plugin_name The ID of this plugin.
     * @since 1.0.0
     */
    private $plugin_name;

    /**
     * The version of this plugin.
     *
     * @var string $version The current version of this plugin.
     * @since 1.0.0
     */
    private $version;


    /**
     * The shortcodes of this plugin.
     *
     * @var string $version The current version of this plugin.
     * @since 1.0.0
     */
    private $shortcodes;

    /**
     * Initialize the class and set its properties.
     *
     * @param string $plugin_name The name of the plugin.
     * @param string $version The version of this plugin.
     * @since 1.0.0
     */
    public function __construct($plugin_name, $version)
    {
        $this->plugin_name = $plugin_name;
        $this->version = $version;

        require_once plugin_dir_path(dirname(__FILE__)) . 'includes/editor-shortcode.php';
        EditorShortcode::init();
    }

    /**
     * Register the stylesheets for the public-facing side of the site.
     *
     * @since 1.0.0
     */
    public function enqueue_styles()
    {
        wp_enqueue_style($this->plugin_name, plugin_dir_url(__FILE__) . 'bundle.css?chunk=a7bd98js', array(), $this->version, 'all');
    }

    /**
     * Register the JavaScript for the public-facing side of the site.
     *
     * @since 1.0.0
     */
    public function enqueue_scripts()
    {
        wp_enqueue_script($this->plugin_name, plugin_dir_url(__FILE__) . 'bundle.js?chunk=a7bd98js', array('jquery'), $this->version, true);
    }

}
