/* -- no frontend JS [yet] -- */

import L from 'leaflet';

import 'leaflet/dist/leaflet.css';

jQuery( document ).ready(
	( function() {
		jQuery( '.stepman_geo_location_map' ).each( function( index, elem ) {
			const map = L.map( elem ).setView( [ 51.505, -0.09 ], 13 );

			L.control.attribution( { position: 'topright' } ).addTo( map );

			const accessToken = elem.getAttribute( 'data-token' );

			if ( accessToken !== null && accessToken.length > 0 ) {
				L.tileLayer(
					'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
					{
						attribution:
							'&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> | <a href="https://www.mapbox.com/">Mapbox</a>',
						maxZoom: 18,
						id: 'mapbox/streets-v11',
						tileSize: 512,
						zoomOffset: -1,
						accessToken,
					}
				).addTo( map );
			} else {
				L.tileLayer(
					'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png ',
					{
						attribution:
							'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
					}
				).addTo( map );
			}

			const px = elem.getAttribute( 'data-poslon' );
			const py = elem.getAttribute( 'data-poslat' );
			const zoom = elem.getAttribute( 'data-zoom' );

			if ( px !== null && py !== null && zoom !== null ) {
				map.setView( [ py, px ], zoom );
			} else {
				map.setView( [ 64.65, -17.8 ], 5 );
			}

			/*
		const itemCache = [];
	
		// FeatureGroup is to store editable layers
		const itemsGroup = new L.FeatureGroup();
		itemsGroup.addTo( map );
	
		const self = this;
	
		// populate itemsGroup with existing data
		try {
			const meta = JSON.parse( self.props.layers );
			let haveLayers = false;
			meta.forEach( function( layer ) {
				let newLayer;
				if ( layer.type === 'circle' ) {
					newLayer = L.circle( layer.point, {
						radius: layer.radius,
					} );
				} else if ( layer.type === 'marker' ) {
					newLayer = L.marker( layer.point );
				} else if ( layer.type === 'polygon' ) {
					newLayer = L.polygon( layer.points );
				} else {
					// protect against unknown layers
					return;
				}
				haveLayers = true;
				itemsGroup.addLayer( newLayer );
				itemCache[ itemsGroup.getLayerId( newLayer ) ] = {
					type: layer.type,
					layer: newLayer,
				};
			} );
			// don't jump around if we have a defined location
			if ( haveLayers && this.props.location === undefined ) {
				map.fitBounds( itemsGroup.getBounds(), { animate: false } );
			}
		} catch ( e ) {
			// fail silent
		}
		*/
		} );
	} )( jQuery )
);
