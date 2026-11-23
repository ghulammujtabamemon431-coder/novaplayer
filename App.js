import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>NOVA MAX</Text>
      <Text style={styles.sub}>Test Chal Gaya!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  text: { color: '#ff0000', fontSize: 30, fontWeight: 'bold' },
  sub: { color: '#fff', fontSize: 18, marginTop: 10 },
});
