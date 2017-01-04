import RNFS from 'react-native-fs'
import Phonetic from './Phonetic'

console.log(RNFS.DocumentDirectoryPath)

export default {
  async readDir () {
    let files = await RNFS.readDir(RNFS.DocumentDirectoryPath)
    let phoneticPromises = files.map(file => {
      let name = file.name.replace(/(\.[a-z0-9]*)?$/i, '')
      return Phonetic.get(name).then(phonetic => {
        return Object.assign({}, file, { name, phonetic })
      })
    })

    return await Promise.all(phoneticPromises)
  }
}
