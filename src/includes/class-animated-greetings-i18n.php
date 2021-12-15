<?php

/**
 * Define the internationalization functionality
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @link       https://vallee.io/
 * @since      1.0.0
 *
 * @package    Animated_Greetings
 * @subpackage Animated_Greetings/includes
 */

/**
 * Define the internationalization functionality.
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @since      1.0.0
 * @package    Animated_Greetings
 * @subpackage Animated_Greetings/includes
 * @author     Julian Vallée <julian@vallee-design.de>
 */
class Animated_Greetings_i18n {


	/**
	 * Load the plugin text domain for translation.
	 *
	 * @since    1.0.0
	 */
	public function load_plugin_textdomain() {

		load_plugin_textdomain(
			'animated-greetings',
			false,
			dirname( dirname( plugin_basename( __FILE__ ) ) ) . '/languages/'
		);

	}



}
