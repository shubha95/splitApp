import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { DrawerScreenProps } from '@react-navigation/drawer';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

// ── Stack param lists ─────────────────────────────────────────────────────────

export type AuthStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type RootStackParamList = {
  App: undefined;
};

export type HomeStackParamList = {
  HomeScreen: undefined;
  GroupDetailsScreen: { groupId: string };
  AddMemberScreen:    { groupId: string };
};

export type ContactsStackParamList = {
  ContactsScreen: undefined;
};

export type ProfileStackParamList = {
  ProfileScreen: undefined;
};

export type AboutStackParamList = {
  AboutScreen: undefined;
};

// ── Navigator param lists ─────────────────────────────────────────────────────

export type BottomTabParamList = {
  Dashboard:   undefined;
  Group:       undefined;
  ContactsTab: undefined;
  ExpenseTab:  undefined;
};

export type DrawerParamList = {
  HomeTabs: undefined;
  About:    undefined;
  Contacts: undefined;
  Profile:  undefined;
};

// ── Typed screen props ────────────────────────────────────────────────────────

export type SplashScreenProps        = NativeStackScreenProps<AuthStackParamList, 'Splash'>;
export type LoginScreenProps         = NativeStackScreenProps<AuthStackParamList, 'Login'>;
export type RegisterScreenProps      = NativeStackScreenProps<AuthStackParamList, 'Register'>;
export type ForgotPasswordScreenProps = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

export type HomeScreenProps          = NativeStackScreenProps<HomeStackParamList, 'HomeScreen'>;
export type GroupDetailsScreenProps  = NativeStackScreenProps<HomeStackParamList, 'GroupDetailsScreen'>;
export type AddMemberScreenProps     = NativeStackScreenProps<HomeStackParamList, 'AddMemberScreen'>;
export type DashboardScreenProps    = BottomTabScreenProps<BottomTabParamList, 'Dashboard'>;
export type ExpenseTabScreenProps   = BottomTabScreenProps<BottomTabParamList, 'ExpenseTab'>;
export type ContactsScreenProps     = BottomTabScreenProps<BottomTabParamList, 'ContactsTab'>;
export type ProfileScreenProps      = BottomTabScreenProps<BottomTabParamList, 'ProfileTab'>;

export type AboutScreenProps = DrawerScreenProps<DrawerParamList, 'About'>;
