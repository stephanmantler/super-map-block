<?php
/**
 * Plugin Name: stepman-geo-post
 * Description: Geolocation support for posts and pages
 * Version: 1.0.0
 * Requires at least: 5.3
 * Requires PHP: 7.0
 * Author: Stephan Mantler
 * Author URI: https://www.stepman.is/
 * License: GPL-3.0-or-later
 */
 
 if ( ! defined( 'ABSPATH' ) ) {
	exit;
 }
 
require_once 'includes/geo-post.php';

function stepman_geo_post() {
	$instance = stepman_geo_post::instance( __FILE__ );

	return $instance;
}

stepman_geo_post();
