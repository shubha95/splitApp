import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
  type DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logoutThunk } from '../features/auth/store/authSlice';
import { colors }  from '../theme/colors';
import { spacing } from '../theme/spacing';

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const dispatch = useAppDispatch();
  const user    = useAppSelector(s => s.auth.user);
  const loading = useAppSelector(s => s.auth.loading);

  const handleLogout = () => {
    dispatch(logoutThunk());
  };

  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props} contentContainerStyle={styles.scroll}>
        {user && (
          <View style={styles.userSection}>
            <Text style={styles.userName}>{user.userName}</Text>
            <Text style={styles.userEmail}>{user.emailId}</Text>
          </View>
        )}
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      <View style={styles.footer}>
        <DrawerItem
          label={loading ? 'Signing out…' : 'Sign Out'}
          onPress={handleLogout}
          labelStyle={styles.logoutLabel}
          style={styles.logoutItem}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
  },
  userSection: {
    padding:         spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom:    spacing.sm,
  },
  userName: {
    fontSize:   16,
    fontWeight: '600',
    color:      colors.text,
  },
  userEmail: {
    fontSize:   13,
    color:      colors.textSecondary,
    marginTop:  spacing.xs,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingBottom:  spacing.sm,
  },
  logoutLabel: {
    color:      colors.danger,
    fontWeight: '600',
  },
  logoutItem: {
    marginHorizontal: spacing.xs,
  },
});

export default CustomDrawerContent;
