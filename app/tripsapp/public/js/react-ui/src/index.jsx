import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import store, { history } from './store'

//import App from './containers/app/app.jsx'
import Map from './containers/map/map.jsx'

//import './index.css'

const target = document.querySelector('#root')

render(
  <Provider store={store}>
    <Map />
  </Provider>,
  target
)