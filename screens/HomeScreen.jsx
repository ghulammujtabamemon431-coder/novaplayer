
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const videos = [
  { id: '1', title: 'Big Buck Bunny', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
  { id: '2', title: 'Elephants Dream', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' },
  { id: '3', title: 'Sintel', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4' },
];

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>NovaPlayer</Text>
      <FlatList
        data={videos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Player', { video: item })}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.play}>▶ Play</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 16, paddingTop: 50 },
  logo: { color: '#fff', fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  card: { backgroundColor: '#1a1a1a', padding: 16, borderRadius: 12, marginBottom: 12 },
  title: { color: '#fff', fontSize: 18 },
  play: { color: '#ff3b30', marginTop: 6, fontWeight: 'bold' },
});
