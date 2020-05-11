<?php
/**
 * Plugin Name: Super Map Block
 * Description: Provides flexible maps and universal geolocation support for posts and pages
 * Version: 1.0.0
 * Requires at least: 5.2
 * Requires PHP: 7.2
 * Author: Stephan Mantler
 * Author URI: https://www.stepman.is/
 * License: GPL-3.0-or-later
 * Text Domain: super-map-block
 */
 
 if ( ! defined( 'ABSPATH' ) ) {
	exit;
 }
 
require_once 'includes/super-map-block.php';

function stepman_init_super_map_block() {
	$instance = stepman_super_map_block::instance( __FILE__ );

	return $instance;
}

stepman_init_super_map_block();
