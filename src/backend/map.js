import L from 'leaflet';
//import 'leaflet/dist/leaflet.css';
import 'leaflet-draw';

import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';


// fixing leaflet marker paths, via https://github.com/PaulLeCam/react-leaflet/issues/255
// stupid hack so that leaflet's images work after going through webpack

import marker from 'leaflet/dist/images/marker-icon.png';
import marker2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: marker2x,
    iconUrl: marker,
    shadowUrl: markerShadow
});

console.log("-- loading admin js --");

(function ($) {
  'use strict';
  console.log("-- admin starting --");
  // execute when the DOM is ready
  $(document).ready(function () {
    
    // abort if we can't detect the map div
    if(0 == $('#local_meta_map_field').length) {
      return;
    }
    
    console.log("-- loading map --");
    
    const mapConfig = {
      zoomControl: false
    };
    
    
    // local_meta_map_field
    var map = L.map('local_meta_map_field', mapConfig).setView([51.505, -0.09], 13);
    
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: 'MAPBOX_TOKEN'
    }).addTo(map);
    
    var itemCache = [];
    
     // FeatureGroup is to store editable layers
    var itemsGroup = new L.FeatureGroup();
    itemsGroup.addTo(map);
    
    // populate itemsGroup with existing data
    try {
      var load = $("#stepman_post_geojson").val();
      var meta = JSON.parse(load);
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
        console.log("bounds are" + itemsGroup.getBounds());
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
    
    $(".leaflet-draw-draw-polyline").hide();
    $(".leaflet-draw-draw-rectangle").hide();
    $(".leaflet-draw-draw-circlemarker").hide();
    
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
      $("#stepman_post_geojson").val(JSON.stringify(out));

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
    
  }); // $(document).ready
}(jQuery));