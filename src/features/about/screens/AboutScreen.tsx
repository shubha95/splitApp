import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Screen } from '../../../components/ui';
import { colors } from '../../../theme/colors';
import { APP_NAME } from '../../../config/constants';
import { spacing } from '../../../theme/spacing';

const AboutScreen: React.FC = () => (
  <Screen>
    <Text style={styles.title}>About {APP_NAME}</Text>
    <Text style={styles.body}>
      ExpenseSplit helps you track shared expenses with friends and groups, settle debts easily, and stay on top of who owes what.
    </Text>
  </Screen>
);

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  body:  { fontSize: 15, color: colors.textSecondary, lineHeight: 22 },
});

export default AboutScreen;
