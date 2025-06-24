import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: 'male' | 'female' | 'other';
  sosCode?: string;
}

interface Driver {
  id: string;
  name: string;
  rating: number;
  safetyScore: number;
  vehicle: string;
  distance: number;
  price: number;
  eta: number;
  gender: 'male' | 'female';
  profileImage: string;
}

interface Ride {
  id: string;
  pickup: string;
  destination: string;
  driver: Driver;
  status: 'booked' | 'ongoing' | 'completed';
  otp: string;
}

interface AppState {
  user: User | null;
  currentRide: Ride | null;
  theme: 'light' | 'dark';
  isAuthenticated: boolean;
  sosActive: boolean;
  location: { lat: number; lng: number } | null;
}

type AppAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_RIDE'; payload: Ride }
  | { type: 'TOGGLE_THEME' }
  | { type: 'ACTIVATE_SOS' }
  | { type: 'DEACTIVATE_SOS' }
  | { type: 'SET_LOCATION'; payload: { lat: number; lng: number } }
  | { type: 'LOGOUT' };

const initialState: AppState = {
  user: null,
  currentRide: null,
  theme: 'light',
  isAuthenticated: false,
  sosActive: false,
  location: null,
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload, isAuthenticated: true };
    case 'SET_RIDE':
      return { ...state, currentRide: action.payload };
    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };
    case 'ACTIVATE_SOS':
      return { ...state, sosActive: true };
    case 'DEACTIVATE_SOS':
      return { ...state, sosActive: false };
    case 'SET_LOCATION':
      return { ...state, location: action.payload };
    case 'LOGOUT':
      return { ...initialState, theme: state.theme };
    default:
      return state;
  }
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};