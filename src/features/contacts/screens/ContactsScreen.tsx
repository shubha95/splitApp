import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Screen } from '../../../components/ui';
import { colors } from '../../../theme/colors';
import { rfs, rvs } from '../../../theme/device';

const ContactsScreen: React.FC = () => (
  <Screen>
    <Text style={styles.title}>Contacts</Text>
    <Text style={styles.body}>Your contacts will appear here.</Text>
  </Screen>
);

const styles = StyleSheet.create({
  title: { fontSize: rfs(22), fontWeight: '700', color: colors.text, marginBottom: rvs(8) },
  body:  { fontSize: rfs(15), color: colors.textSecondary },
});

export default ContactsScreen;
