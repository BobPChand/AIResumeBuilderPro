import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from 'react-native-vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <View style={styles.iconBadge}>
            <Ionicons name="document-text" size={30} color="#fff" />
          </View>
          <Text style={styles.title}>AI Resume Builder Pro</Text>
          <Text style={styles.subtitle}>Land your next job faster with AI-tailored resumes and cover letters</Text>
        </View>

        <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Resume')}>
          <View style={[styles.actionIcon, { backgroundColor: '#EBF2FF' }]}>
            <Ionicons name="document-text" size={22} color="#1E6FD9" />
          </View>
          <View style={styles.actionText}>
            <Text style={styles.actionTitle}>Build a Resume</Text>
            <Text style={styles.actionDesc}>ATS-optimized, tailored to any job description</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Cover Letter')}>
          <View style={[styles.actionIcon, { backgroundColor: '#FFF3E8' }]}>
            <Ionicons name="mail" size={22} color="#FF9500" />
          </View>
          <View style={styles.actionText}>
            <Text style={styles.actionTitle}>Write a Cover Letter</Text>
            <Text style={styles.actionDesc}>Personalized and compelling in seconds</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Profile')}>
          <View style={[styles.actionIcon, { backgroundColor: '#EAFBF0' }]}>
            <Ionicons name="person" size={22} color="#34C759" />
          </View>
          <View style={styles.actionText}>
            <Text style={styles.actionTitle}>Your Profile</Text>
            <Text style={styles.actionDesc}>Set up once, reuse for every application</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
        </TouchableOpacity>

        <View style={styles.tipCard}>
          <Ionicons name="bulb" size={20} color="#1E6FD9" />
          <Text style={styles.tipText}>Tip: Paste the exact job posting when generating a resume — the AI tailors keywords to beat the ATS filters.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F4F8' },
  scroll: { padding: 20, paddingBottom: 40 },
  header: { alignItems: 'center', marginBottom: 28, marginTop: 10 },
  iconBadge: { width: 64, height: 64, borderRadius: 18, backgroundColor: '#1E6FD9', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1C1C1E', textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#8E8E93', textAlign: 'center', marginTop: 6, paddingHorizontal: 20 },
  actionCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 14, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  actionIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  actionText: { flex: 1 },
  actionTitle: { fontSize: 16, fontWeight: '600', color: '#1C1C1E' },
  actionDesc: { fontSize: 12, color: '#8E8E93', marginTop: 2 },
  tipCard: { flexDirection: 'row', backgroundColor: '#EBF2FF', borderRadius: 14, padding: 16, marginTop: 8, gap: 10 },
  tipText: { flex: 1, fontSize: 13, color: '#1E6FD9', lineHeight: 18 },
});
