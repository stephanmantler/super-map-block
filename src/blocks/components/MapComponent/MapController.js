/**
 * Map integration glue code.
 *
 * Provides some additional functionality for initialization and handling
 * of the map display layer.
 *
 * @file	 Provides map integration glue code.
 * @author Stephan Mantler
 * @since	 1.0.0
 */

import L from 'leaflet';
import 'proj4leaflet';

import marker from 'leaflet/dist/images/marker-icon.png';
import marker2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions( {
	iconRetinaUrl: marker2x,
	iconUrl: marker,
	shadowUrl: markerShadow,
} );

function convertGeoJSON( meta ) {
	const itemsGroup = new L.FeatureGroup();

	L.Proj.geoJson( meta, {
		pointToLayer: ( feature, latlng ) => {
			if ( feature.properties.radius ) {
				return new L.Circle( latlng, feature.properties.radius );
			}
			return new L.Marker( latlng );
		},

		onEachFeature: ( feature, layer ) => {
			itemsGroup.addLayer( layer );
		},

		style: ( feature ) => {
			if ( feature.properties.style ) {
				return feature.properties.style;
			}
			return {
				/* default */
			};
		},
	} );

	return itemsGroup;
}

export function parseGeoJSON( data ) {
	// populate itemsGroup with existing data
	try {
		const meta = JSON.parse( data );
		return convertGeoJSON( meta );
	} catch ( e ) {
		// fail silent
	}

	// return an empty group in case of failure.
	return new L.FeatureGroup();
}

export function hookMap( elem, mapConfig ) {
	// collect extra layers before attaching the map, just in case the div gets cobbled with other elements
	const extraLayers = jQuery( elem )
		.find( '.data-layer' )
		.map( ( index, div ) => div.getAttribute( 'data-geojson-url' ) );

	const map = L.map( elem, mapConfig ).setView( [ 51.505, -0.09 ], 13 );

	L.control.attribution( { position: 'bottomright' } ).addTo( map );

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
		L.tileLayer( 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png ', {
			attribution:
				'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
		} ).addTo( map );
	}

	extraLayers.each( ( index, layer ) => {
		jQuery.getJSON( layer, ( data ) => {
			const group = convertGeoJSON( data );
			group.addTo( map );
		} );
	} );

	const px = elem.getAttribute( 'data-poslon' );
	const py = elem.getAttribute( 'data-poslat' );
	const zoom = elem.getAttribute( 'data-zoom' );

	if ( px !== null && py !== null && zoom !== null ) {
		map.setView( [ py, px ], zoom );
	} else {
		map.setView( [ 64.65, -17.8 ], 5 );
	}

	return map;
}
