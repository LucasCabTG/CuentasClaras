'use client';

import { useAuthContext } from '@/core/context/AuthContext';
import ProfileLockScreen from '@/core/components/ProfileLockScreen';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { user, activeProfile, selectProfile, loading } = useAuthContext();

  if (loading) {
    // Show a global loading spinner or a blank screen while auth state is being determined
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center">
        <p className="text-lg font-semibold">Cargando...</p>
      </div>
    );
  }

  // If a user is logged in but no profile has been selected, show the lock screen.
  if (user && !activeProfile) {
    return <ProfileLockScreen onUnlock={selectProfile} />;
  }

  // If a profile is active, show the main application content.
  if (user && activeProfile) {
    return <>{children}</>;
  }

  // If no user is logged in, children will handle redirection (or show login page).
  // This guard is mainly for post-login profile selection.
  return <>{children}</>;
}
