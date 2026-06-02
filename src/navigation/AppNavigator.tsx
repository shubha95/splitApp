import React from 'react';
import { createDrawerNavigator }    from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { DrawerParamList, BottomTabParamList } from './types';
import HomeScreen          from '../features/home/screens/HomeScreen';
import ContactsScreen      from '../features/contacts/screens/ContactsScreen';
import ProfileScreen       from '../features/profile/screens/ProfileScreen';
import AboutScreen         from '../features/about/screens/AboutScreen';
import CustomDrawerContent from './CustomDrawerContent';

const Tab    = createBottomTabNavigator<BottomTabParamList>();
const Drawer = createDrawerNavigator<DrawerParamList>();

const TabNavigator = () => (
  <Tab.Navigator screenOptions={{ headerShown: false }}>
    <Tab.Screen name="HomeTab"     component={HomeScreen}     options={{ title: 'Home' }} />
    <Tab.Screen name="ContactsTab" component={ContactsScreen} options={{ title: 'Contacts' }} />
    <Tab.Screen name="ProfileTab"  component={ProfileScreen}  options={{ title: 'Profile' }} />
  </Tab.Navigator>
);

const AppNavigator = () => (
  <Drawer.Navigator drawerContent={props => <CustomDrawerContent {...props} />}>
    <Drawer.Screen name="HomeTabs" component={TabNavigator}   options={{ title: 'Home' }} />
    <Drawer.Screen name="About"    component={AboutScreen} />
    <Drawer.Screen name="Contacts" component={ContactsScreen} />
    <Drawer.Screen name="Profile"  component={ProfileScreen} />
  </Drawer.Navigator>
);

export default AppNavigator;
