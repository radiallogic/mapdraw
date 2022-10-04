import { LatLng, latLng } from "leaflet";
import * as React from "react"
import { Marker, Popup } from "react-leaflet";
// import Addlink from './addlink';
// import Addtext from './addtext';
import DisplayLink from './displayLink';
import DisplayText from './displayText';
import {SiteItem} from './SiteTypes';


import {TSite} from './SiteTypes'

type Props = {
    site: TSite;
    save: Function;
}

type State = {
	site: TSite;
}

export default class SiteMarker extends React.Component<Props, State>{
    constructor(props: Props) {
        super(props);

        const s: TSite = {
            position: new LatLng(0,0),
            rows: []
        }

        this.state = {
            site: s
        }
    }

    componentDidMount = () => {
        this.setState({site: this.props.site}); 
    }

    componentDidUpdate = (prevProps: Props) => {
        if(this.props.site !== prevProps.site){
            this.setState({site:this.props.site})
        }
    } 

    addlink = () => {
        let site = this.state.site;
        
        const s: SiteItem = {
            type: "link",
            value: "",
            name: ""
        }
        site.rows.unshift(s);
        this.setState({site: site});
    }

    addText = () => {
        let site = this.state.site;
        
        const s: SiteItem = {
            type: "text",
            value: "",
            name: ""
        }
        site.rows.unshift(s);
        this.setState({site: site});
    }

    saveSite = () => {
        this.props.save();
    }

    render(){

        console.log(this.state.site)

        let rows = this.state.site.rows.map((item: SiteItem) => {
            if(item.type == "link"){
                return <DisplayLink data={item} />
            }
            if(item.type == "text"){
                return <DisplayText data={item} />
            }
        })

        return(
            <Marker position={this.props.site.position}>
                <Popup>
                    <div className={"bubble "} >
                        <button value="Add Link" onClick={this.addlink} /> <button value="Add Text" onClick={this.addlink} /> 
                        {rows}
                    </div>
                </Popup>
            </Marker>
        )
    }

}