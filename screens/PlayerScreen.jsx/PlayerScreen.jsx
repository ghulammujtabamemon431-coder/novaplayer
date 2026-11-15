import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Video, ResizeMode } from 'expo-av';

export default function PlayerScreen({ route }) {
  const { video } = route.params;
  const ref = useRef(null);
  const [status, setStatus] = useState({});

  return (
    <View style={styles.container}>
      <Video
        ref={ref}
        source={{ uri: video.url }}
        style={styles.video}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        shouldPlay
        onPlaybackStatusUpdate={setStatus}
      />
      <Text style={styles.title}>{video.title}</Text>
      <TouchableOpacity style={styles.btn} onPress={() => status.isPlaying ? ref.current.pauseAsync() : ref.current.playAsync()}>
        <Text style={styles.btnText}>{status.isPlaying ? '⏸ Pause' : '▶ Play'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', paddingTop: 50 },
  video: { width: '100%', height: 250, backgroundColor: '#000' },
  title: { color: '#fff', fontSize: 22, fontWeight: 'bold', padding: 16 },
  btn: { backgroundColor: '#ff3b30', margin: 16, padding: 14, borderRadius: 12, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
