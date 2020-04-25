/**
 * Map integration glue code.
 *
 * Provides some additional functionality for initialization and handling
 * of the map display layer.
 *
 * @link   https://github.com/stephanmantler/stepman-geo-post
 * @file   Provides map integration glue code.
 * @author Stephan Mantler
 * @since  1.0.0
 */
import L from 'leaflet';

import marker from 'leaflet/dist/images/marker-icon.png';
import marker2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions( {
	iconRetinaUrl: marker2x,
	iconUrl: marker,
	shadowUrl: markerShadow,
} );

export function parseGeoJSON( data ) {
  const itemsGroup = new L.FeatureGroup();

  // populate itemsGroup with existing data
  try {
    const meta = JSON.parse( data );

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
        style: (feature) => {
          if ( feature.properties.style ) {
            return feature.properties.style;
          } else {
            return { /* default */ };
          }
        },
      } );
    } );
  } catch ( e ) {
    // fail silent
  }

  return itemsGroup;
}

export function hookMap( elem, mapConfig ) {
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

  return map;
}
