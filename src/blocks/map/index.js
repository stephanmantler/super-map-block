/**
 * Definition of our map block.
 *
 * Declares the settings and basing scaffolding for the map display block.
 * Most of the heavy lifting is done in the `<MapControl>` component.
 *
 * @file   Provides registration information for the map display block.
 * @author Stephan Mantler
 * @since  1.0.0
 */

import { __, _n } from '@wordpress/i18n';
import {
	InspectorControls,
	MediaUploadCheck,
	MediaUpload,
} from '@wordpress/block-editor';
import {
	TextControl,
	PanelBody,
	PanelRow,
	ToggleControl,
	SelectControl,
} from '@wordpress/components';
import { MapComponent } from '../components';
import { withSelect } from '@wordpress/data';

// The namespaced block name.
export const name = 'stepman/super-map-block';

export const settings = {
	title: __('Super Map Block', 'super-map-block'),
	description: __('Flexible map display', 'super-map-block'),
	icon: { src: ( <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
	 viewBox="0 0 256 256">
<g id="Layer_1_1_">
	<polygon fill="none" stroke="#888" strokeWidth="10" points="226.8,201.3 173.7,211.1 120.5,204.9 67.3,211.1 14.2,201.3 27.5,148.2 14.2,95 27.5,41.8 80.6,51.6 
		133.8,45.4 187,51.6 240.1,41.8 226.8,95 240.1,148.2 	"/>
	<line stroke="#000"  fill="none" strokeWidth="1.5" x1="14.2" y1="95" x2="67.3" y2="104.8"/>
	<line stroke="#000"  fill="none" strokeWidth="1.5" x1="27.5" y1="148.2" x2="80.6" y2="158"/>
	<line stroke="#000"  fill="none" strokeWidth="1.5" x1="80.6" y1="51.6" x2="67.3" y2="104.8"/>
	<line stroke="#000"  fill="none" strokeWidth="1.5" x1="80.6" y1="158" x2="67.3" y2="211.1"/>
	<line stroke="#000"  fill="none" strokeWidth="1.5" x1="120.5" y1="204.9" x2="133.8" y2="151.8"/>
	<line stroke="#000"  fill="none" strokeWidth="1.5" x1="133.8" y1="45.4" x2="120.5" y2="98.6"/>
	<line stroke="#000"  fill="none" strokeWidth="1.5" x1="187" y1="51.6" x2="173.7" y2="104.8"/>
	<line stroke="#000"  fill="none" strokeWidth="1.5" x1="173.7" y1="211.1" x2="187" y2="158"/>
	<line stroke="#000"  fill="none" strokeWidth="1.5" x1="226.8" y1="95" x2="173.7" y2="104.8"/>
	<line stroke="#000"  fill="none" strokeWidth="1.5" x1="67.3" y1="104.8" x2="120.5" y2="98.6"/>
	<line stroke="#000"  fill="none" strokeWidth="1.5" x1="133.8" y1="151.8" x2="187" y2="158"/>
	<line stroke="#000"  fill="none" strokeWidth="1.5" x1="173.7" y1="104.8" x2="120.5" y2="98.6"/>
	<line stroke="#000"  fill="none" strokeWidth="1.5" x1="67.3" y1="104.8" x2="80.6" y2="158"/>
	<line stroke="#000"  fill="none" strokeWidth="1.5" x1="133.8" y1="151.8" x2="120.5" y2="98.6"/>
	<line stroke="#000"  fill="none" strokeWidth="1.5" x1="173.7" y1="104.8" x2="187" y2="158"/>
	<line stroke="#000"  fill="none" strokeWidth="1.5" x1="80.6" y1="158" x2="133.8" y2="151.8"/>
	<line stroke="#000"  fill="none" strokeWidth="1.5" x1="240.1" y1="148.2" x2="187" y2="158"/>
	<polygon stroke="#000"  fill="none" strokeWidth="1.5" points="27.7,41.9 80.6,51.6 133.8,45.4 186.6,51.8 240.1,41.8 226.8,95 240.1,148.2 227.2,201.5 173.7,211.1 
		120.5,204.9 67.7,211.4 13.5,201.5 27.4,148.6 14.2,95 	"/>
</g>
<g id="Layer_2_1_">
	<g>
		<polygon fill="#BA573C" stroke="#000" strokeWidth="1.65" points="16.8,92.3 41.6,55 213.5,55 238.4,92.3 127.6,203.1 		"/>
		<path stroke="#000" strokeWidth="3" d="M210,61.7l19.8,29.8L127.4,193.8L25,91.4l19.8-29.8h82.4H210 M217.1,48.4h-89.5H37.9L8.2,93.2l119.4,119.4L247,93.2
			L217.1,48.4L217.1,48.4z"/>
	</g>
	<g>
		<path fill="#fff" stroke="#000" strokeWidth="10" d="M76.3,151.3l19-22.7c11.6,8.8,24.8,12.4,37.2,12.4c6.5,0,9.1-1.7,9.1-4.6v-0.2c0-3-3.3-4.8-14.7-6.9
			c-23.8-4.8-44.8-11.7-44.8-34.2v-0.3c0-20.2,15.9-35.9,45.2-35.9c20.5,0,35.7,4.8,48.1,14.6l-17.4,24C147.9,90.1,136,87,126.1,87
			c-5.3,0-7.8,1.8-7.8,4.5v0.3c0,2.8,2.8,4.8,14.2,6.8c27.3,5,45.5,12.9,45.5,34.4v0.3c0,22.3-18.4,36.1-47,36.1
			C109.2,169.2,89.7,163.1,76.3,151.3z"/>
	</g>
</g>
</svg> )
	},
	category: 'embed',
	example: {},
	attributes: {
		width: {
			type: 'string',
			default: '100%',
		},
		height: {
			type: 'string',
			default: '400px',
		},
		mapLocation: {
			type: 'object',
			default: {
				pointX: -17.8,
				pointY: 64.65,
				zoom: 10,
			},
		},
		showMetaShapes: {
			type: 'boolean',
			default: false,
		},
		allowInteraction: {
			type: 'boolean',
			default: true,
		},
		mapStyle: {
			type: 'string',
			default: 'OpenStreetMaps',
		},
		customOverlay: {
			type: 'string',
			default: '',
		},
		customOverlayAttribution : {
			type: 'string',
			default: '',
		},
		layers: {
			type: 'string',
			default: '',
		},
		attachments: {
			type: 'array',
			default: [],
		},
	},
	/*
	 * Creates the edit (backend) representation of this block.
	 *
	 * Also uses `withSelect` to pull annotation layers from the backend and store
	 * them in an attribute for later use in `save()`.
	 */
	edit: withSelect( ( select ) => {
		return {
			layers: select( 'core/editor' ).getEditedPostAttribute( 'meta' )
				.stepman_meta_geolocation,
		};
	} )( ( props ) => {
		const {
			attributes: {
				width,
				height,
				mapLocation,
				allowInteraction,
				showMetaShapes,
				attachments,
				mapStyle,
				customOverlay,
				customOverlayAttribution,
			},
			layers,
		} = props;

		if ( showMetaShapes ) {
			props.setAttributes( { layers } );
		} else {
			props.setAttributes( { layers: '' } );
		}

		const onChangeWidth = ( newValue ) => {
			props.setAttributes( { width: newValue } );
		};

		const onChangeHeight = ( newValue ) => {
			props.setAttributes( { height: newValue } );
		};

		const onMapChange = ( newValue ) => {
			props.setAttributes( { mapLocation: newValue } );
		};

		const onToggleInteraction = ( newValue ) => {
			props.setAttributes( { allowInteraction: newValue } );
		};

		const onToggleShowMeta = ( newValue ) => {
			props.setAttributes( { showMetaShapes: newValue } );
		};

		const onSelectAttachments = ( newValue ) => {
			props.setAttributes( { attachments: newValue } );
		};

		const onChangeMapStyle = ( newValue ) => {
			props.setAttributes( { mapStyle: newValue } );
		};

		const onChangeOverlay = ( newValue ) => {
			props.setAttributes( { customOverlay: newValue } );
		};

		const onChangeOverlayAttribution = ( newValue ) => {
			props.setAttributes( { customOverlayAttribution: newValue } );
		};

		let mapOptions = [
			{ label: 'OpenStreetMap', value: 'OpenStreetMap' },
			{ label: 'OpenTopoMap', value: 'OpenTopoMap' },
		];
		// only include MapBox if we have an access token
		if ( window.stepmanMapboxAccessToken !== undefined && window.stepmanMapboxAccessToken.length > 0 ) {
			mapOptions.push ( { label: 'MapBox', value: 'MapBox' } );
		}
		// ... and add 'None' as the last option
		mapOptions.push ( { label: 'None', value: 'None' } );

		const controls = [
			<InspectorControls key="stepman_map_controls">
				<PanelBody title={ __("Map Settings", 'super-map-block') } >
					<PanelRow>
						<TextControl
							label={ __("Width", 'super-map-block') }
							value={ width }
							onChange={ onChangeWidth }
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							label={ __("Height", 'super-map-block') }
							value={ height }
							onChange={ onChangeHeight }
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label={ __("allow pan & zoom", 'super-map-block') }
							checked={ allowInteraction }
							onChange={ onToggleInteraction }
						/>
					</PanelRow>
				</PanelBody>
				<PanelBody title={ __("Data / Overlays", 'super-map-block') } initialOpen= { false }>
					<PanelRow>
						<ToggleControl
							label={ __("show post annotation shapes", 'super-map-block') }
							checked={ showMetaShapes }
							onChange={ onToggleShowMeta }
						/>
					</PanelRow>
					<PanelRow>
						<SelectControl
							label={ __("Base Map", 'super-map-block') }
							value={ mapStyle }
							onChange={ onChangeMapStyle }
							options={ mapOptions }
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							label={ __("Custom Overlay Layer", 'super-map-block') }
							value= { customOverlay }
							onChange={ onChangeOverlay }
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							label={ __("Custom Attribution", 'super-map-block') }
							value= { customOverlayAttribution }
							onChange={ onChangeOverlayAttribution }
						/>
					</PanelRow>					
					<PanelRow>
						<MediaUploadCheck>
							<MediaUpload
								onSelect={ onSelectAttachments }
								type="application/geo+json"
								value={ attachments }
								multiple={ true }
								render={ ( { open } ) => (
									<>
										<button onClick={ open }>
											{ __("Attach GeoJSON", 'super-map-block') }
										</button>
									</>
								) }
							/>
						</MediaUploadCheck>
					</PanelRow>
				</PanelBody>
			</InspectorControls>,
		];

		const style = {
			width,
			height,
		};

		return (
			<>
				{ controls }
				<MapComponent
					accessToken={ window.stepmanMapboxAccessToken }
					mapStyle = { mapStyle }
					customOverlay = { customOverlay }
					customOverlayAttribution = { customOverlayAttribution }
					style={ style }
					location={ mapLocation }
					onLocationChange={ onMapChange }
					allowInteraction={ allowInteraction }
					layers={ showMetaShapes ? layers : '' }
					attachments={ attachments }
				/>
			</>
		);
	} ),
	/*
	 * Produces a serializable representation of this block.
	 *
	 * We can't pull post metadata to access the annotation layers (see
	 * the [block editor docs](https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#save))
	 * so we specify this from the attributes.
	 */
	save: ( props ) => {
		const style = {
			width: props.attributes.width,
			height: props.attributes.height,
		};

		return (
			<MapComponent
				accessToken={ window.stepmanMapboxAccessToken }
				style={ style }
				location={ props.attributes.mapLocation }
				allowInteraction={ props.attributes.allowInteraction }
				layers={ props.attributes.layers }
				attachments={ props.attributes.attachments }
				mapStyle = { props.attributes.mapStyle }
				customOverlay = { props.attributes.customOverlay }
				customOverlayAttribution = { props.attributes.customOverlayAttribution }
			/>
		);
	},
};
