```
# 起動中のシミュレータのデバイス ID を調べる↓
$ xcrun simctl get_app_container booted org.reactjs.native.example.AwesomeFinder
/Users/.../Library/Developer/CoreSimulator/Devices/{device_id}/data/Containers/Bundle/Application/CC9F9FAB-7B1A-4523-8F5F-976DC1BE3BCD/AwesomeFinder.app

# {device_id} を上記の値使って埋めて移動
$ cd /Users/macoshita/Library/Developer/CoreSimulator/Devices/{device_id}/data/Containers/Data/Application

# どれが自分の作ったアプリケーションのフォルダか調べる (silver searcher 使ってるけど grep とかでもできると思う)
$ ag --hidden --search-binary AwesomeProject **/.com.apple.mobile_container_manager.metadata.plist
-> Binary file {謎のID}/.com.apple.mobile_container_manager.metadata.plist matches.

# 謎の ID 使って移動
$ cd {謎のID}/Documents
```
