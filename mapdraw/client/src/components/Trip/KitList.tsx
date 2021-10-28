import { propertiesContainsFilter } from "@turf/clusters";
import * as React from "react"

import KitLists from './KitLists'

type Props = {
  add: Function;
}

type State = {
  value: string;
}

 export default class KitList extends React.Component<Props, State>{
    constructor(props: Props) {
      super(props);

    }


    render (){

        return (
        <div> </div>
        )
    }

}
    