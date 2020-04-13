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
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_styles' ), 10 );
		add_action( 'wp_enqueue_styles', array( $this, 'enqueue_scripts' ), 10 );

		// Load admin JS & CSS.
		add_action( 'admin_enqueue_scripts', array( $this, 'admin_enqueue_scripts' ), 10, 1 );

    // add meta info		
		add_action( 'add_meta_boxes', array( $this, 'add_meta_boxes' ) );
		add_action( 'save_post', array( $this, 'save_post' ) );
		
  }
  
	public function add_meta_boxes() {
  	add_meta_box( 'local_meta', 'Location', array( $this, 'meta_callback' ), 'post', 'side' );
	}
	
	public function meta_callback( $post ) {
  	echo 'Draw shapes in map.';
  	echo '<div id="local_meta_map_field" style="width:100%; height: 200px;"></div>';
    wp_nonce_field( basename( __FILE__ ), 'local_nonce' );
    $local_stored_meta = get_post_meta( $post->ID );
    
    ?>
    <p><label for="stepman_post_geojson" class="local-row-title">GeoJSON shape</label>
        <input type="text" name="stepman_post_geojson" id="stepman_post_geojson" value="<?php if ( isset ( $local_stored_meta['stepman_post_geojson'] ) ) echo esc_attr($local_stored_meta['stepman_post_geojson'][0]); ?>" />
    </p><?php
	}
	
	public function save_post( $post_id ) {
    // Checks save status
    $is_autosave = wp_is_post_autosave( $post_id );
    $is_revision = wp_is_post_revision( $post_id );
    $is_valid_nonce = ( isset( $_POST[ 'local_nonce' ] ) && wp_verify_nonce( $_POST[ 'local_nonce' ], basename( __FILE__ ) ) ) ? 'true' : 'false';
 
    // Exits script depending on save status
    if ( $is_autosave || $is_revision || !$is_valid_nonce ) {
        error_log('local_portfolio_meta_save: saving not allowed');
        return;
    }
 
    // Checks for input and sanitizes/saves if needed
    if( isset( $_POST[ 'stepman_post_geojson' ] ) ) {
        error_log('local_portfolio_meta_save: saving meta ' . $_POST[ 'stepman_post_geojson' ]);
        update_post_meta( $post_id, 'stepman_post_geojson', sanitize_text_field( $_POST[ 'stepman_post_geojson' ] ) );
    } else {
        error_log('local_portfolio_meta_save: no meta data to save.');
    }
 	}
  
  
  function enqueue_styles() {
    
  }
  
  function enqueue_scripts() {
    
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
      
    wp_enqueue_script('stepman_backend_scripts');
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