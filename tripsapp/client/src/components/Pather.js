import React from 'react';
import {withLeaflet} from 'react-leaflet'
import L from 'leaflet';
import {ALL} from 'leaflet-pather'

class Pather extends React.Component {
    constructor(){
        super();
        this.state ={
            mod: false,
            pather: {
                getMode: function getModeNoop() {
                    return 0;
                },
                getPaths: function getPathsNoop() {
                    return [];
                }
            }
        }
    }

    componentDidMount = () => {

        var pather = this.addMap();

        pather.on('created', this.consoleLog.bind(null, 'Created'));
        pather.on('edited',  this.consoleLog.bind(null, 'Edited'));
        pather.on('deleted', this.consoleLog.bind(null, 'Deleted'));

        // Mousetrap.bind('mod', function modDown() {
        //     this.setState({ mod: true });
        // }.bind(this), 'keydown');

        // Mousetrap.bind('mod', function modUp() {
        //     this.setState({ mod: false });
        // }.bind(this), 'keyup');

    }

    addMap = () =>{

        console.log("props");
        console.log(this.props);
        
        let pather  = new L.Pather({
                smoothFactor: 5,
                mode: ALL
        });

        L.tileLayer('https://a.tiles.mapbox.com/v4/examples.ra3sdcxr/{z}/{x}/{y}@2x.png?access_token=' + 
            'pk.eyJ1Ijoid2lsZGhvbmV5IiwiYSI6Imt3RkVmTTAifQ.oMrTcDjz8GEhZUhYME7pHw', {
            maxZoom: 18
        }).addTo(map);

        this.props.leaflet.map.addLayer(pather);
        this.setState({ pather: pather });
        return pather;

    }

    consoleLog = (type, event) => {

        var latLngs = event.latLngs.map(function(latLng) {
            return [latLng.lat, latLng.lng];
        }).join(', ') || 'Voila!';

        console.log('%c ' + type + ': %c ' + latLngs, 'border-radius: 3px; color: white; background-color: lightseagreen', 'font-size: 10px; color: black');

        this.forceUpdate();
    }

    getButtons = () => {

        var buttons = [
            { label: 'Create', icon: 'fa-pencil' },
            { label: 'Edit',   icon: 'fa-arrows-alt' },
            { label: 'Append', icon: 'fa-plus-circle' },
            { label: 'Delete', icon: 'fa-times' }
        ];

        return buttons.map((button) => {

            var mode = L.Pather.MODE[button.label.toUpperCase()];

            return {
                icon: ['fa', button.icon].join(' '),
                active: this.state.pather.getMode() & mode,
                mode: mode
            };

        });

    }

    toggleMode = (mode) => {

        if (this.state.mod) {
            this.state.pather.setMode(mode);
            return this.forceUpdate();
        }

        var currentMode = this.state.pather.getMode();
        
        if (currentMode & mode) {

            // Unset the selected mode.
            this.state.pather.setMode(currentMode ^ mode);
            return void this.forceUpdate();

        }

        // Set the selected mode.
        this.state.pather.setMode(currentMode | mode);
        this.forceUpdate();
        
    }

    render() {

        return (

            <main>
                <ul className="buttons">

                    {this.getButtons().map((button, i ) => {
                        return (
                            <li key={i} onClick={this.toggleMode.bind(null, button.mode)}
                                className={button.active ? 'active' : ''}>
                                <i className={button.icon}></i>
                            </li>
                        );
                    })}

                </ul>
                <label className="mod">Note: mod + click for exclusive mode.</label>
                <label className="count">{this.state.pather.getPaths().length}</label>
                <section className="map"></section>
            </main>

        );

    }
}

export default withLeaflet(Pather)
// <Pather accessToken="" />,