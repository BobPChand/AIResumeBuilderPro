import Purchases, { LOG_LEVEL } from 'react-native-purchases';
import { Platform } from 'react-native';

// ─── Replace with your RevenueCat API keys ────────────────────────────────────
// iOS key: RevenueCat Dashboard → Project → API Keys → iOS (starts with appl_)
// Android key: RevenueCat Dashboard → Project → API Keys → Android
const REVENUECAT_IOS_KEY = 'appl_mQirzUNOkoyePqxgcGTIMavyzzQ';
const REVENUECAT_ANDROID_KEY = 'PASTE_YOUR_ANDROID_PUBLIC_KEY_HERE';

// Must match the entitlement identifier in your RevenueCat dashboard
export const ENTITLEMENT_PRO = 'pro';

/**
 * Call once at app startup in App.js useEffect
 */
export const initializeRevenueCat = async () => {
  try {
    if (__DEV__) {
      Purchases.setLogLevel(LOG_LEVEL.DEBUG);
    }
    const apiKey = Platform.select({
      ios: REVENUECAT_IOS_KEY,
      android: REVENUECAT_ANDROID_KEY,
    });
    await Purchases.configure({ apiKey });
    console.log('RevenueCat initialized for AI Resume Builder Pro');
  } catch (e) {
    console.error('RevenueCat init error:', e);
  }
};

/**
 * Fetch current Offering from RevenueCat.
 * Returns offering object or null.
 */
export const getOfferings = async () => {
  try {
    const offerings = await Purchases.getOfferings();
    if (offerings.current !== null && offerings.current.availablePackages.length > 0) {
      return offerings.current;
    }
    return null;
  } catch (e) {
    console.error('RevenueCat getOfferings error:', e);
    return null;
  }
};

/**
 * Purchase a package. Returns { success, isActive, cancelled }
 */
export const purchasePackage = async (pkg) => {
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    const isActive = customerInfo.entitlements.active[ENTITLEMENT_PRO] !== undefined;
    return { success: true, isActive, cancelled: false };
  } catch (e) {
    if (e.userCancelled) {
      return { success: false, isActive: false, cancelled: true };
    }
    throw e;
  }
};

/**
 * Restore previous purchases. Returns { success, isActive }
 */
export const restorePurchases = async () => {
  try {
    const customerInfo = await Purchases.restorePurchases();
    const isActive = customerInfo.entitlements.active[ENTITLEMENT_PRO] !== undefined;
    return { success: true, isActive };
  } catch (e) {
    throw e;
  }
};

/**
 * Check if user has active Pro entitlement. Returns boolean.
 */
export const checkSubscriptionStatus = async () => {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return customerInfo.entitlements.active[ENTITLEMENT_PRO] !== undefined;
  } catch (e) {
    console.error('RevenueCat checkStatus error:', e);
    return false;
  }
};
