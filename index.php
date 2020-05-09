<?php
/**
 * Plugin Name: Super Map Block
 * Description: Provides flexible maps and universal geolocation support for posts and pages
 * Version: 1.0.0
 * Requires at least: 5.3
 * Requires PHP: 7.0
 * Author: Stephan Mantler
 * Author URI: https://www.stepman.is/
 * License: GPL-3.0-or-later
 * Text Domain: sma-super-map-block
 */
 
 if ( ! defined( 'ABSPATH' ) ) {
	exit;
 }
 
require_once 'includes/geo-post.php';

function sma_init_super_map_block() {
	$instance = sma_super_map_block::instance( __FILE__ );

	return $instance;
}

sma_init_super_map_block();
