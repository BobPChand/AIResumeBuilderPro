import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const [profile, setProfile] = useState({
    full_name: '', email: '', phone: '', location: '',
    target_job_title: '', years_experience: '', skills: '',
    work_experience_text: '', education_text: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem('resume_profile');
      if (stored) setProfile(JSON.parse(stored));
    })();
  }, []);

  const update = (key, val) => setProfile(prev => ({ ...prev, [key]: val }));

  const save = async () => {
    setSaving(true);
    await AsyncStorage.setItem('resume_profile', JSON.stringify(profile));
    setSaving(false);
    Alert.alert('Saved', 'Your profile has been saved and will be used for every resume and cover letter.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.header}>Your Profile</Text>
        <Text style={styles.sub}>Fill this out once — every resume and cover letter will pull from it.</Text>

        <Field label="Full Name" value={profile.full_name} onChangeText={v => update('full_name', v)} />
        <Field label="Email" value={profile.email} onChangeText={v => update('email', v)} keyboardType="email-address" />
        <Field label="Phone" value={profile.phone} onChangeText={v => update('phone', v)} keyboardType="phone-pad" />
        <Field label="Location" value={profile.location} onChangeText={v => update('location', v)} placeholder="City, Province/State" />
        <Field label="Target Job Title" value={profile.target_job_title} onChangeText={v => update('target_job_title', v)} placeholder="e.g. Product Manager" />
        <Field label="Years of Experience" value={profile.years_experience} onChangeText={v => update('years_experience', v)} keyboardType="numeric" />
        <Field label="Skills (comma separated)" value={profile.skills} onChangeText={v => update('skills', v)} multiline placeholder="SEO, Project Management, Python..." />
        <Field label="Work Experience" value={profile.work_experience_text} onChangeText={v => update('work_experience_text', v)} multiline placeholder="Job title, company, dates, key achievements — one per line" tall />
        <Field label="Education" value={profile.education_text} onChangeText={v => update('education_text', v)} multiline placeholder="Degree, school, year" />

        <TouchableOpacity style={styles.saveBtn} onPress={save} disabled={saving}>
          <Ionicons name="checkmark-circle" size={18} color="#fff" />
          <Text style={styles.saveBtnText}>{saving ? 'Saving...' : 'Save Profile'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function Field({ label, tall, ...props }) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput style={[styles.input, tall && styles.inputTall]} placeholderTextColor="#B0B0B8" {...props} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F4F8' },
  scroll: { padding: 20, paddingBottom: 40 },
  header: { fontSize: 22, fontWeight: 'bold', color: '#1C1C1E', marginTop: 10 },
  sub: { fontSize: 13, color: '#8E8E93', marginTop: 4, marginBottom: 20 },
  fieldGroup: { marginBottom: 16 },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: '#1C1C1E', marginBottom: 6 },
  input: { backgroundColor: '#fff', borderRadius: 12, padding: 14, fontSize: 15, color: '#1C1C1E', borderWidth: 1, borderColor: '#E5E5EA' },
  inputTall: { minHeight: 100, textAlignVertical: 'top' },
  saveBtn: { flexDirection: 'row', backgroundColor: '#1E6FD9', borderRadius: 14, padding: 16, alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 8 },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
