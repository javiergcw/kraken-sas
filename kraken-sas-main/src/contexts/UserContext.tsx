'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { userController } from '@/components/core';
import { UserDataDto } from '@/components/core/user/dto/UserResponse.dto';

interface UserContextType {
  user: UserDataDto | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserDataDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFetched, setIsFetched] = useState<boolean>(false);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await userController.getMe();
      if (response && response.success) {
        setUser(response.data);
        setIsFetched(true);
      }
    } catch (error) {
      console.error('Error al obtener información del usuario:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    await fetchUser();
  };

  useEffect(() => {
    // Solo hacer fetch una vez al montar el provider
    if (!isFetched) {
      fetchUser();
    }
  }, [isFetched]);

  return (
    <UserContext.Provider value={{ user, loading, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

