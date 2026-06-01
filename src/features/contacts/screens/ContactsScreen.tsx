import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Screen } from '../../../components/ui';
import { colors } from '../../../theme/colors';

const ContactsScreen: React.FC = () => (
  <Screen>
    <Text style={styles.title}>Contacts</Text>
    <Text style={styles.body}>Your contacts will appear here.</Text>
  </Screen>
);

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '700', color: colors.text, marginBottom: 8 },
  body:  { fontSize: 15, color: colors.textSecondary },
});

export default ContactsScreen;
