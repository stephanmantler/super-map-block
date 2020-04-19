'use strict';

import { Component } from '@wordpress/element';
import { withInstanceId } from '@wordpress/compose';

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

	render() {
		return (
			<div
				id="stepman_geo_location_map"
				ref={ this.bindContainer }
				style={ this.props.style }
			>
				(map loading here)
			</div>
		);
	}

	componentDidMount() {
		const mapConfig = {
			zoomControl: false,
		};

		const map = L.map( this.container, mapConfig ).setView(
			[ 51.505, -0.09 ],
			13
		);

		if (
			this.props.accessToken !== undefined &&
			this.props.accessToken.length > 0
		) {
			L.tileLayer(
				'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
				{
					attribution:
						'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
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
			if ( haveLayers ) {
				map.fitBounds( itemsGroup.getBounds(), { animate: false } );
			}
		} catch ( e ) {
			// fail silent
		}

		// show edit controls, if enabled
		if ( this.props.allowEdit == true ) {
			// initialize and customize control
			const drawControl = new L.Control.Draw( {
				edit: {
					featureGroup: itemsGroup,
				},
			} );
			map.addControl( drawControl );
	
			const saveLayers = function() {
				const out = [];
	
				itemCache.forEach( function( l ) {
					if ( l.type === 'circle' ) {
						out.push( {
							type: l.type,
							point: l.layer.getLatLng(),
							radius: l.layer.getRadius(),
						} );
					} else if ( l.type === 'marker' ) {
						out.push( { type: l.type, point: l.layer.getLatLng() } );
					} else if ( l.type === 'polygon' ) {
						out.push( { type: l.type, points: l.layer.getLatLngs() } );
					}
				} );
				self.props.onChange( JSON.stringify( out ) );
			};
	
			map.on( L.Draw.Event.CREATED, function( event ) {
				const layer = event.layer;
				itemsGroup.addLayer( layer );
	
				itemCache[ itemsGroup.getLayerId( layer ) ] = {
					type: event.layerType,
					layer,
				};
				saveLayers();
			} );
			map.on( L.Draw.Event.EDITED, function() {
				saveLayers();
			} );
			map.on( L.Draw.Event.DELETED, function( event ) {
				const layers = event.layers;
				layers.eachLayer( function( layer ) {
					delete itemCache[ itemsGroup.getLayerId( layer ) ];
					itemsGroup.removeLayer( layer );
				} );
				saveLayers();
			} );
		}
	}
}
//const MapComponent = withInstanceId( MapComponentBase );
const MapComponent = MapComponentBase;
export { MapComponent };
