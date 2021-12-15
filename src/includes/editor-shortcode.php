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
        $attsNormalized = Shortcode_Helper::normalize_atts([
            'baseUrl' => get_site_url()
        ], $atts);

        $uid = self::get_uid($attsNormalized);

        return self::render([
            'animatedGreetingsOptions' => $attsNormalized,
            'animatedGreetingsData' => self::get_uid_data($uid)
        ]);
    }

    public static function render($jsData)
    {
        ob_start(); ?>

        <script>
        <?php foreach($jsData AS $key => $value) {
            if(!$value) {
                continue;
            }
            ?>
            var <?= $key ?> = <?= json_encode($value) ?>;
        <?php } ?>
        </script>

        <div id="animated-greetings-container" class="alignwide"></div>

        <?php return ob_get_clean();
    }

    private static function get_uid($attsNormalized)
    {
        if(array_key_exists('greetings', $_GET)) {
            return sanitize_text_field($_GET['greetings']);

        } else if(array_key_exists('preload', $attsNormalized)) {
            return sanitize_text_field($attsNormalized['preload']);

        }

        return null;
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