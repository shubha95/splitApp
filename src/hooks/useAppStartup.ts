import { useEffect, useState } from 'react';
import { useAppDispatch } from '../store/hooks';
import { restoreAuthThunk } from '../features/auth/store/authSlice';

const useAppStartup = () => {
  const dispatch = useAppDispatch();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    dispatch(restoreAuthThunk()).finally(() => setIsReady(true));
  }, [dispatch]);

  return { isReady };
};

export default useAppStartup;
