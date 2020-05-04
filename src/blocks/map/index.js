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
} from '@wordpress/components';
import { MapComponent } from '../components';
import { withSelect } from '@wordpress/data';

// The namespaced block name.
export const name = 'stepman/post-map-block';

export const settings = {
	title: 'Map Block',
	description: 'Embed a leaflet map element',
	icon: 'admin-site-alt3',
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

		const controls = [
			<InspectorControls key="stepman_map_controls">
				<PanelBody title="Map Settings">
					<PanelRow>
						<TextControl
							label="Width"
							value={ width }
							onChange={ onChangeWidth }
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							label="Height"
							value={ height }
							onChange={ onChangeHeight }
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label="allow pan & zoom"
							checked={ allowInteraction }
							onChange={ onToggleInteraction }
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label="show global annotation shapes"
							checked={ showMetaShapes }
							onChange={ onToggleShowMeta }
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
											Attach GeoJSON File
										</button>
										{ attachments.map( ( x ) => x.id ) }
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
			/>
		);
	},
};
