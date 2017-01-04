// @flow
import React, { Component } from 'react'
import {
  View,
  ListView,
  Text,
  TouchableHighlight,
  RefreshControl
} from 'react-native'
import SearchBar from 'react-native-search-bar'
import { Actions } from 'react-native-router-flux'
import FileUtils from './lib/FileUtils'

export default class FileList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      refreshing: false,
      ds: new ListView.DataSource({
        rowHasChanged (r1, r2) {
          return r1 !== r2
        },
        sectionHeaderHasChanged (s1, s2) {
          return s1 !== s2
        }
      })
    };
  }

  componentWillMount () {
    this.readDir()
  }

  async readDir () {
    this.setState({refreshing: true})

    this._files = {}
    let files = await FileUtils.readDir()

    files.sort((a, b) => {
      let r1 = a.phonetic || a.name
      let r2 = b.phonetic || b.name
      if (r1 < r2) return -1
      if (r1 > r2) return 1
      return 0
    }).forEach(r => {
      let sectionId = r.phonetic.charAt(0) || '#'
      let list = this._files[sectionId] || []
      list.push(r)
      this._files[sectionId] = list
    })

    this.setDataSource()

    this.setState({refreshing: false})
  }

  render () {
    return (
      <View style={{flex: 1, paddingTop: 20}}>
        <SearchBar
          ref='searchBar'
          placeholder='Search'
          showsCancelButton={true}
          onChangeText={this.setDataSource.bind(this)}
          onCancelButtonPress={() => this.setDataSource()}
        />
        <ListView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.readDir.bind(this)}
            />
          }
          dataSource={this.state.ds}
          enableEmptySections={true}
          renderRow={this.renderRow}
          renderSectionHeader={this.renderSectionHeader}
          renderSeparator={this.renderSeparator}
          initialListSize={this.state.ds.getRowAndSectionCount()}
        />
      </View>
    );
  }

  renderRow (rowData) {
    return (
      <TouchableHighlight onPress={() => {
        Actions.fileView({
          title: rowData.name,
          path: rowData.path
        })
      }} style={{padding: 12}}>
        <Text>{rowData.name}</Text>
      </TouchableHighlight>
    )
  }

  renderSectionHeader (sectionData, sectionID) {
    return (
      <View style={{padding: 4, backgroundColor: '#ccc'}}>
        <Text style={{fontWeight: 'bold'}}>{sectionID}</Text>
      </View>
    )
  }

  renderSeparator (sectionID: number, rowID: number, adjacentRowHighlighted: bool) {
    return (
      <View
        key={`${sectionID}-${rowID}`}
        style={{
          height: adjacentRowHighlighted ? 4 : 1,
          backgroundColor: adjacentRowHighlighted ? '#3B5998' : '#CCCCCC',
        }}
      />
    )
  }

  setDataSource (keyword: String = null) {
    let files = {}

    if (keyword) {
      keyword = keyword.toLowerCase()
      Object.keys(this._files).forEach(sectionID => {
        let list = this._files[sectionID]
          .filter(r => r.name.toLowerCase().startsWith(keyword) || r.phonetic.toLowerCase().startsWith(keyword))

        if (list.length > 0) {
          files[sectionID] = list
        }
      })
    } else {
      files = this._files
    }

    this.setState({
      ds: this.state.ds.cloneWithRowsAndSections(files)
    })
  }
}

