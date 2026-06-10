import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { SplashScreenProps } from '../../../navigation/types';
import { colors } from '../../../theme/colors';
import { rfs, rvs } from '../../../theme/device';

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
  title:     { fontSize: rfs(32), fontWeight: '700', color: colors.primary, marginBottom: rvs(8) },
  subtitle:  { fontSize: rfs(16), color: colors.textSecondary },
});

export default SplashScreen;
