'use strict';

import 'jquery';

( function ( $ ) {
	function checkAccessToken() {
		const token = jQuery( 'input#mapbox-access-token' )[ 0 ].value;

		if ( token.length < 5 ) {
			$( '#mapbox-access-token-status' ).text( '' );
			return;
		}

		const url = 'https://api.mapbox.com/tokens/v2?access_token=' + token;

		$( '#mapbox-access-token-status' ).text( 'checking token ...' );
		jQuery.getJSON( url, ( data ) => {
			$( '#mapbox-access-token-status' ).text( data.code );
		} );
	}

	jQuery( document ).ready( function ( $ ) {
		checkAccessToken();
		$( '#mapbox-access-token' ).focusout( checkAccessToken );
	} );
} )( jQuery );
