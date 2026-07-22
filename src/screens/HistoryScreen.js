import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';

export default function HistoryScreen() {
  const [history, setHistory] = useState([]);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const stored = JSON.parse(await AsyncStorage.getItem('resume_history') || '[]');
        setHistory(stored);
      })();
    }, [])
  );

  const copyItem = async (content) => {
    await Clipboard.setStringAsync(content);
    Alert.alert('Copied', 'Content copied to clipboard.');
  };

  const clearHistory = async () => {
    Alert.alert('Clear History', 'Remove all saved resumes and cover letters?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: async () => {
        await AsyncStorage.removeItem('resume_history');
        setHistory([]);
      }},
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>History</Text>
        {history.length > 0 && (
          <TouchableOpacity onPress={clearHistory}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={history}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="time-outline" size={40} color="#C7C7CC" />
            <Text style={styles.emptyText}>Nothing generated yet. Your resumes and cover letters will show up here.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={[styles.badge, item.type === 'resume' ? styles.badgeResume : styles.badgeCover]}>
                <Text style={styles.badgeText}>{item.type === 'resume' ? 'Resume' : 'Cover Letter'}</Text>
              </View>
              <TouchableOpacity onPress={() => copyItem(item.content)}>
                <Ionicons name="copy-outline" size={18} color="#1E6FD9" />
              </TouchableOpacity>
            </View>
            <Text style={styles.cardTitle}>{item.job_title || 'Untitled'}{item.company_name ? ` · ${item.company_name}` : ''}</Text>
            <Text style={styles.cardPreview} numberOfLines={3}>{item.content}</Text>
            <Text style={styles.cardDate}>{new Date(item.date).toLocaleDateString()}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F4F8' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10 },
  header: { fontSize: 22, fontWeight: 'bold', color: '#1C1C1E' },
  clearText: { color: '#FF3B30', fontSize: 14, fontWeight: '600' },
  list: { padding: 20, paddingTop: 12 },
  empty: { alignItems: 'center', marginTop: 80, paddingHorizontal: 40 },
  emptyText: { color: '#8E8E93', textAlign: 'center', marginTop: 12, fontSize: 14 },
  card: { backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 14, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgeResume: { backgroundColor: '#EBF2FF' },
  badgeCover: { backgroundColor: '#FFF3E8' },
  badgeText: { fontSize: 11, fontWeight: '700', color: '#1C1C1E' },
  cardTitle: { fontSize: 15, fontWeight: '600', color: '#1C1C1E', marginBottom: 4 },
  cardPreview: { fontSize: 13, color: '#8E8E93', lineHeight: 18 },
  cardDate: { fontSize: 11, color: '#C7C7CC', marginTop: 8 },
});
