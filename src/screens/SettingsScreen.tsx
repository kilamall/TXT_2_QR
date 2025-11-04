import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
  Switch,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Ionicons} from '@expo/vector-icons';
import AdBanner from '../components/AdBanner';
import WebAds from '../components/WebAds';
import {usePremium} from '../context/PremiumContext';
import {useAuth} from '../context/AuthContext';

const SettingsScreen = () => {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [autoSaveEnabled, setAutoSaveEnabled] = React.useState(false);
  const {isPremium, purchasePremium, restorePurchases, isLoading} = usePremium();
  const {user, logout} = useAuth();

  const openURL = (url: string) => {
    Linking.openURL(url).catch(err =>
      Alert.alert('Error', 'Failed to open link'),
    );
  };

  const handleRateApp = () => {
    Alert.alert(
      'Rate TXT 2 QR',
      'Would you like to rate us on the App Store?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Rate',
          onPress: () => {
            // Add your app store link here
            Alert.alert('Thanks!', 'Redirecting to App Store...');
          },
        },
      ],
    );
  };

  const handleShareApp = () => {
    Alert.alert('Share', 'Share this app with your friends!');
  };

  const SettingItem = ({
    icon,
    title,
    subtitle,
    onPress,
    showArrow = true,
    rightComponent,
  }: any) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      disabled={!onPress}>
      <View style={styles.settingLeft}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon as any} size={24} color="#007AFF" />
        </View>
        <View style={styles.settingTextContainer}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {rightComponent || (showArrow && (
        <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
      ))}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <View style={styles.appInfoContainer}>
            <Ionicons name="qr-code" size={60} color="#007AFF" />
            <Text style={styles.appName}>TXT 2 QR</Text>
            <Text style={styles.appVersion}>Version 1.0.0</Text>
            {isPremium && (
              <View style={styles.premiumBadge}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={styles.premiumText}>Premium</Text>
              </View>
            )}
            {user && (
              <Text style={styles.userEmail}>
                Signed in as: {user.email}
              </Text>
            )}
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ACCOUNT</Text>
          
          <View style={styles.sectionContent}>
            {user ? (
              <>
                <SettingItem
                  icon="person-circle"
                  title="Account"
                  subtitle={user.email || 'Signed in'}
                  onPress={() => {}}
                  showArrow={false}
                />
                <View style={styles.divider} />
                <SettingItem
                  icon="log-out"
                  title="Sign Out"
                  onPress={logout}
                />
              </>
            ) : (
              <SettingItem
                icon="log-in"
                title="Sign In"
                subtitle="Sync your data across devices"
                onPress={() => {
                  Alert.alert('Coming Soon', 'Sign in feature will be available in the next update!');
                }}
              />
            )}
          </View>
        </View>

        {/* Premium Section */}
        {!isPremium && (
          <View style={styles.section}>
            <View style={styles.premiumCard}>
              <Ionicons name="sparkles" size={40} color="#FFD700" />
              <Text style={styles.premiumCardTitle}>Go Premium!</Text>
              <Text style={styles.premiumCardText}>
                Remove all ads and support development
              </Text>
              <Text style={styles.premiumPrice}>$3.99 one-time</Text>
              <TouchableOpacity 
                style={styles.premiumButton}
                onPress={purchasePremium}
                disabled={isLoading}>
                <Text style={styles.premiumButtonText}>
                  {isLoading ? 'Processing...' : 'Remove Ads Forever'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.restoreButton}
                onPress={restorePurchases}>
                <Text style={styles.restoreButtonText}>Restore Purchase</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PREFERENCES</Text>
          
          <View style={styles.sectionContent}>
            <SettingItem
              icon="notifications"
              title="Notifications"
              subtitle="Get alerts for new features"
              onPress={() => {}}
              showArrow={false}
              rightComponent={
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{false: '#E5E5EA', true: '#007AFF'}}
                />
              }
            />
            
            <View style={styles.divider} />
            
            <SettingItem
              icon="save"
              title="Auto-save to Gallery"
              subtitle="Automatically save generated QR codes"
              onPress={() => {}}
              showArrow={false}
              rightComponent={
                <Switch
                  value={autoSaveEnabled}
                  onValueChange={setAutoSaveEnabled}
                  trackColor={{false: '#E5E5EA', true: '#007AFF'}}
                />
              }
            />
          </View>
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SUPPORT</Text>
          
          <View style={styles.sectionContent}>
            <SettingItem
              icon="star"
              title="Rate App"
              subtitle="Help us improve"
              onPress={handleRateApp}
            />
            
            <View style={styles.divider} />
            
            <SettingItem
              icon="share-social"
              title="Share App"
              subtitle="Tell your friends"
              onPress={handleShareApp}
            />
            
            <View style={styles.divider} />
            
            <SettingItem
              icon="mail"
              title="Contact Us"
              subtitle="Get support"
              onPress={() => openURL('mailto:support@txt2qr.app')}
            />
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ABOUT</Text>
          
          <View style={styles.sectionContent}>
            <SettingItem
              icon="document-text"
              title="Privacy Policy"
              onPress={() => openURL('https://txt2qr.app/privacy')}
            />
            
            <View style={styles.divider} />
            
            <SettingItem
              icon="shield-checkmark"
              title="Terms of Service"
              onPress={() => openURL('https://txt2qr.app/terms')}
            />
            
            <View style={styles.divider} />
            
            <SettingItem
              icon="information-circle"
              title="About"
              subtitle="Learn more about TXT 2 QR"
              onPress={() =>
                Alert.alert(
                  'About TXT 2 QR',
                  'TXT 2 QR is the easiest way to scan text and create QR codes on the go. Use OCR technology to extract text from images and instantly generate QR codes.',
                )
              }
            />
          </View>
        </View>


        {/* Ads - AdSense for web, AdMob for mobile */}
        {!isPremium && (
          Platform.OS === 'web' ? (
            <WebAds style={styles.adBanner} />
          ) : (
            <AdBanner style={styles.adBanner} />
          )
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Made with ❤️ for QR enthusiasts
          </Text>
          <Text style={styles.footerText}>© 2025 TXT 2 QR</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    padding: 20,
    paddingTop: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  sectionContent: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E5EA',
  },
  appInfoContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 30,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E5EA',
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 15,
  },
  appVersion: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 5,
  },
  userEmail: {
    fontSize: 14,
    color: '#007AFF',
    marginTop: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    paddingHorizontal: 20,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  settingSubtitle: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5EA',
    marginLeft: 75,
  },
  adBanner: {
    marginTop: 20,
  },
  footer: {
    alignItems: 'center',
    padding: 30,
    paddingBottom: 40,
  },
  footerText: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 5,
  },
  premiumCard: {
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    backgroundColor: '#007AFF',
    margin: 15,
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  premiumCardTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 15,
  },
  premiumCardText: {
    fontSize: 16,
    color: '#E5F1FF',
    marginTop: 10,
    textAlign: 'center',
  },
  premiumPrice: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFD700',
    marginTop: 20,
  },
  premiumButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  premiumButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  restoreButton: {
    marginTop: 15,
    paddingVertical: 10,
  },
  restoreButtonText: {
    color: '#E5F1FF',
    fontSize: 14,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 10,
  },
  premiumText: {
    marginLeft: 5,
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
  },
  adBanner: {
    marginTop: 20,
  },
});

export default SettingsScreen;

