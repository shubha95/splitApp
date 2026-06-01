import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { SplashScreenProps } from '../../../navigation/types';
import { colors } from '../../../theme/colors';

const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => navigation.replace('Login'), 800);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ExpenseSplit</Text>
      <Text style={styles.subtitle}>Loading…</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  title:     { fontSize: 32, fontWeight: '700', color: colors.primary, marginBottom: 8 },
  subtitle:  { fontSize: 16, color: colors.textSecondary },
});

export default SplashScreen;
