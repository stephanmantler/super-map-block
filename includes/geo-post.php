<?php
/**
 * Main plugin class file.
 *
 * @package WordPress Plugin Template/Includes
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Main plugin class.
 */
class stepman_geo_post {

	/**
	 * The single instance of local_core.
	 *
	 * @var     object
	 * @access  private
	 * @since   1.0.0
	 */
	private static $_instance = null; //phpcs:ignore

	/**
	 * The main plugin file.
	 *
	 * @var     string
	 * @access  public
	 * @since   1.0.0
	 */
	public $file;

	/**
	 * The main plugin directory.
	 *
	 * @var     string
	 * @access  public
	 * @since   1.0.0
	 */
	public $dir;

	/**
	 * The plugin assets directory.
	 *
	 * @var     string
	 * @access  public
	 * @since   1.0.0
	 */
	public $assets_dir;

	/**
	 * The plugin assets URL.
	 *
	 * @var     string
	 * @access  public
	 * @since   1.0.0
	 */
	public $assets_url;


	public static function instance( $file = '', $version = '1.0.0' ) {
		if ( is_null( self::$_instance ) ) {
			self::$_instance = new self( $file, $version );
		}

		return self::$_instance;
	} // End instance ()


	public function __construct( $file = '', $version = '1.0.0' ) {

		// Load plugin environment variables.
		$this->file       = $file;
		$this->dir        = dirname( $this->file );
		$this->assets_dir = trailingslashit( $this->dir ) . 'build';
		$this->assets_url = esc_url( trailingslashit( plugins_url( '/build/', $this->file ) ) );

		register_activation_hook( $this->file, array( $this, 'install' ) );

		// Load frontend JS & CSS.
		// add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_styles' ), 10 );
		// add_action( 'wp_enqueue_styles', array( $this, 'enqueue_scripts' ), 10 );

		// Load admin JS & CSS.
		add_action( 'admin_enqueue_scripts', array( $this, 'admin_enqueue_scripts' ), 10, 1 );

    // add meta info
    add_action( 'init', array( $this, 'register_meta_fields' ) );

    add_action( 'admin_init', array( $this, 'admin_init' ) );
    add_action( 'admin_menu', array( $this, 'admin_menu' ) );

  }

  public function register_meta_fields() {
    register_post_meta('', 'stepman_meta_geolocation', array('show_in_rest' => true, 'single' => true, 'type' => 'string'));
  }

  function admin_enqueue_scripts() {
 		$asset_file = include( $this->assets_dir . '/admin.asset.php');
    wp_register_style('stepman_admin_style',
		  esc_url( $this->assets_url ) . 'admin.css',
		  array(),
      $asset_file['version']);

    wp_enqueue_style('stepman_admin_style');

 		$asset_file = include( $this->assets_dir . '/backend.asset.php');
		wp_register_script( 'stepman_backend_scripts',
		  esc_url( $this->assets_url ) . 'backend.js',
		  $asset_file['dependencies'],
      $asset_file['version']);

		wp_add_inline_script( 'stepman_backend_scripts', "stepmanMapboxAccessToken = '" .get_option('stepman_mapbox_access_token', '') . "';", "before");
    wp_enqueue_script('stepman_backend_scripts');
  }

  /**
  ***
  *** Plugin settings
  ***
  ***/
  function admin_init()
  {
    register_setting('stepman', 'stepman_mapbox_access_token', array( 'type' => 'string'));

    add_settings_section('stepman_settings_section_mapbox','Mapbox Integration', array( $this, 'settings_section_mapbox'), 'stepman');

    add_settings_field('stepman_settings_field_mapbox', "Access Token", array( $this, 'settings_field_mapbox'), 'stepman', 'stepman_settings_section_mapbox');
  }

  function settings_section_mapbox() {
    ?>
    This plugin shows OpenStreetMap tiles by default. To use Mapbox, request a <a href="https://docs.mapbox.com/help/how-mapbox-works/access-tokens/">Mapbox access token</a> and enter it below.
    <?
  }

  function settings_field_mapbox() {
    // get the value of the setting we've registered with register_setting()
    $setting = get_option('stepman_mapbox_access_token');
    // output the field
    ?>
    <input type="text" name="stepman_mapbox_access_token" placeholder="paste your accees token here" style="font-family:monospace;" size="90" value="<?php echo isset( $setting ) ? esc_attr( $setting ) : ''; ?>">
    <?php
  }

  function admin_menu() {
      add_plugins_page(
          'stepman\'s global plugin settings',
          'stepman',
          'manage_options',
          'stepman',
          array( $this, 'options_page_html' ),
          20
      );
  }

  function options_page_html() {

    if ( ! current_user_can( 'manage_options' ) ) {
      return;
    }

      ?>
      <div class="wrap">
        <h1><?php esc_html( get_admin_page_title() ); ?></h1>
        <form action="options.php" method="post">
          <?php
          // output security fields for the registered setting "wporg_options"
          settings_fields( 'stepman' );
          // output setting sections and their fields
          // (sections are registered for "wporg", each field is registered to a specific section)
          do_settings_sections( 'stepman' );
          // output save settings button
          submit_button( 'Save Settings' );
          ?>
        </form>
      </div>
      <?php
  }

	/**
	 * Cloning is forbidden.
	 *
	 * @since 1.0.0
	 */
	public function __clone() {
		_doing_it_wrong( __FUNCTION__, esc_html( __( 'Cloning of stepman_geo_post is forbidden' ) ), esc_attr( $this->_version ) );

	} // End __clone ()

	/**
	 * Unserializing instances of this class is forbidden.
	 *
	 * @since 1.0.0
	 */
	public function __wakeup() {
		_doing_it_wrong( __FUNCTION__, esc_html( __( 'Unserializing instances of stepman_geo_post is forbidden' ) ), esc_attr( $this->_version ) );
	} // End __wakeup ()

}
