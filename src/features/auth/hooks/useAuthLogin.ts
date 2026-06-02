import { useRef, useState } from 'react';
import { TextInput } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { loginThunk, clearError } from '../store/authSlice';
import { isValidEmail, isMinLength } from '../../../utils/validation';

export const useAuthLogin = () => {
  const dispatch = useAppDispatch();
  const { loading, error , user} = useAppSelector(s => s.auth);

  const [emailId, setEmailId]   = useState('');
  const [password, setPassword] = useState('');
  const [touched, setTouched]   = useState({ email: false, password: false });

  const passwordRef = useRef<TextInput>(null);

  const emailError    = touched.email    && !isValidEmail(emailId)      ? 'Enter a valid email address' : undefined;
  const passwordError = touched.password && !isMinLength(password, 6) ? 'Password must be at least 6 characters' : undefined;
  const canSubmit     = isValidEmail(emailId) && isMinLength(password, 6) && !loading;

  const handleEmailChange = (text: string) => {
    setEmailId(text);
    if (error) dispatch(clearError());
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (error) dispatch(clearError());
  };

  const handleBlurEmail    = () => setTouched(t => ({ ...t, email: true }));
  const handleBlurPassword = () => setTouched(t => ({ ...t, password: true }));

  const handleLogin = () => {
    setTouched({ email: true, password: true });
    if (!canSubmit) return;
    dispatch(clearError());
    dispatch(loginThunk({ emailId: emailId.trim(), password }));
  };

  return {
    emailId,
    password,
    loading,
    error,
    user,
    emailError,
    passwordError,
    canSubmit,
    passwordRef,
    handleEmailChange,
    handlePasswordChange,
    handleBlurEmail,
    handleBlurPassword,
    handleLogin,
  };
};
