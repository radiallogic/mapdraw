import { DivIcon, Marker, DomEvent } from 'leaflet';
import { polylines, modesKey, notifyDeferredKey } from '../Paths';
import { updateFor } from './Layer';
import { CREATE, EDIT } from './Flags';

/**
 * @method createEdges
 * @param {Object} map
 * @param {L.polyline} polyline
 * @param {Object} options
 * @return {Array}
 */
export default function createEdges(map, polyline, options) {

    // /**
    //  * @method fetchLayerPoints
    //  * @param polyline {Object}
    //  * @return {Array}
    //  */
    // const fetchLayerPoints = polyline => {

    //     return polyline.getLatLngs()[0].map(latLng => {
    //         return map.latLngToLayerPoint(latLng);
    //     });

    // };

    // ;

    const markers = polyline.getLatLngs().map(latLng => {

        const mode = map[modesKey];
        const icon = new DivIcon();
        const marker = new Marker(latLng, { icon }).addTo(map);

        // Disable the propagation when you click on the marker.
        DomEvent.disableClickPropagation(marker);

        marker.on('mousedown', function mouseDown() {

            if (!(map[modesKey] & EDIT)) {

                // polylines can only be created when the mode includes edit.
                map.off('mousedown', mouseDown);
                return;

            }

            // Disable the map dragging as otherwise it's difficult to reposition the edge.
            map.dragging.disable();

            /**
             * @method mouseMove
             * @param {Object} event
             * @return {void}
             */
            const mouseMove = event => {

                // Determine where to move the marker to from the mouse move event.
                const containerPoint = map.latLngToContainerPoint(event.latlng);
                const latLng = map.containerPointToLatLng(containerPoint);

                // Update the marker with the new lat/lng.
                marker.setLatLng(latLng);

                // ...And finally update the polyline to match the current markers.
                const latLngs = markers.map(marker => marker.getLatLng());
                polyline.setLatLngs(latLngs);
                polyline.redraw();

            };

            // Listen for the mouse move events to determine where to move the marker to.
            map.on('mousemove', mouseMove);

            /**
             * @method mouseUp
             * @return {void}
             */
            function mouseUp() {

                if (!(map[modesKey] & CREATE)) {

                    // Re-enable the dragging of the map only if created mode is not enabled.
                    map.dragging.enable();

                }

                // Stop listening to the events.
                map.off('mouseup', mouseUp);
                map.off('mousedown', mouseDown);
                map.off('mousemove', mouseMove);

                // Attempt to simplify the polyline to prevent voids in the polyline.
                // fillpolyline(map, polyline, options);

                // Merge the polylines if the options allow using a two-pass approach as this yields the better results.
                // const merge = () => mergepolylines(map, Array.from(polylines.get(map)), options);
               //  options.mergepolylines && merge() && merge();

                // Trigger the event for having modified the edges of a polyline, unless the `notifyAfterEditExit`
                // option is equal to `true`, in which case we'll defer the notification.
                // options.notifyAfterEditExit ? (() => {

                //     // Deferred function that will be invoked by `modeFor` when the `EDIT` mode is exited.
                //     //map[notifyDeferredKey] = () => updateFor(map, 'edit');

                // })() : updateFor(map, 'edit');

            }

            // Cleanup the mouse events when the user releases the mouse button.
            // We need to listen on both map and marker, because if the user moves the edge too quickly then
            // the mouse up will occur on the map layer.
            map.on('mouseup', mouseUp);
            marker.on('mouseup', mouseUp);

        });

        return marker;

    });

    return markers;

}
