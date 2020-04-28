/**
 * Frontend map initialization and handling.
 *
 * Provides functionality that is specific to the frontend map display (disabled
 * interaction, etc).
 *
 * @link   https://github.com/stephanmantler/stepman-geo-post
 * @file   Implements frontend map integration.
 * @author Stephan Mantler
 * @since  1.0.0
 */

import 'jquery';
import L from 'leaflet';

import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

import { hookMap, parseGeoJSON } from './blocks/components/MapComponent/MapController.js';

jQuery( document ).ready(
	( function() {
		jQuery( '.stepman_geo_location_map' ).each( function( index, elem ) {
			const allowInteraction = ( elem.getAttribute( 'data-interactive' ) === 'true' );

			const mapConfig = {
				zoomControl: allowInteraction,
				dragging: allowInteraction,
				boxZoom: allowInteraction,
				doubleClickZoom: allowInteraction,
				scrollWheelZoom: allowInteraction,
				keyboard: allowInteraction,
				touchZoom: allowInteraction,
				attributionControl: false,
			};

			const map = hookMap( elem, mapConfig );

			if ( !allowInteraction ) {
				const zoom = map.getZoom();
				map.setMinZoom( zoom );
				map.setMaxZoom( zoom );
			}

			const layers = elem.getAttribute( 'data-layers' );

			// if no layers, we're done.
			if ( !layers || layers === "" ) {
				return;
			}
			const itemsGroup = parseGeoJSON( layers );
			itemsGroup.addTo( map );
		} );
	} )( jQuery )
);
