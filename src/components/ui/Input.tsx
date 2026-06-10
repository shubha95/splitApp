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
import { rfs, rms, rSpacing } from '../../theme/device';

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
            placeholderTextColor={colors.textSecondary}
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
  wrapper: { marginBottom: rSpacing.md },
  label: {
    fontSize: rfs(14),
    fontWeight: '500',
    color: colors.text,
    marginBottom: rSpacing.xs,
  },
  inputRow: {
    flexDirection:   'row',
    alignItems:      'center',
    height:          rms(48, 0.3),
    borderRadius:    rms(10),
    borderWidth:     1,
    borderColor:     colors.border,
    backgroundColor: colors.surface,
    overflow:        'hidden',
  },
  input: {
    flex:              1,
    paddingHorizontal: rSpacing.md,
    fontSize:          rfs(16),
    color:             colors.text,
  },
  inputWithRight: {
    paddingRight: 0,
  },
  rightElement: {
    paddingHorizontal: rSpacing.sm,
    justifyContent:    'center',
    alignItems:        'center',
  },
  focused:     { borderColor: colors.primary },
  errorBorder: { borderColor: colors.danger },
  errorText:   { fontSize: rfs(12), color: colors.danger, marginTop: rSpacing.xs },
});

export default Input;
