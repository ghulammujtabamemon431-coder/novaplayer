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
  }, []);

  const onSpeechResults = (e) => {
    const text = e.value[0].toLowerCase();
    const found = videos.find(v => v.filename.toLowerCase().includes(text.split(' ').pop()));
    if (found) { setCurrentVideo(found); } else { Alert.alert("Nahi mila", text); }
  };

  const startListening = async () => {
    Alert.alert("Voice Search", "Voice search abhi band hai, is version me sirf list se video chalao.");
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.logo}>NOVA MAX</Text>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => setMode(mode === 'mx' ? 'auto' : 'mx')} style={styles.modeBtn}>
            <Text style={styles.modeTxt}>{mode === 'mx' ? 'Auto Mode' : 'MX Mode'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={startListening} style={styles.micBtn}>
            <Text style={{ color: '#fff' }}>🎤</Text>
          </TouchableOpacity>
        </View>
      </View>

      {currentVideo && <Video source={{ uri: currentVideo.uri }} style={styles.video} useNativeControls shouldPlay resizeMode="contain" />}

      <FlatList data={filtered} keyExtractor={(i) => i.id} renderItem={({ item }) => (
        <TouchableOpacity style={styles.item} onPress={() => setCurrentVideo(item)}>
          <Text style={styles.itemText}>{item.filename}</Text>
        </TouchableOpacity>
      )} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', paddingTop: 40 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 },
  logo: { color: '#ff0000', fontSize: 22, fontWeight: 'bold' },
  modeBtn: { backgroundColor: '#222', padding: 8, borderRadius: 8, marginRight: 8 },
  modeTxt: { color: '#fff' },
  micBtn: { backgroundColor: '#333', padding: 8, borderRadius: 20 },
  video: { width: '100%', height: 220, backgroundColor: '#000' },
  item: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#222' },
  itemText: { color: '#fff' },
});
