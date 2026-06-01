export const colors = {
  primary:    '#4F46E5',
  primaryDark:'#3730A3',
  secondary:  '#10B981',
  danger:     '#EF4444',
  warning:    '#F59E0B',
  info:       '#3B82F6',

  background: '#F9FAFB',
  surface:    '#FFFFFF',
  border:     '#E5E7EB',

  text:       '#111827',
  textSecondary: '#6B7280',
  textDisabled:  '#9CA3AF',
  textInverse:   '#FFFFFF',

  settled:    '#D1FAE5',
  unsettled:  '#FEE2E2',
} as const;

export type Colors = typeof colors;
