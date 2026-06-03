import React, { forwardRef, useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

type Props = TextInputProps & {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  rightElement?: React.ReactNode;
};

const Input = forwardRef<TextInput, Props>(
  ({ label, error, containerStyle, style, onFocus, onBlur, rightElement, ...rest }, ref) => {
    const [focused, setFocused] = useState(false);

    return (
      <View style={[styles.wrapper, containerStyle]}>
        {label ? <Text style={styles.label}>{label}</Text> : null}
        <View style={[styles.inputRow, focused && styles.focused, error && styles.errorBorder]}>
          <TextInput
            ref={ref}
            style={[styles.input, !!rightElement && styles.inputWithRight, style]}
            placeholderTextColor={colors.textDisabled}
            onFocus={e => { setFocused(true); onFocus?.(e); }}
            onBlur={e => { setFocused(false); onBlur?.(e); }}
            {...rest}
          />
          {rightElement ? <View style={styles.rightElement}>{rightElement}</View> : null}
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  wrapper: { marginBottom: spacing.md },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  inputRow: {
    flexDirection:   'row',
    alignItems:      'center',
    height:          48,
    borderRadius:    10,
    borderWidth:     1,
    borderColor:     colors.border,
    backgroundColor: colors.surface,
    overflow:        'hidden',
  },
  input: {
    flex:              1,
    paddingHorizontal: spacing.md,
    fontSize:          16,
    color:             colors.text,
  },
  inputWithRight: {
    paddingRight: 0,
  },
  rightElement: {
    paddingHorizontal: spacing.sm,
    justifyContent:    'center',
    alignItems:        'center',
  },
  focused:     { borderColor: colors.primary },
  errorBorder: { borderColor: colors.danger },
  errorText:   { fontSize: 12, color: colors.danger, marginTop: spacing.xs },
});

export default Input;
