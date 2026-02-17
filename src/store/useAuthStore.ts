import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
    // User authentication
    isAuthenticated: boolean;
    user: any | null;
    token: string | null;

    // Admin authentication
    isAdminAuthenticated: boolean;
    admin: any | null;
    adminToken: string | null;

    // User methods
    login: (userData: any, token: string) => void;
    logout: () => void;
    updateUser: (userData: any) => void;

    // Admin methods
    loginAsAdmin: (adminData: any, token: string) => void;
    logoutAdmin: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            // User state
            isAuthenticated: false,
            user: null,
            token: null,

            // Admin state
            isAdminAuthenticated: false,
            admin: null,
            adminToken: null,

            // User methods
            login: (userData, token) =>
                set({
                    isAuthenticated: true,
                    user: userData,
                    token,
                }),

            logout: () =>
                set({
                    isAuthenticated: false,
                    user: null,
                    token: null,
                }),

            updateUser: (userData) =>
                set((state) => ({
                    user: { ...state.user, ...userData },
                })),

            // Admin methods
            loginAsAdmin: (adminData, token) =>
                set({
                    isAdminAuthenticated: true,
                    admin: adminData,
                    adminToken: token,
                }),

            logoutAdmin: () => {
                localStorage.removeItem('adminToken');
                set({
                    isAdminAuthenticated: false,
                    admin: null,
                    adminToken: null,
                });
            },
        }),
        {
            name: 'auth-storage',
        }
    )
);
