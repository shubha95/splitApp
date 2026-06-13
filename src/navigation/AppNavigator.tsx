import React from 'react';
import { createDrawerNavigator }    from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { DrawerParamList, BottomTabParamList, HomeStackParamList } from './types';
import HomeScreen          from '../features/home/screens/HomeScreen';
import GroupDetailsScreen  from '../features/groups/screens/GroupDetailsScreen';
import AddMemberScreen     from '../features/groups/screens/AddMemberScreen';
import ContactsScreen      from '../features/contacts/screens/ContactsScreen';
import ProfileScreen       from '../features/profile/screens/ProfileScreen';
import AboutScreen         from '../features/about/screens/AboutScreen';
import CustomDrawerContent from './CustomDrawerContent';

const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const Tab       = createBottomTabNavigator<BottomTabParamList>();
const Drawer    = createDrawerNavigator<DrawerParamList>();

const HomeStackNavigator = () => (
  <HomeStack.Navigator screenOptions={{ headerShown: false }}>
    <HomeStack.Screen name="HomeScreen"         component={HomeScreen} />
    <HomeStack.Screen name="GroupDetailsScreen" component={GroupDetailsScreen} />
    <HomeStack.Screen name="AddMemberScreen"    component={AddMemberScreen} />
  </HomeStack.Navigator>
);

const TabNavigator = () => (
  <Tab.Navigator screenOptions={{ headerShown: false }}>
    <Tab.Screen name="HomeTab"     component={HomeStackNavigator} options={{ title: 'Home' }} />
    <Tab.Screen name="ContactsTab" component={ContactsScreen} options={{ title: 'Contacts' }} />
    <Tab.Screen name="ProfileTab"  component={ProfileScreen}  options={{ title: 'Profile' }} />
  </Tab.Navigator>
);

const AppNavigator = () => (
  <Drawer.Navigator
    drawerContent={props => <CustomDrawerContent {...props} />}
    screenOptions={{
      headerTitle: () => null,
      headerShadowVisible: false,
      headerTransparent: true,
      headerStyle: { backgroundColor: 'transparent', elevation: 0, shadowOpacity: 0 },
      headerLeftContainerStyle: { paddingTop: 0, paddingLeft: 0, margin: 0,paddingBottom: 20 },
    }}
  >
    <Drawer.Screen name="HomeTabs" component={TabNavigator} />
    <Drawer.Screen name="About"    component={AboutScreen} />
    <Drawer.Screen name="Contacts" component={ContactsScreen} />
    <Drawer.Screen name="Profile"  component={ProfileScreen} />
  </Drawer.Navigator>
);

export default AppNavigator;
