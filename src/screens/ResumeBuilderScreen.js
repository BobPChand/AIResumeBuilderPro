import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { generateResume } from '../services/ApiService';

export default function ResumeBuilderScreen() {
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const buildProfile = async () => {
    const stored = await AsyncStorage.getItem('resume_profile');
    if (!stored) return null;
    const p = JSON.parse(stored);
    return {
      full_name: p.full_name,
      email: p.email,
      phone: p.phone,
      location: p.location,
      target_job_title: p.target_job_title,
      years_experience: p.years_experience,
      skills: (p.skills || '').split(',').map(s => s.trim()).filter(Boolean),
      work_experience: (p.work_experience_text || '').split('\n').filter(Boolean).map(line => ({ description: line })),
      education: (p.education_text || '').split('\n').filter(Boolean).map(line => ({ degree: line })),
    };
  };

  const handleGenerate = async () => {
    const profile = await buildProfile();
    if (!profile || !profile.full_name) {
      Alert.alert('Set up your profile first', 'Go to the Profile tab and fill in your details before generating a resume.');
      return;
    }
    setLoading(true);
    setResult('');
    try {
      const res = await generateResume({ profile, job_title: jobTitle, job_description: jobDescription });
      if (res.content) {
        setResult(res.content);
        const history = JSON.parse(await AsyncStorage.getItem('resume_history') || '[]');
        history.unshift({ id: Date.now().toString(), type: 'resume', job_title: jobTitle, content: res.content, date: new Date().toISOString() });
        await AsyncStorage.setItem('resume_history', JSON.stringify(history.slice(0, 50)));
      } else {
        Alert.alert('Error', res.error || 'Could not generate resume.');
      }
    } catch (e) {
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyResult = async () => {
    await Clipboard.setStringAsync(result);
    Alert.alert('Copied', 'Resume copied to clipboard.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.header}>Build a Resume</Text>
        <Text style={styles.sub}>Paste the job posting for the best ATS match.</Text>

        <Text style={styles.fieldLabel}>Job Title</Text>
        <TextInput style={styles.input} value={jobTitle} onChangeText={setJobTitle} placeholder="e.g. Senior Product Manager" placeholderTextColor="#B0B0B8" />

        <Text style={styles.fieldLabel}>Job Description (optional but recommended)</Text>
        <TextInput style={[styles.input, styles.inputTall]} value={jobDescription} onChangeText={setJobDescription} multiline placeholder="Paste the full job posting here..." placeholderTextColor="#B0B0B8" />

        <TouchableOpacity style={styles.genBtn} onPress={handleGenerate} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : (
            <>
              <Ionicons name="sparkles" size={18} color="#fff" />
              <Text style={styles.genBtnText}>Generate Resume</Text>
            </>
          )}
        </TouchableOpacity>

        {result ? (
          <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultTitle}>Your Resume</Text>
              <TouchableOpacity onPress={copyResult}>
                <Ionicons name="copy-outline" size={20} color="#1E6FD9" />
              </TouchableOpacity>
            </View>
            <Text style={styles.resultText}>{result}</Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F4F8' },
  scroll: { padding: 20, paddingBottom: 40 },
  header: { fontSize: 22, fontWeight: 'bold', color: '#1C1C1E', marginTop: 10 },
  sub: { fontSize: 13, color: '#8E8E93', marginTop: 4, marginBottom: 20 },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: '#1C1C1E', marginBottom: 6, marginTop: 4 },
  input: { backgroundColor: '#fff', borderRadius: 12, padding: 14, fontSize: 15, color: '#1C1C1E', borderWidth: 1, borderColor: '#E5E5EA', marginBottom: 16 },
  inputTall: { minHeight: 140, textAlignVertical: 'top' },
  genBtn: { flexDirection: 'row', backgroundColor: '#1E6FD9', borderRadius: 14, padding: 16, alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 20 },
  genBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  resultCard: { backgroundColor: '#fff', borderRadius: 16, padding: 18, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  resultHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  resultTitle: { fontSize: 16, fontWeight: '700', color: '#1C1C1E' },
  resultText: { fontSize: 14, color: '#1C1C1E', lineHeight: 22 },
});
