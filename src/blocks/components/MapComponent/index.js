/**
 * Implements the backend Map component.
 *
 * @link   https://github.com/stephanmantler/stepman-geo-post
 * @file   Implements the Map component.
 * @author Stephan Mantler
 * @since  1.0.0
 */
'use strict';

import { Component } from '@wordpress/element';

import { hookMap, parseGeoJSON } from './MapController.js';

import L from 'leaflet';
//import 'leaflet/dist/leaflet.css';
import 'leaflet-draw';

import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

class MapComponentBase extends Component {
	constructor( props ) {
		super( ...arguments );

		this.props = props;
		const self = this;

		this.bindContainer = function( container ) {
			self.container = container;
		};
	}

	updatePosition( map ) {
		const pos = map.getCenter();
		const zoo = map.getZoom();

		if ( this.props.onLocationChange !== undefined ) {
			this.props.onLocationChange( {
				pointX: pos.lng,
				pointY: pos.lat,
				zoom: zoo,
			} );
		}
	}

	render() {
		const self = this;
		const divprops = {
			style: self.props.style,
		};
		if ( this.props.location !== undefined ) {
			divprops[ 'data-poslon' ] = this.props.location.pointX;
			divprops[ 'data-poslat' ] = this.props.location.pointY;
			divprops[ 'data-zoom' ] = this.props.location.zoom;
		}
		let attachments = [];
		if ( this.props.attachments !== undefined) {
			attachments = this.props.attachments.map( (attachment, index) => <div key={ attachment.id } id={ "data_layer_" + index } className="data-layer" data-geojson-url={ attachment.url }></div> );
		}
		return (
			<div
				className="stepman_geo_location_map"
				ref={ this.bindContainer }
				{ ...divprops }
				style={ this.props.style }
				data-token={ this.props.accessToken || null }
				data-interactive={ this.props.allowInteraction }
				data-layers={this.props.layers}
			>{ attachments }</div>
		);
	}

	componentDidMount() {
		const mapConfig = {
			zoomControl: false,
			attributionControl: false,
		};

		const map = hookMap( this.container, mapConfig );

		map.on( 'zoomend', ( e ) => {
			this.updatePosition( e.target );
		} );
		map.on( 'moveend', ( e ) => {
			this.updatePosition( e.target );
		} );

		const itemsGroup = parseGeoJSON( this.props.layers );
		itemsGroup.addTo( map );

		// don't jump around if we have a defined location
    if ( itemsGroup.getLayers().length && this.props.location === undefined ) {
      map.fitBounds( itemsGroup.getBounds(), { animate: false } );
    }

		// show edit controls, if enabled
		if ( this.props.allowEdit === true ) {
			// initialize and customize control
			const drawControl = new L.Control.Draw( {
				edit: {
					featureGroup: itemsGroup,
				},
			} );
			map.addControl( drawControl );

			const self = this;

			const saveLayers = function() {
				const out = { type: "FeatureCollection", features: [] };

				itemsGroup.eachLayer( function( l ) {
					const json = l.toGeoJSON();

					if ( l instanceof L.Circle ) {
						json.properties.radius = l.getRadius();
					}
					out.features.push(json);
				} );
				self.props.onChange( JSON.stringify( out ) );
			};

			map.on( L.Draw.Event.CREATED, function( event ) {
				const layer = event.layer;
				itemsGroup.addLayer( layer );
				saveLayers();
			} );
			map.on( L.Draw.Event.EDITED, function() {
				saveLayers();
			} );
			map.on( L.Draw.Event.DELETED, function( event ) {
				const layers = event.layers;
				layers.eachLayer( function( layer ) {
					itemsGroup.removeLayer( layer );
				} );
				saveLayers();
			} );
		}
	}
}
//const MapComponent = withInstanceId( MapComponentBase );
export const MapComponent = MapComponentBase;
export default MapComponent;
