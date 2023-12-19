import React from 'react';
import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

import axios from '../axios';
import { axiosInstance } from '../axios';

import { getResponseMessage } from '../helpers/response.util';
import { useToast } from '@chakra-ui/react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import PageLoader from '../utils/loader.component';

const LOGIN_URL = '/auth/authenticate';

const AuthContext = createContext({});

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const toast = useToast();
  const { getItem } = useLocalStorage();

  const [authTokens, setAuthTokens] = useState<any>(() =>
    getItem('authTokens') ? JSON.parse(getItem('authTokens') || '') : null,
  );
  const [user, setUser] = useState(() => (getItem('authTokens') ? jwtDecode(getItem('authTokens') || '') : null));
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [isUserLogged, setIsUserLogged] = useState();

  const navigate = useNavigate();

  const getUserData = async () => {
    const response = await axiosInstance.get('users/getUser');
    setUserData(response.data);
  };

  const loginUser = async data => {
    try {
      const response = await axios.post(LOGIN_URL, data);

      await localStorage.setItem('authTokens', JSON.stringify(response.data));
      await setAuthTokens({ ...response.data });
      navigate(0);
      setIsUserLogged(true);
    } catch (err) {
      toast({
        title: getResponseMessage(err),
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    }
  };

  const logoutUser = () => {
    setAuthTokens(null);
    setUser({});
    setUserData(null);
    localStorage.removeItem('authTokens');
    setIsUserLogged(false);
  };

  const contextData = {
    user: user,
    authTokens: authTokens,
    userData: userData,
    setAuthTokens: setAuthTokens,
    setUser: setUser,
    loginUser: loginUser,
    logoutUser: logoutUser,
    getUserData: getUserData,
  };

  useEffect(() => {
    if (authTokens) {
      setUser(jwtDecode(authTokens.access_token));
      getUserData();
    }
    setLoading(false);
  }, [authTokens, loading]);

  useEffect(() => {
    isUserLogged !== undefined && navigate('/');
  }, [isUserLogged]);

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? <PageLoader isLoading={loading} /> : children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
