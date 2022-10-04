import * as React from "react"
import {SiteItem} from './SiteTypes';

type Props = {
    data: SiteItem;
}
export default class displayLink extends React.PureComponent<Props>{
    render(){
        return(
            <div className='bubble' >
                {this.props.data.value}
            </div>
        )
    }

}