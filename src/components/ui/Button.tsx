import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

type Variant = 'primary' | 'secondary' | 'danger' | 'outline';

type Props = {
  title: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

const variantStyles: Record<Variant, { container: ViewStyle; text: TextStyle }> = {
  primary:   { container: { backgroundColor: colors.primary },    text: { color: colors.textInverse } },
  secondary: { container: { backgroundColor: colors.secondary },  text: { color: colors.textInverse } },
  danger:    { container: { backgroundColor: colors.danger },     text: { color: colors.textInverse } },
  outline:   { container: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.primary }, text: { color: colors.primary } },
};

const Button: React.FC<Props> = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const vs = variantStyles[variant];
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[styles.base, vs.container, isDisabled && styles.disabled, style]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}>
      {loading ? (
        <ActivityIndicator color={vs.text.color as string} />
      ) : (
        <Text style={[styles.text, vs.text, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  text: { fontSize: 16, fontWeight: '600' },
  disabled: { opacity: 0.5 },
});

export default Button;
