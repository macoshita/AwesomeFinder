/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react'
import {
  AppRegistry,
  AlertIOS
} from 'react-native'
import {Scene, Router} from 'react-native-router-flux'
import FileList from './FileList'
import FileView from './FileView'

export default class AwesomeFinder extends Component {
  render () {
    return (
      <Router>
        <Scene key='fileList'
          component={FileList}
          title='一覧'
          initial='true'
          hideNavBar={true}/>
        <Scene key='fileView'
          component={FileView}
          rightTitle='ふりがな'
          rightButtonStyle={{paddingLeft: 0}}
          onRight={FileView.changePhonetic}
          hideNavBar={false}/>
      </Router>
    )
  }
}

AppRegistry.registerComponent('AwesomeFinder', () => AwesomeFinder)
