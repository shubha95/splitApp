import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAppSelector } from '../store/hooks';
import AuthNavigator from './AuthNavigator';
import AppNavigator  from './AppNavigator';

const RootNavigator = () => {
  const isSignedIn = useAppSelector(s => s.auth.isSignedIn);

  return (
    <NavigationContainer>
      {isSignedIn ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default RootNavigator;
