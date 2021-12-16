<?php

class EditorShortcode
{
    public static function init()
    {
        add_shortcode('animated-greetings', [self::class, "shortcode"]);
    }

    public static function shortcode($atts)
    {
        require_once plugin_dir_path(dirname(__FILE__)) . 'includes/shortcode-helper.php';

        // Shortcode attributes
        $options = Shortcode_Helper::normalize_atts([
            'baseUrl' => get_site_url()
        ], $atts);

        $data = self::get_uid_data(self::get_uid($options));

        return self::render([
            'animatedGreetingsOptions' => $options,
            'animatedGreetingsData' => $data
        ]);
    }

    public static function render($jsData)
    {
        ob_start(); ?>

        <?= Shortcode_Helper::get_javascript_vars_tag($jsData) ?>

        <div id="animated-greetings-container" class="alignwide"></div>

        <?php return ob_get_clean();
    }

    private static function get_uid($attsNormalized)
    {
        $uid = null;

        if(isset($_GET['greetings'])) {
            $uid = sanitize_text_field($_GET['greetings']);

        } else if(isset($attsNormalized['preload'])) {
            $uid = sanitize_text_field($attsNormalized['preload']);

        }

        return is_string($uid) && strlen($uid) == Animated_Greetings::UID_LENGTH
            ? $uid
            : null;

    }

    private static function get_uid_data($uid)
    {
        if(strlen($uid) !== Animated_Greetings::UID_LENGTH) {
            return false;
        }

        require_once plugin_dir_path(dirname(__FILE__)) . 'includes/models/link.php';
        return Link::getData($uid);
    }

}