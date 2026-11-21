import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Video } from 'expo-av';
import * as MediaLibrary from 'expo-media-library';


const getAutoCategory = (filename) => {
  const name = filename.toLowerCase();
  if (name.includes('naat') || name.includes('hamd')) return 'Naat';
  if (name.includes('song') || name.includes('music') || name.includes('gana')) return 'Songs';
  if (name.includes('bhajan') || name.includes('aarti')) return 'Bhajan';
  if (name.includes('drama') || name.includes('natak')) return 'Dramas';
  if (name.includes('movie') || name.includes('film')) return 'Movies';
  if (name.includes('quran') || name.includes('tilawat')) return 'Quran';
  return 'Others';
};

export default function App() {
  const [videos, setVideos] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [autoFolders, setAutoFolders] = useState({});
  const [mode, setMode] = useState('mx');
  const [isListening, setIsListening] = useState(false);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') return;
      const media = await MediaLibrary.getAssetsAsync({ mediaType: 'video', first: 500 });
      let folders = {};
      media.assets.forEach(v => {
        const cat = getAutoCategory(v.filename);
        if (!folders[cat]) folders[cat] = [];
        folders[cat].push(v);
      });
      setAutoFolders(folders);
      setVideos(media.assets);
      setFiltered(media.assets);
    })();
    Voice.onSpeechResults = onSpeechResults;
    return () => { Voice.destroy().then(Voice.removeAllListeners); }
  }, []);

  const onSpeechResults = (e) => {
    const text = e.value[0].toLowerCase();
    const found = videos.find(v => v.filename.toLowerCase().includes(text.split(' ').pop()));
    if(found){ setCurrentVideo(found); } else { Alert.alert("Nahi mila", text); }
    setIsListening(false);
  };

  const startListening = async () => {
    try{ setIsListening(true); await Voice.start('ur-PK'); } catch(e){}
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.logo}>NOVA MAX</Text>
        <View style={{flexDirection:'row'}}>
          <TouchableOpacity onPress={()=>setMode(mode==='mx'?'auto':'mx')} style={styles.modeBtn}>
            <Text style={styles.modeText}>{mode === 'mx' ? 'Auto Mode' : 'MX Mode'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={startListening} style={[styles.micBtn, isListening && {backgroundColor:'red'}]}>
            <Text style={{color:'#fff'}}>🎙️</Text>
          </TouchableOpacity>
        </View>
      </View>
      {currentVideo && <Video source={{uri: currentVideo.uri}} style={styles.video} useNativeControls shouldPlay resizeMode="contain" />}
      {mode === 'mx' ? (
        <FlatList data={filtered} keyExtractor={i=>i.id} renderItem={({item})=>(
          <TouchableOpacity style={styles.item} onPress={()=>setCurrentVideo(item)}>
            <Text style={styles.itemText}>{item.filename}</Text>
          </TouchableOpacity>
        )} />
      ) : (
        <FlatList data={Object.keys(autoFolders)} keyExtractor={i=>i} renderItem={({item})=>(
          <View style={styles.folderBox}>
            <Text style={styles.folderTitle}>{item} ({autoFolders[item].length})</Text>
            {autoFolders[item].slice(0,3).map(v=>(
              <TouchableOpacity key={v.id} onPress={()=>setCurrentVideo(v)}><Text style={styles.smallText}>- {v.filename}</Text></TouchableOpacity>
            ))}
          </View>
        )} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1, backgroundColor:'#000', paddingTop:40},
  topBar:{flexDirection:'row', justifyContent:'space-between', padding:15, backgroundColor:'#111'},
  logo:{color:'#00e676', fontSize:20, fontWeight:'bold'},
  micBtn:{backgroundColor:'#333', padding:10, borderRadius:20, marginLeft:10},
  modeBtn:{backgroundColor:'#00e676', padding:8, borderRadius:10},
  modeText:{color:'#000', fontWeight:'bold'},
  video:{width:'100%', height:230, backgroundColor:'#000'},
  item:{padding:15, borderBottomWidth:1, borderColor:'#222'},
  itemText:{color:'#fff'},
  folderBox:{backgroundColor:'#1a1a1a', margin:10, padding:10, borderRadius:10},
  folderTitle:{color:'#00e676', fontSize:16, fontWeight:'bold'},
  smallText:{color:'#ccc', marginTop:4}
});
