import { registerPlugin } from '@wordpress/plugins';
import { PluginSidebar, PluginSidebarMoreMenuItem } from '@wordpress/edit-post';
import { PanelBody, TextControl } from '@wordpress/components';
import { withSelect, withDispatch } from '@wordpress/data';
import { Component } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { MapComponent } from './components';

let PluginMetaFields = (props) => {
  return (
    <>
    <PanelBody
      title="Geolocation"
      icon="admin-post"
      initialOpen={ true }
    >
      <MapComponent
        layers={props.metaFieldValue}
        onChange={(value) => props.setMetaFieldValue(value)}
      />
      <TextControl
        label="Geolocation"
        value={props.metaFieldValue}
        onChange={(value) => props.setMetaFieldValue(value)}
      />
    </PanelBody>
    </>
  )
}

PluginMetaFields = withSelect(
  (select) => {
    return {
      metaFieldValue: select('core/editor').getEditedPostAttribute('meta')['stepman_post_geojson']
    }
  }
)(PluginMetaFields);

PluginMetaFields = withDispatch(
  (dispatch) => {
    return {
      setMetaFieldValue: (value) =>{
        dispatch('core/editor').editPost({meta: { stepman_post_geojson: value }})
      }
    }
  }
)(PluginMetaFields);

registerPlugin( 'stepman-geo-location', {
  render: function() {
    return (
      <>
        <PluginSidebarMoreMenuItem
          target='stepman-geo-location'>
          Geolocation
        </PluginSidebarMoreMenuItem>
        <PluginSidebar
          name='stepman-geo-location'
          icon='admin-post'
          title='Geolocation'
        >
          <PluginMetaFields />
        </PluginSidebar>
      </>
    );
  }
});
