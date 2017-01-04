import { NativeModules, AsyncStorage } from 'react-native'

const STORE_NAME = '@PhoneticStore:'

function key (name: String) {
  return STORE_NAME + name
}

export default class Phonetic {
  static async get (name: String) {
    let phonetic = await AsyncStorage.getItem(key(name))

    if (phonetic) {
      return phonetic
    }

    if (/^[a-z]+/i.test(name)) {
      phonetic = name.toUpperCase()
    } else {
      phonetic = await NativeModules.Phonetic.get(name)
    }

    Phonetic.save(name, phonetic)
    return phonetic
  }

  static async save (name: String, phonetic: String) {
    return await AsyncStorage.setItem(key(name), phonetic)
  }
}
