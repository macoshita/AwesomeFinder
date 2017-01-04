// @flow
import React, { Component } from 'react'
import {
  View,
  Text,
  AlertIOS
} from 'react-native'
import PDFView from 'react-native-pdf-view'
import Phonetic from './lib/Phonetic'

export default class FileView extends Component {
  render () {
    return <PDFView src={this.props.path} style={{flex: 1, marginTop: 64}}/>
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
