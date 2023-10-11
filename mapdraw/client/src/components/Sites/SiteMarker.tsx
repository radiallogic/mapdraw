import { LatLng, latLng } from "leaflet";
import * as React from "react"
import { Marker, Popup } from "react-leaflet";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';

import {TSite} from './SiteTypes'

type Props = {
    site: TSite;
    save: Function;
    setSites: Function;
}

type State = {
	site: TSite;
    edit: boolean
}

export default class SiteMarker extends React.Component<Props, State>{
    constructor(props: Props) {
        super(props);

        const s: TSite = {
            position: new LatLng(0,0),
            content: ''
        }

        this.state = {
            site: s,
            edit: false
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

    saveSite = () => {
        this.props.setSites(this.state.site);
        this.props.save();
    }

    edit = (e: any) => {
        e.stopPropagation();
        this.setState({edit:true});
    }

    setSiteContent = (content: string) => {
        const s: TSite = {
            position: new LatLng(0,0),
            content: content
        }

        this.setState({site:s});
    }

    render(){

        //console.log(this.state.site)

        let content = null;
        if(this.state.edit == false){
            if(this.state.site.content != ''){
                content = <div dangerouslySetInnerHTML={{__html: this.state.site.content}} /> 
            }else{
                content = <button onClick={this.edit} > "Click here to edit and add content" </button>
            }
        }else{
            content = <ReactQuill theme="snow" value={this.state.site.content} onChange={this.setSiteContent} />;
        }

        return(
            <Marker
                position={this.props.site.position}
                draggable={true}
                bubblingMouseEvents={false}
                eventHandlers={ {
                    mouseup: (event) => {
                        
                    },
                    popupclose: () => {
                        this.props.save();
                        this.setState({edit:false});
                    }
                } }
            >
                <Popup>
                    {content}
                </Popup>
            </Marker>
        )
    }
}