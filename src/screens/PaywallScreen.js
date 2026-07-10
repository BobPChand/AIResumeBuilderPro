import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  ActivityIndicator, Alert, Platform, Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  getOfferings,
  purchasePackage,
  restorePurchases,
} from '../services/RevenueCatService';
import { startCheckout } from '../services/ApiService';

const FEATURES = [
  { icon: 'document-text', text: 'Unlimited AI Resumes' },
  { icon: 'mail', text: 'Unlimited Cover Letters' },
  { icon: 'trending-up', text: 'ATS Keyword Optimization' },
  { icon: 'time', text: 'Full Generation History' },
  { icon: 'shield-checkmark', text: 'Bank-level Data Encryption' },
];

export default function PaywallScreen({ navigation }) {
  const [offering, setOffering] = useState(null);
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [selectedWeb, setSelectedWeb] = useState('monthly');
  const [loading, setLoading] = useState(Platform.OS === 'ios');
  const [purchasing, setPurchasing] = useState(false);
  const [restoring, setRestoring] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      loadOfferings();
    }
  }, []);

  const loadOfferings = async () => {
    setLoading(true);
    try {
      const current = await getOfferings();
      if (current) {
        setOffering(current);
        const monthly = current.availablePackages.find(
          p => p.packageType === 'MONTHLY'
        ) || current.availablePackages[0];
        setSelectedPkg(monthly);
      }
    } catch (e) {
      Alert.alert('Error', 'Could not load subscription options. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  // ── iOS: native StoreKit via RevenueCat ──────────────────────────────────────
  const handleIOSPurchase = async () => {
    if (!selectedPkg) return;
    setPurchasing(true);
    try {
      const result = await purchasePackage(selectedPkg);
      if (result.success && result.isActive) {
        Alert.alert(
          'Welcome to Pro!',
          'Your subscription is active. Enjoy unlimited resumes and cover letters!',
          [{ text: 'Get Started', onPress: () => navigation.replace('Home') }]
        );
      }
    } catch (e) {
      Alert.alert('Purchase Failed', e.message || 'Something went wrong. Please try again.');
    } finally {
      setPurchasing(false);
    }
  };

  const handleIOSRestore = async () => {
    setRestoring(true);
    try {
      const result = await restorePurchases();
      if (result.isActive) {
        Alert.alert(
          'Subscription Restored',
          'Your Pro subscription has been restored.',
          [{ text: 'Continue', onPress: () => navigation.replace('Home') }]
        );
      } else {
        Alert.alert('No Active Subscription', 'We could not find an active subscription for this Apple ID.');
      }
    } catch (e) {
      Alert.alert('Restore Failed', e.message || 'Could not restore purchases.');
    } finally {
      setRestoring(false);
    }
  };

  // ── Android / Web: Stripe Checkout ───────────────────────────────────────────
  const handleWebPurchase = async () => {
    setPurchasing(true);
    try {
      const data = await startCheckout({ plan: selectedWeb });
      if (data.url) {
        await Linking.openURL(data.url);
      } else {
        Alert.alert('Error', 'Could not start checkout. Please try again.');
      }
    } catch (e) {
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setPurchasing(false);
    }
  };

  const formatPrice = (pkg) => pkg?.product?.priceString || '';

  // ─────────────────────────────────────────────────────────────────────────────
  // iOS Loading state
  if (Platform.OS === 'ios' && loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1E6FD9" />
          <Text style={styles.loadingText}>Loading plans...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // iOS packages
  const packages = offering?.availablePackages || [];
  const monthlyPkg = packages.find(p => p.packageType === 'MONTHLY');
  const annualPkg = packages.find(p => p.packageType === 'ANNUAL');

  // Web plans (static, Stripe prices)
  const webPlans = [
    { id: 'monthly', label: 'Monthly', price: 'CA$14.99', period: '/month', badge: null },
    { id: 'yearly', label: 'Yearly', price: 'CA$119.99', period: '/year', badge: 'Save 33%' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconBadge}>
            <Ionicons name="sparkles" size={32} color="#fff" />
          </View>
          <Text style={styles.title}>AI Resume Builder</Text>
          <Text style={styles.subtitle}>Pro</Text>
          <Text style={styles.trial}>Start your 7-day FREE trial</Text>
        </View>

        {/* Features */}
        <View style={styles.featuresCard}>
          {FEATURES.map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <View style={styles.featureIcon}>
                <Ionicons name={f.icon} size={18} color="#1E6FD9" />
              </View>
              <Text style={styles.featureText}>{f.text}</Text>
              <Ionicons name="checkmark-circle" size={18} color="#34C759" />
            </View>
          ))}
        </View>

        {/* Plan Selector */}
        <View style={styles.plansRow}>
          {Platform.OS === 'ios' ? (
            <>
              {monthlyPkg && (
                <TouchableOpacity
                  style={[styles.planCard, selectedPkg?.identifier === monthlyPkg.identifier && styles.planCardSelected]}
                  onPress={() => setSelectedPkg(monthlyPkg)}
                >
                  <Text style={[styles.planLabel, selectedPkg?.identifier === monthlyPkg.identifier && styles.planLabelSelected]}>Monthly</Text>
                  <Text style={[styles.planPrice, selectedPkg?.identifier === monthlyPkg.identifier && styles.planPriceSelected]}>{formatPrice(monthlyPkg)}</Text>
                  <Text style={[styles.planPeriod, selectedPkg?.identifier === monthlyPkg.identifier && styles.planPeriodSelected]}>/month</Text>
                </TouchableOpacity>
              )}
              {annualPkg && (
                <TouchableOpacity
                  style={[styles.planCard, selectedPkg?.identifier === annualPkg.identifier && styles.planCardSelected]}
                  onPress={() => setSelectedPkg(annualPkg)}
                >
                  <View style={styles.planBadge}><Text style={styles.planBadgeText}>Save 33%</Text></View>
                  <Text style={[styles.planLabel, selectedPkg?.identifier === annualPkg.identifier && styles.planLabelSelected]}>Yearly</Text>
                  <Text style={[styles.planPrice, selectedPkg?.identifier === annualPkg.identifier && styles.planPriceSelected]}>{formatPrice(annualPkg)}</Text>
                  <Text style={[styles.planPeriod, selectedPkg?.identifier === annualPkg.identifier && styles.planPeriodSelected]}>/year</Text>
                </TouchableOpacity>
              )}
            </>
          ) : (
            webPlans.map(plan => (
              <TouchableOpacity
                key={plan.id}
                style={[styles.planCard, selectedWeb === plan.id && styles.planCardSelected]}
                onPress={() => setSelectedWeb(plan.id)}
              >
                {plan.badge && <View style={styles.planBadge}><Text style={styles.planBadgeText}>{plan.badge}</Text></View>}
                <Text style={[styles.planLabel, selectedWeb === plan.id && styles.planLabelSelected]}>{plan.label}</Text>
                <Text style={[styles.planPrice, selectedWeb === plan.id && styles.planPriceSelected]}>{plan.price}</Text>
                <Text style={[styles.planPeriod, selectedWeb === plan.id && styles.planPeriodSelected]}>{plan.period}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* CTA Button */}
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={Platform.OS === 'ios' ? handleIOSPurchase : handleWebPurchase}
          disabled={purchasing || (Platform.OS === 'ios' && !selectedPkg)}
        >
          {purchasing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.ctaText}>Start Free Trial</Text>
              <Text style={styles.ctaSub}>
                {Platform.OS === 'ios'
                  ? `Then ${formatPrice(selectedPkg)}/month · Cancel anytime`
                  : `Then ${selectedWeb === 'monthly' ? 'CA$14.99/month' : 'CA$119.99/year'} · Cancel anytime`}
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* Restore (iOS only — required by Apple) */}
        {Platform.OS === 'ios' && (
          <TouchableOpacity style={styles.restoreButton} onPress={handleIOSRestore} disabled={restoring}>
            {restoring
              ? <ActivityIndicator size="small" color="#8E8E93" />
              : <Text style={styles.restoreText}>Restore Purchases</Text>}
          </TouchableOpacity>
        )}

        {/* Footer */}
        <Text style={styles.footer}>
          {Platform.OS === 'ios'
            ? 'Payment will be charged to your Apple ID account. Subscription renews automatically unless cancelled at least 24 hours before the end of the current period. Cancel anytime in App Store settings.'
            : 'No charge for 7 days · Secure payment · Cancel anytime'}
        </Text>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F4F8' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 },
  loadingText: { color: '#8E8E93', fontSize: 15 },
  scroll: { padding: 24, paddingBottom: 40 },
  header: { alignItems: 'center', marginBottom: 24 },
  iconBadge: { width: 72, height: 72, borderRadius: 20, backgroundColor: '#1E6FD9', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1C1C1E' },
  subtitle: { fontSize: 18, fontWeight: '700', color: '#1E6FD9' },
  trial: { marginTop: 8, fontSize: 15, color: '#34C759', fontWeight: '600' },
  featuresCard: { backgroundColor: '#fff', borderRadius: 18, padding: 16, marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  featureRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, gap: 12 },
  featureIcon: { width: 34, height: 34, borderRadius: 10, backgroundColor: '#EBF2FF', justifyContent: 'center', alignItems: 'center' },
  featureText: { flex: 1, fontSize: 15, color: '#1C1C1E' },
  plansRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  planCard: { flex: 1, backgroundColor: '#fff', borderRadius: 16, padding: 16, alignItems: 'center', borderWidth: 2, borderColor: 'transparent', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  planCardSelected: { borderColor: '#1E6FD9', backgroundColor: '#EBF2FF' },
  planBadge: { backgroundColor: '#34C759', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, marginBottom: 6 },
  planBadgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  planLabel: { fontSize: 13, color: '#8E8E93', fontWeight: '600' },
  planLabelSelected: { color: '#1E6FD9' },
  planPrice: { fontSize: 22, fontWeight: 'bold', color: '#1C1C1E', marginTop: 4 },
  planPriceSelected: { color: '#1E6FD9' },
  planPeriod: { fontSize: 12, color: '#8E8E93' },
  planPeriodSelected: { color: '#1E6FD9' },
  ctaButton: { backgroundColor: '#1E6FD9', borderRadius: 16, padding: 18, alignItems: 'center', marginBottom: 12, shadowColor: '#1E6FD9', shadowOpacity: 0.3, shadowRadius: 10, elevation: 4 },
  ctaText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  ctaSub: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 4 },
  restoreButton: { alignItems: 'center', paddingVertical: 12, marginBottom: 8 },
  restoreText: { color: '#8E8E93', fontSize: 14, textDecorationLine: 'underline' },
  footer: { textAlign: 'center', fontSize: 11, color: '#8E8E93', lineHeight: 16, marginTop: 8 },
});
