import React, { createContext, useContext } from "react";
import { useGetCurrentStudent, useGetAdminMe, useLogoutStudent, useLogoutAdmin } from "@workspace/api-client-react";
import { AuthUser, AuthTutor } from "@workspace/api-client-react/src/generated/api.schemas";

type AuthContextType = {
  user: AuthUser | null;
  admin: AuthTutor | null;
  isLoadingStudent: boolean;
  isLoadingAdmin: boolean;
  logoutStudent: () => void;
  logoutAdmin: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading: isLoadingStudent, refetch: refetchStudent } = useGetCurrentStudent({
    query: { retry: false }
  });
  
  const { data: admin, isLoading: isLoadingAdmin, refetch: refetchAdmin } = useGetAdminMe({
    query: { retry: false }
  });

  const logoutStudentMutation = useLogoutStudent();
  const logoutAdminMutation = useLogoutAdmin();

  const handleLogoutStudent = () => {
    logoutStudentMutation.mutate(undefined, {
      onSuccess: () => refetchStudent()
    });
  };

  const handleLogoutAdmin = () => {
    logoutAdminMutation.mutate(undefined, {
      onSuccess: () => refetchAdmin()
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        admin: admin || null,
        isLoadingStudent,
        isLoadingAdmin,
        logoutStudent: handleLogoutStudent,
        logoutAdmin: handleLogoutAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
