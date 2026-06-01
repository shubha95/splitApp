import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import type { HomeScreenProps } from '../../../navigation/types';
import { Screen, Button } from '../../../components/ui';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => (
  <Screen>
    <Text style={styles.title}>Home</Text>
    <Text style={styles.body}>Your expense summary will appear here.</Text>
    <View style={styles.gap} />
    <Button title="Go to Profile" variant="outline" onPress={() => navigation.navigate('ProfileTab')} />
  </Screen>
);

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '700', color: colors.text, marginBottom: spacing.xs },
  body:  { fontSize: 15, color: colors.textSecondary },
  gap:   { height: spacing.lg },
});

export default HomeScreen;
