/**
 * Implements the Map component.
 *
 * @link   https://github.com/stephanmantler/stepman-geo-post
 * @file   Implements the Map component.
 * @author Stephan Mantler
 * @since  1.0.0
 */
'use strict';

import { Component } from '@wordpress/element';

import L from 'leaflet';
//import 'leaflet/dist/leaflet.css';
import 'leaflet-draw';

import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

import marker from 'leaflet/dist/images/marker-icon.png';
import marker2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions( {
	iconRetinaUrl: marker2x,
	iconUrl: marker,
	shadowUrl: markerShadow,
} );

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
		return (
			<div
				className="stepman_geo_location_map"
				ref={ this.bindContainer }
				{ ...divprops }
				style={ this.props.style }
				data-token={ this.props.accessToken || null }
				data-interactive={ this.props.allowInteraction }
				data-layers={this.props.layers}
			></div>
		);
	}

	componentDidMount() {
		const mapConfig = {
			zoomControl: false,
			attributionControl: false,
		};

		const map = L.map( this.container, mapConfig ).setView(
			[ 51.505, -0.09 ],
			13
		);

		map.on( 'zoomend', ( e ) => {
			this.updatePosition( e.target );
		} );
		map.on( 'moveend', ( e ) => {
			this.updatePosition( e.target );
		} );

		L.control.attribution( { position: 'topright' } ).addTo( map );

		if (
			this.props.accessToken !== undefined &&
			this.props.accessToken.length > 0
		) {
			L.tileLayer(
				'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
				{
					attribution:
						'&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> | <a href="https://www.mapbox.com/">Mapbox</a>',
					maxZoom: 18,
					id: 'mapbox/streets-v11',
					tileSize: 512,
					zoomOffset: -1,
					accessToken: this.props.accessToken,
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
		if ( this.props.location !== undefined ) {
			const l = this.props.location;
			map.setView( [ l.pointY, l.pointX ], l.zoom );
		} else {
			map.setView( [ 64.65, -17.8 ], 5 );
		}

		// FeatureGroup is to store editable layers
		const itemsGroup = new L.FeatureGroup();
		itemsGroup.addTo( map );

		const self = this;

		// populate itemsGroup with existing data
		try {
			const meta = JSON.parse( self.props.layers );

			meta.features.forEach( function( feature ) {

				L.geoJSON( feature, {
					pointToLayer: (feature, latlng) => {
						if ( feature.properties.radius ) {
							return new L.Circle( latlng, feature.properties.radius );
						} else {
							return new L.Marker( latlng );
						}
					},
					onEachFeature: (feature, layer) => {
						itemsGroup.addLayer(layer);
					},
				} );
			} );
			// don't jump around if we have a defined location
			if ( itemsGroup.getLayers().length && this.props.location === undefined ) {
				map.fitBounds( itemsGroup.getBounds(), { animate: false } );
			}
		} catch ( e ) {
			// fail silent
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
