import { useContext } from 'react';
import { AuthContext } from '../contexts/auth/jwt';

export const useAuth = () => useContext(AuthContext);
