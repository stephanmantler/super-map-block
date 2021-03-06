<?php
/**
 * Main plugin class file.
 *
 * @package stepman-geo-post/Includes
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Main plugin class.
 */
class stepman_super_map_block {

	/**
	 * The single instance of stepman_geo_post.
	 *
	 * @var		 object
	 * @access	 private
	 * @since	 1.0.0
	 */
	private static $_instance = null; //phpcs:ignore

	/**
	 * The main plugin file.
	 *
	 * Typically this would be `../wp-content/plugins/<plugin_name>/index.php`.
	 *
	 * @var		 string
	 * @access	 public
	 * @since	 1.0.0
	 */
	public $file;

	/**
	 * The main plugin directory.
	 *
	 * This should be `../wp-content/plugins/<plugin_name>/`.
	 *
	 * @var		 string
	 * @access	 public
	 * @since	 1.0.0
	 */
	public $dir;

	/**
	 * The plugin assets directory.
	 *
	 * @var		 string
	 * @access	 public
	 * @since	 1.0.0
	 */
	public $assets_dir;

	/**
	 * The plugin assets URL.
	 *
	 * @var		 string
	 * @access	 public
	 * @since	 1.0.0
	 */
	public $assets_url;

	/**
	 * Access the single instance of this class.
	 *
	 * Creates or provides the single instance of this plugin class if it had
	 * already been creted in a prior invocation.
	 *
	 * @ignore
	 *
	 * @since	 1.0.0
	 * @return	 stepman_geo_post The single instance.
	 */
	public static function instance( $file = '', $version = '1.0.0' ) {
		if ( is_null( self::$_instance ) ) {
			self::$_instance = new self( $file, $version );
		}

		return self::$_instance;
	} // End instance ()

	/**
	 * Constructor.
	 *
	 * Initializes the plugin and registers all actions for plugin lifetime
	 * management.
	 *
	 * @since	 1.0.0
	 * @param	 string $file			Main plugin filename.
	 * @param	 string $version	Plugin version.
	 */
	public function __construct( $file = '', $version = '1.0.0' ) {

		// Load plugin environment variables.
		$this->file				= $file;
		$this->dir				= dirname( $this->file );
		$this->assets_dir = trailingslashit( $this->dir ) . 'build';
		$this->assets_url = esc_url( trailingslashit( plugins_url( '/build/', $this->file ) ) );

		//register_activation_hook( $this->file, array( $this, 'install' ) );

		// Load frontend JS & CSS.
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_scripts' ), 10 );
		// add_action( 'wp_enqueue_styles', array( $this, 'enqueue_scripts' ), 10 );

		// Load admin JS & CSS.
		add_action( 'admin_enqueue_scripts', array( $this, 'admin_enqueue_scripts' ), 10, 1 );

		// add meta info
		add_action( 'init', array( $this, 'register_meta_fields' ) );
		add_action( 'init', array( $this, 'load_textdomain' ) );

		// register GeoJSON files
		add_filter( 'upload_mimes', array( $this, 'register_mime_types' ), 1, 1 );
		add_filter( 'wp_check_filetype_and_ext', array( $this, 'check_filetype_and_ext' ), 10, 4 );

		add_action( 'admin_init', array( $this, 'admin_init' ) );
		add_action( 'admin_menu', array( $this, 'admin_menu' ) );
	}

	/**
	 * Load plugin text domains
	 *
	 * @since	 1.0.0
	 */
	function load_textdomain() {
		load_plugin_textdomain( 'super-map-block', FALSE, basename( $this->dir ) . '/languages' );
	}

	/**
	 * Extend allowed MIME types
	 *
	 * Register GeoJSON as an additional supported MIME type.
	 *
	 * @since		1.0.0
	 */
	function register_mime_types( $mime_types ) {
		// this should actually be application/json or application/geo+json
		$mime_types['geojson'] = 'application/geo+json';
		return $mime_types;
	}

	/**
	 * Detect geojson file uploads
	 *
	 * GeoJSON files are uploaded with a notoriously large variety of mime types,
	 * (text/plain, application/octet-stream, application/json, or
	 * application/geo+json). We normalize this based on the filename.
	 *
	 * @since		1.0.0
	 */
	function check_filetype_and_ext( $types, $file, $filename, $mimes ) {
		if( false !== strpos( $filename, '.geojson' ) )
		{
			 	// TOOD: ideally we would verify the file actually is a GeoJSON.
				$types['ext'] = 'geojson';
				$types['type'] = 'application/geo+json';
		}
		return $types;
}

	/**
	 * Register front-end scripts.
	 *
	 * Register and enqueue all scripts and assets required for frontend display.
	 * Runs in the `wp_enqueue_scripts` action.
	 *
	 * @since	 1.0.0
	 */
	function enqueue_scripts() {
		$asset_file = include( $this->assets_dir . '/frontend.asset.php');
		wp_register_script( 'stepman_frontend_scripts',
			esc_url( $this->assets_url ) . 'frontend.js',
			$asset_file['dependencies'],
			$asset_file['version'],
			true);
			
		wp_set_script_translations( 'stepman_frontend_scripts', 'super-map-block', $this->dir . '/languages' );

		wp_enqueue_script( 'stepman_frontend_scripts' );

 		$asset_file = include( $this->assets_dir . '/style.asset.php');
		wp_register_style('stepman_style',
			esc_url( $this->assets_url ) . 'style.css',
			array(),
			$asset_file['version']);

		wp_enqueue_style('stepman_style');

	}

	/**
	 * Register post metadata.
	 *
	 * Register our geolocation metadata for all post types.
	 * Runs in the `init` action.
	 *
	 * @since	 1.0.0
	 */
	function register_meta_fields() {
		register_post_meta('', 'stepman_meta_geolocation', array('show_in_rest' => true, 'single' => true, 'type' => 'string'));
	}

	/**
	 * Register backend-end scripts.
	 *
	 * Register and enqueue all scripts and assets required for the admin interface.
	 * Runs in the `admin_enqueue_scripts` action.
	 *
	 * @since	 1.0.0
	 */
	function admin_enqueue_scripts( $hook ) {
		error_log(" ---> " . $hook);
 		$asset_file = include( $this->assets_dir . '/admin.asset.php');
		wp_register_style('stepman_admin_style',
			esc_url( $this->assets_url ) . 'admin.css',
			array(),
			$asset_file['version']);

		wp_enqueue_style('stepman_admin_style');

		if ( $hook == "post.php") {
			$asset_file = include( $this->assets_dir . '/backend.asset.php');
			wp_register_script( 'stepman_backend_scripts',
				esc_url( $this->assets_url ) . 'backend.js',
				$asset_file['dependencies'],
				$asset_file['version']);

			wp_set_script_translations( 'stepman_backend_scripts', 'super-map-block', $this->dir . '/languages' );

			wp_add_inline_script(
				'stepman_backend_scripts',
				"stepmanMapboxAccessToken = '" .get_option('stepman_mapbox_access_token', '') . "';",
				"before");
			wp_enqueue_script('stepman_backend_scripts');
		} else if ( $hook == "plugins_page_super-map-block") {
			$asset_file = include( $this->assets_dir . '/plugin-settings.asset.php');
			wp_register_script( 'stepman_plugin_settings_scripts',
				esc_url( $this->assets_url ) . 'plugin-settings.js',
				$asset_file['dependencies'],
				$asset_file['version']);
			 wp_enqueue_script('stepman_plugin_settings_scripts');
		}
	}

	/**
	 * Register admin settings screen.
	 *
	 * Runs in the `admin_init` action.
	 *
	 * @since	 1.0.0
	 */
	function admin_init()
	{
		register_setting('stepman', 'stepman_mapbox_access_token', array( 'type' => 'string'));

		add_settings_section('stepman_settings_section_mapbox',__('Mapbox Integration', 'super-map-block'), array( $this, 'settings_section_mapbox'), 'stepman');

		add_settings_field('stepman_settings_field_mapbox', __('Access Token', 'super-map-block'), array( $this, 'settings_field_mapbox'), 'stepman', 'stepman_settings_section_mapbox');
	}

	/**
	 * Displays the mapbox settings section.
	 *
	 * @since	 1.0.0
	 */
	 function settings_section_mapbox() {
		printf(
			/* translators: %s will be the URL for the Mapbox access token howto. */
			__('Super Map Block can show OpenStreetMap, OpenTopoMap and Mapbox tiles. To use Mapbox, you will need to request a <a href="%s">Mapbox access token</a> and enter it below.', 'super-map-block'),
			'https://docs.mapbox.com/help/how-mapbox-works/access-tokens/'
			);
	}

	/**
	 * Displays the mapbox settings field.
	 *
	 * @since	 1.0.0
	 */
	function settings_field_mapbox() {
		// get the value of the setting we've registered with register_setting()
		$setting = get_option('stepman_mapbox_access_token');
		// output the field
		?>
		<input type="text" id="mapbox-access-token" name="stepman_mapbox_access_token" placeholder="<?php _e('paste your access token here', 'super-map-block') ?>" style="font-family:monospace;" size="90" value="<?php echo isset( $setting ) ? esc_attr( $setting ) : __('(not set)', 'super-map-block'); ?>">
		<div id="mapbox-access-token-status"></div>
		<?php
	}


	/**
	 * Registers the admin settings menu.
	 *
	 * Runs in the `admin_menu` action.
	 *
	 * @since	 1.0.0
	 */
	function admin_menu() {
			add_plugins_page(
					__('Super Map Block global plugin settings', 'super-map-block'),
					__('Super Map Block', 'super-map-block'),
					'manage_options',
					'super-map-block',
					array( $this, 'options_page_html' ),
					20
			);
	}

	/**
	 * Render the plugin options page.
	 *
	 * @since	 1.0.0
	 */
	function options_page_html() {

		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

			?>
			<div class="wrap">
				<h1><?php esc_html( get_admin_page_title() ); ?></h1>
				<form action="options.php" method="post">
					<?php
					settings_fields( 'stepman' );
					do_settings_sections( 'stepman' );
					submit_button( 'Save Settings' );
					?>
				</form>
			</div>
			<?php
	}

	/**
	 * Cloning is forbidden.
	 *
	 * @ignore
	 * @since 1.0.0
	 */
	public function __clone() {
		_doing_it_wrong( __FUNCTION__, esc_html( __( 'Cloning of stepman_super_map_block is forbidden' ) ), esc_attr( $this->_version ) );

	} // End __clone ()

	/**
	 * Unserializing instances of this class is forbidden.
	 *
	 * @ignore
	 * @since 1.0.0
	 */
	public function __wakeup() {
		_doing_it_wrong( __FUNCTION__, esc_html( __( 'Unserializing instances of stepman_super_map_block is forbidden' ) ), esc_attr( $this->_version ) );
	} // End __wakeup ()

}
