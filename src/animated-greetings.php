<?php

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              https://vallee.io/
 * @since             1.0.0
 * @package           Animated_Greetings
 *
 * @wordpress-plugin
 * Plugin Name:       Animated Greetings
 * Plugin URI:        https://vallee.io/
 * Description:       Animated greetings.
 * Version:           1.0.17
 * Author:            Julian Vallée
 * Author URI:        https://vallee.io/
 * License:
 * License URI:
 * Text Domain:       animated-greetings
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if (!defined('WPINC')) {
    die;
}

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

/**
 * Currently plugin version.
 * Start at version 1.0.0 and use SemVer - https://semver.org
 * Rename this for your plugin and update it as you release new versions.
 */
define('ANIMATED_GREETINGS_VERSION', '1.0.17');

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-animated-greetings-activator.php
 */
function activate_animated_greetings()
{
    require_once plugin_dir_path(__FILE__) . 'includes/class-animated-greetings-activator.php';
    (new Animated_Greetings_Activator())->activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-animated-greetings-deactivator.php
 */
function deactivate_animated_greetings()
{
    require_once plugin_dir_path(__FILE__) . 'includes/class-animated-greetings-deactivator.php';
    Animated_Greetings_Deactivator::deactivate();
}

register_activation_hook(__FILE__, 'activate_animated_greetings');
register_deactivation_hook(__FILE__, 'deactivate_animated_greetings');

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path(__FILE__) . 'includes/class-animated-greetings.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_animated_greetings()
{
    $plugin = new Animated_Greetings();
    $plugin->run();

}

run_animated_greetings();
