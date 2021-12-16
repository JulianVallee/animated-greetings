<?php

class Shortcode_Helper
{
    private const DELIMITER = '_';


    /**
     * @since 1.0.0
     */
    public static function normalize_atts($default_atts, $atts)
    {
        // If the shortcode has no attributes we also have no $atts array
        if(!is_array($atts)) {
            return [];
        }

        $attsNormalized = [];

        foreach ($atts as $key => $val) {
            $lowercaseVal = strtolower($val);

            // Cast boolean values to real booleans
            if (is_bool($val) || $lowercaseVal === 'true' || $lowercaseVal === 'false') {
                $val = filter_var($val, FILTER_VALIDATE_BOOLEAN);
            }

            // Transform all attr keys to kebabCase
            $attsNormalized[self::normalize_key_casing($key)] = $val;
        }

        return array_merge($default_atts, $attsNormalized);
    }

    private static function normalize_key_casing($value, $separators = ['_', '-'])
    {
        return str_replace($separators, '', lcfirst(ucwords($value, implode('', $separators))));
    }

    /**
     * @param $data
     * @return string
     * @since 1.0.1
     */
    public static function get_javascript_vars_tag($data)
    {
        $output = '';

        if(is_array($data) || is_object($data)) {
            foreach($data AS $key => $value) {
                if((is_array($value) && count($value)) || (is_object($value) && count((array)$value))) {
                    $output .= "\tvar " . $key . ' = ' . json_encode($value) . ";\n";
                }
            }
        }

        return $output ? "<script>\n${output}</script>" : '';
    }

    /**
     * Create a deep associative array from splitting
     * the keys of the passed associative array by a delimiter.
     *
     * Example:
     * unflat(['foo' => 'bar', 'a_b_c' => 'some value']);
     *
     * Return value:
     * [
     *   'foo' => 'bar',
     *   'a' => [
     *       'b' => [
     *          'c' => 'some value'
     *       ]
     *   ]
     * ]
     *
     * @param $options array
     * @return array
     */
    public static function unflat($options, $delimiter = self::DELIMITER)
    {
        $data = [];

        foreach($options as $key => $value) {
            $parts = explode($delimiter, strtolower($key));
            $key = array_shift($parts);
            $data[$key] = self::unflatRecursive($parts, $value);
        }

        return $data;
    }

    /**
     * @param $keys array string[]
     * @param $value mixed
     * @param $data array
     * @return array
     */
    private static function unflatRecursive($keys, $value, $data = [])
    {
        if(!count($keys)) {
            return $value;
        }

        $key = array_shift($keys);

        $data[$key] = [];
        $data[$key] = self::unflatRecursive($keys, $value, $data[$key]);

        return $data;
    }
}
