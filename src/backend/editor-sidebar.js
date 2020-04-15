import { registerPlugin } from '@wordpress/plugins';
import { PluginSidebar, PluginSidebarMoreMenuItem } from '@wordpress/edit-post';
import { PanelBody, TextControl } from '@wordpress/components';
import { withSelect } from '@wordpress/data';
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
        layers={props.geodata_field}
      />
      <TextControl
        label="Geolocation"
        value={props.geodata_field} //{wp.data.select('core/editor').getEditedPostAttribute('meta')['stepman_post_geojson']}
    //            value={ attributes.blockValue }
    //            onChange={ updateBlockValue }
      />
    </PanelBody>
    </>
  )
}

PluginMetaFields = withSelect(
  (select) => {
    return {
      geodata_field: select('core/editor').getEditedPostAttribute('meta')['stepman_post_geojson']
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

/*
import { registerBlockType } from '@wordpress/blocks';
import { TextControl } from '@wordpress/components';
 
registerBlockType( 'stepman/geo-location', {
    title: 'Location',
    icon: 'smiley',
    category: 'common',
 
    attributes: {
        blockValue: {
            type: 'string',
            source: 'meta',
            meta: 'stepman_post_geojson',
        },
    },
 
    edit( { className, setAttributes, attributes } ) {
        function updateBlockValue( blockValue ) {
            setAttributes( { blockValue } );
        }
 
        return (
            <div className={ className }>
                <TextControl
                    label="Meta Block Field"
                    value={ attributes.blockValue }
                    onChange={ updateBlockValue }
                />
            </div>
        );
    },
 
    // No information saved to the block
    // Data is saved to post meta via attributes
    save() {
        return null;
    },
} );
*/