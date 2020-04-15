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

L.Icon.Default.mergeOptions({
    iconRetinaUrl: marker2x,
    iconUrl: marker,
    shadowUrl: markerShadow
});


export class MapComponent extends Component {

  constructor(props) {
    super(...arguments);
    this.props = props;
    var self = this;

    this.bindContainer = function(container) {
      self.container = container
    }
  }

  render() {
    return (
      <div
        id='stepman_geo_location_map'
        ref={this.bindContainer}
        style={ { width:"100%", height:"300px" } }>
        (map loading here)
      </div>
      );
  }

  componentDidMount() {
    const mapConfig = {
      zoomControl: false
    };

    var map = L.map(this.container, mapConfig).setView([51.505, -0.09], 13);

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: mapbox_access_token
    }).addTo(map);

    var itemCache = [];

     // FeatureGroup is to store editable layers
    var itemsGroup = new L.FeatureGroup();
    itemsGroup.addTo(map);

    var self = this;

    // populate itemsGroup with existing data
    try {
      var meta = JSON.parse(self.props.layers);
      var haveLayers = false;
      meta.forEach(function(layer) {
        var newLayer;
          if(layer.type == 'circle') {
          newLayer = L.circle(layer.point, { radius: layer.radius});
        } else if(layer.type == 'marker') {
          newLayer = L.marker(layer.point);
        } else if (layer.type == 'polygon') {
          newLayer = L.polygon(layer.points);
        } else {
          // protect against unknown layers
          return;
        }
        haveLayers = true;
        itemsGroup.addLayer(newLayer);
        itemCache[itemsGroup.getLayerId(newLayer)] = { type: layer.type, layer: newLayer };
      });
      if(haveLayers) {
        map.fitBounds(itemsGroup.getBounds(), { animate: false });
      }
    } catch(e) {
      // fail silent
    }

    // initialize and customize control
    var drawControl = new L.Control.Draw({
      edit: {
        featureGroup: itemsGroup
      }
    });
    map.addControl(drawControl);

    jQuery(".leaflet-draw-draw-polyline").hide();
    jQuery(".leaflet-draw-draw-rectangle").hide();
    jQuery(".leaflet-draw-draw-circlemarker").hide();

    var saveLayers = function() {
      var out = [];
      console.log("= begin save =");
      itemCache.forEach( function (l) {
        console.log(itemsGroup.getLayerId(l.layer), l.type, l.layer);
        if(l.type == 'circle') {
          out.push({ type: l.type, point: l.layer.getLatLng(), radius: l.layer.getRadius()});
        } else if (l.type == 'marker') {
          out.push({ type: l.type, point: l.layer.getLatLng()});
        } else if (l.type == 'polygon') {
          out.push({ type: l.type, points: l.layer.getLatLngs()});
        }
      });
      console.log("= end save =");
      self.props.onChange(JSON.stringify(out));
    }

    map.on(L.Draw.Event.CREATED, function (event) {
      const layer = event.layer;
      itemsGroup.addLayer(layer);

      itemCache[itemsGroup.getLayerId(layer)] = { type: event.layerType, layer: layer };
      console.log("+ ", event.layerType);
      console.log("  ", event.layer);
      saveLayers();
    });
    map.on(L.Draw.Event.EDITED, function (event) {
      const layers = event.layers;
      layers.eachLayer(function(layer) {
        console.log("EDIT: ", itemsGroup.getLayerId(layer));
      })
      saveLayers();
    });
    map.on(L.Draw.Event.DELETED, function (event) {
      const layers = event.layers;
      layers.eachLayer(function (layer) {
        console.log("DELETE: ", itemsGroup.getLayerId(layer));
        delete itemCache[itemsGroup.getLayerId(layer)];
        itemsGroup.removeLayer(layer);
      });
      saveLayers();
    });

  }
}
