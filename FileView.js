// @flow
import React, { Component } from 'react'
import {
  View,
  Text,
  AlertIOS
} from 'react-native'
import WKWebView from 'react-native-wkwebview-reborn'
import RNFS from 'react-native-fs'
import Phonetic from './lib/Phonetic'

export default class FileView extends Component {
  render () {
    return <WKWebView source={{file: this.props.path, allowingReadAccessToURL: RNFS.DocumentDirectoryPath}} style={{flex: 1, marginTop: 64}}/>
  }

  static async changePhonetic (scene) {
    let current = await Phonetic.get(scene.title)

    AlertIOS.prompt(
      `${scene.title} のふりがなを入力して下さい(平仮名またはアルファベット)`,
      current,
      async text => {
        await Phonetic.save(scene.title, text)
        alert(`保存しました\n${text}`)
      })
  }
}
