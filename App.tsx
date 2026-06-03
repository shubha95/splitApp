import React from 'react';
import { ActivityIndicator, StatusBar, useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import Toast from 'react-native-toast-message';
import { store } from './src/store';
import RootNavigator  from './src/navigation/RootNavigator';
import ErrorBoundary  from './src/components/ErrorBoundary';
import useAppStartup  from './src/hooks/useAppStartup';
import { colors }     from './src/theme/colors';

const AppContent = () => {
  const isDarkMode  = useColorScheme() === 'dark';
  const { isReady } = useAppStartup();

  if (!isReady) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <RootNavigator />
    </>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <SafeAreaProvider>
          <AppContent />
          <Toast />
        </SafeAreaProvider>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
