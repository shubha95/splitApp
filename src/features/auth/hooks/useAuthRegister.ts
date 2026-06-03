import { useRef, useState } from 'react';
import { TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import type { AuthStackParamList } from '../../../navigation/types';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { registerThunk, clearError } from '../store/authSlice';
import { isValidEmail, isNonEmpty, isMinLength } from '../../../utils/validation';

type Nav = NativeStackNavigationProp<AuthStackParamList>;

export const useAuthRegister = () => {
  const navigation = useNavigation<Nav>();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(s => s.auth);

  const [userName, setUserName]               = useState('');
  const [emailId, setEmailId]                 = useState('');
  const [password, setPassword]               = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress]                 = useState('');

  const [showPassword, setShowPassword]               = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [touched, setTouched] = useState({
    userName: false, emailId: false, password: false, confirmPassword: false, address: false,
  });

  const emailRef           = useRef<TextInput>(null);
  const passwordRef        = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);
  const addressRef         = useRef<TextInput>(null);

  const userNameError       = touched.userName       && !isMinLength(userName, 2)          ? 'Name must be at least 2 characters'    : undefined;
  const emailError          = touched.emailId        && !isValidEmail(emailId)             ? 'Enter a valid email address'           : undefined;
  const passwordError       = touched.password       && !isMinLength(password, 6)          ? 'Password must be at least 6 characters' : undefined;
  const confirmPasswordError = touched.confirmPassword && password !== confirmPassword      ? 'Passwords do not match'                : undefined;
  const addressError        = touched.address        && !isNonEmpty(address)               ? 'Address is required'                   : undefined;

  const canSubmit =
    isMinLength(userName, 2) &&
    isValidEmail(emailId) &&
    isMinLength(password, 6) &&
    password === confirmPassword &&
    isNonEmpty(address) &&
    !loading;

  const clearApiError = () => { if (error) dispatch(clearError()); };

  const handleUserNameChange       = (t: string) => { setUserName(t);        clearApiError(); };
  const handleEmailChange          = (t: string) => { setEmailId(t);         clearApiError(); };
  const handlePasswordChange       = (t: string) => { setPassword(t);        clearApiError(); };
  const handleConfirmPasswordChange = (t: string) => { setConfirmPassword(t); clearApiError(); };
  const handleAddressChange        = (t: string) => { setAddress(t);         clearApiError(); };

  const handleBlurUserName        = () => setTouched(p => ({ ...p, userName: true }));
  const handleBlurEmail           = () => setTouched(p => ({ ...p, emailId: true }));
  const handleBlurPassword        = () => setTouched(p => ({ ...p, password: true }));
  const handleBlurConfirmPassword = () => setTouched(p => ({ ...p, confirmPassword: true }));
  const handleBlurAddress         = () => setTouched(p => ({ ...p, address: true }));

  const handleRegister = async () => {
    setTouched({ userName: true, emailId: true, password: true, confirmPassword: true, address: true });
    if (!canSubmit) return;
    dispatch(clearError());
    try {
      const result = await dispatch(registerThunk({
        userName: userName.trim(),
        emailId:  emailId.trim(),
        password,
        address:  address.trim(),
      })).unwrap();
      Toast.show({
        type:   'success',
        text1:  result.message,
        visibilityTime: 2000,
        onHide: () => navigation.navigate('Login'),
      });
    } catch {
      // error is already stored in Redux state via rejectWithValue
    }
  };

  return {
    userName, emailId, password, confirmPassword, address,
    showPassword, showConfirmPassword,
    loading, error,
    userNameError, emailError, passwordError, confirmPasswordError, addressError,
    canSubmit,
    emailRef, passwordRef, confirmPasswordRef, addressRef,
    setShowPassword, setShowConfirmPassword,
    handleUserNameChange, handleEmailChange, handlePasswordChange,
    handleConfirmPasswordChange, handleAddressChange,
    handleBlurUserName, handleBlurEmail, handleBlurPassword,
    handleBlurConfirmPassword, handleBlurAddress,
    handleRegister,
  };
};
