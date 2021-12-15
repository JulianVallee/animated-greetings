<?php

/**
 * Fired during plugin activation
 *
 * @link       https://vallee.io/
 * @since      1.0.0
 *
 * @package    Animated_Greetings
 * @subpackage Animated_Greetings/includes
 */

/**
 * Fired during plugin activation.
 *
 * This class defines all code necessary to run during the plugin's activation.
 *
 * @since      1.0.0
 * @package    Animated_Greetings
 * @subpackage Animated_Greetings/includes
 * @author     Julian Vallée <julian@vallee-design.de>
 */
class Animated_Greetings_Activator
{
    private $versionInstalled;

	/**
	 * Short Description. (use period)
	 *
	 * Long Description.
	 *
	 * @since    1.0.0
	 */
	public function activate()
    {
        $this->get_version();

        if (!$this->isInstalled()) {
            $this->installDatabaseTables();
        }

        if($this->mustUpdate()) {
            $this->update_version();
        }
	}

    private function installDatabaseTables()
    {
        global $wpdb;
        $table_name = $wpdb->prefix . 'animated_greetings';

        $collation = $wpdb->get_charset_collate();

        $sql = "CREATE TABLE ${table_name} (
                      id mediumint(9) NOT NULL AUTO_INCREMENT,
                      uid char(8) NOT NULL,
                      created datetime NOT NULL,
                      data varchar(65535) NOT NULL,
                      PRIMARY KEY (id),
                      UNIQUE KEY (uid)
            ) ${collation};";

        require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
        dbDelta( $sql );
    }

    private function checkIfTableExists()
    {
        global $wpdb;
        $table_name = $wpdb->prefix . 'animated_greetings';
        return !!$wpdb->query("SHOW TABLES LIKE '${table_name}';");
    }

    private function get_version()
    {
        $this->versionInstalled = get_option('animated_greetings_version');
    }

    private function update_version()
    {
        $this->versionInstalled = ANIMATED_GREETINGS_VERSION;
        update_option('animated_greetings_version', $this->versionInstalled);
    }

    private function isInstalled()
    {
        return $this->versionInstalled && $this->checkIfTableExists();
    }

    private function mustUpdate()
    {
        return version_compare($this->versionInstalled, ANIMATED_GREETINGS_VERSION, '<');
    }

}
