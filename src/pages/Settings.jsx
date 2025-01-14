/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { FaUser, FaEnvelope, FaSpinner, FaEye, FaEyeSlash, FaLock, FaKey, FaTrash } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import Loader from '../components/Loader';

const PasswordStrengthIndicator = ({ password }) => {
  const getPasswordStrength = (password) => {
    const lengthCheck = password.length >= 8;
    const uppercaseCheck = /[A-Z]/.test(password);
    const lowercaseCheck = /[a-z]/.test(password);
    const numberCheck = /[0-9]/.test(password);
    const specialCharCheck = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const strength = 
      (lengthCheck ? 1 : 0) + 
      (uppercaseCheck ? 1 : 0) + 
      (lowercaseCheck ? 1 : 0) + 
      (numberCheck ? 1 : 0) + 
      (specialCharCheck ? 1 : 0);

    return strength;
  };

  const strength = getPasswordStrength(password);
  const strengthLabels = ['Very Weak', 'Weak', 'Medium', 'Strong', 'Very Strong'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-green-600'];
  const textColors = ['text-red-500', 'text-orange-500', 'text-yellow-500', 'text-green-500', 'text-green-600'];

  return (
    <div className="mt-2">
      <div className="flex space-x-1 h-1.5">
        {[...Array(5)].map((_, index) => (
          <div 
            key={index} 
            className={`flex-1 rounded-full ${
              index < strength 
                ? strengthColors[index] 
                : 'bg-gray-700'
            }`}
          />
        ))}
      </div>
      <p className={`text-sm mt-1 ${textColors[strength - 1] || 'text-gray-400'}`}>
        {strengthLabels[strength - 1] || 'Password Strength'}
      </p>
    </div>
  );
};

const Settings = () => {
  const { 
    user, 
    loading,  
    updateUserProfile, 
    changePassword, 
    sendPasswordResetEmail,
    deleteAccount 
  } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Password Change State
  const [isPasswordChangeOpen, setIsPasswordChangeOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Password Reset State
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  // Account Deletion State
  const [isAccountDeletionOpen, setIsAccountDeletionOpen] = useState(false);
  const [deletionPassword, setDeletionPassword] = useState('');
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  // Add a local loading state for page-specific operations
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/login');
      } else {
        setIsPageLoading(false);
      }
    }
  }, [loading, user, navigate]);

  const defaultAvatar = user 
    ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}` 
    : 'https://api.dicebear.com/7.x/avataaars/svg?seed=default';

  useEffect(() => {
    if (user) {
      setUsername(user.displayName || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const passwordsMatch = useMemo(() => {
    return newPassword === confirmPassword && newPassword !== '';
  }, [newPassword, confirmPassword]);

  const handlePasswordReset = async () => {
    if (!user || !user.email) {
      toast.error('No email associated with this account');
      return;
    }

    try {
      setIsResettingPassword(true);
      await sendPasswordResetEmail(user.email);
      toast.success('Password reset email sent to your email address');
      setIsResettingPassword(false);
    } catch (error) {
      toast.error('Failed to send password reset email');
      setIsResettingPassword(false);
      console.error('Password reset error:', error);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword !== confirmPassword) {
      setPasswordError('Le nuove password non corrispondono');
      return;
    }

    try {
      await changePassword(currentPassword, newPassword);
      setPasswordSuccess('Password modificata con successo');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setIsPasswordChangeOpen(false);
      toast.success('Password aggiornata');
    } catch (err) {
      setPasswordError(err.message || 'Impossibile modificare la password');
      toast.error('Errore nel cambio password');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) return;

    setError('');

    try {
      await updateUserProfile({
        displayName: username
      });

      try {
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, {
          displayName: username,
          email: user.email,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (error) {
        console.error('Error updating Firestore:', error);
        toast.error('Some profile data might not be synchronized');
      }

      setMessage('Profile updated successfully!');
      navigate('/profile');
    } catch (error) {
      setError('Failed to update profile: ' + error.message);
    }
  };

  const handleAccountDeletion = async (e) => {
    e.preventDefault();
    
    // Controllo se l'utente è autenticato con GitHub
    const isGithubUser = user.providerData.some(
      (provider) => provider.providerId === 'github.com'
    );

    if (isGithubUser) {
      toast.error('Non è possibile eliminare account autenticati tramite GitHub');
      return;
    }

    setIsDeletingAccount(true);

    try {
      await deleteAccount(deletionPassword);
      
      // Rimuovi documento utente da Firestore
      try {
        const userRef = doc(db, 'users', user.uid);
        await deleteDoc(userRef);
      } catch (firestoreError) {
        console.error('Error deleting user document:', firestoreError);
      }

      toast.success('Account eliminato con successo');
      navigate('/'); // Reindirizza alla home
    } catch (error) {
      toast.error(error.message || 'Impossibile eliminare l\'account');
      setIsDeletingAccount(false);
    }
  };

  const isGithubUser = user.providerData[0].providerId === 'github.com';

  if (loading || isPageLoading) {
    return <Loader />;
  }

  if (!user) {
    return (
      <div className="text-center bg-gray-800 p-8 rounded-lg">
        <h2 className="text-2xl mb-4">Accesso Richiesto</h2>
        <p className="mb-4">Devi essere autenticato per modificare le impostazioni.</p>
        <button 
          onClick={() => navigate('/login')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          Vai al Login
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Profile Settings</h1>
        
        <div className="space-y-6 mb-8">
          {/* Avatar Section */}
          <div className="flex flex-col items-center space-y-4 mb-6">
            <div className="w-40 h-40 rounded-full overflow-hidden bg-gray-800">
              <img 
                src={user?.photoURL || defaultAvatar} 
                alt={username}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = defaultAvatar
                }}
              />
            </div>
          </div>

          {/* Username Update Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Field */}
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium text-gray-300">
                Username
              </label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            {/* Email Field (Read-only) */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  readOnly
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 cursor-not-allowed"
                />
              </div>
              <p className="text-sm text-gray-500">Email cannot be changed</p>
            </div>

            {/* Change Password Button */}
            {!isGithubUser && (
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => setIsPasswordChangeOpen(!isPasswordChangeOpen)}
                  className="w-full flex items-center justify-center px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all"
                >
                  <FaLock className="mr-2" /> 
                  {isPasswordChangeOpen ? 'Cancel Password Change' : 'Change Password'}
                </button>
              </div>
            )}

            {/* Profile Update Buttons */}
            <div className="mt-6 flex flex-col gap-3">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/profile')}
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </form>

          {/* Account Deletion Button */}
          {!isGithubUser && (
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setIsAccountDeletionOpen(!isAccountDeletionOpen)}
                className="w-full flex items-center justify-center px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition-all"
              >
                <FaTrash className="mr-2" /> 
                {isAccountDeletionOpen ? 'Cancel Account Deletion' : 'Delete Account'}
              </button>
            </div>
          )}

          {/* Password Change Section */}
          {!isGithubUser && isPasswordChangeOpen && (
            <form onSubmit={handlePasswordChange} className="bg-gray-800 p-6 rounded-lg mt-6">
              <h3 className="text-xl font-semibold mb-4 text-white">Change Password</h3>
              <div className="relative">
                <label htmlFor="current-password" className="block text-sm font-medium text-gray-300 mb-2">
                  Current Password
                </label>
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  id="current-password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full pl-4 pr-12 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-10 text-gray-400 hover:text-white"
                >
                  {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <div className="relative">
                <label htmlFor="new-password" className="block text-sm font-medium text-gray-300 mb-2">
                  New Password
                </label>
                <input
                  type={showNewPassword ? "text" : "password"}
                  id="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-4 pr-12 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-10 text-gray-400 hover:text-white"
                >
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                <PasswordStrengthIndicator password={newPassword} />
              </div>

              <div className="relative">
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm New Password
                </label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-4 pr-12 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-10 text-gray-400 hover:text-white"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <div className="flex space-x-4 mt-4">
                <button
                  type="submit"
                  disabled={!passwordsMatch || !newPassword}
                  className={`w-full py-2 rounded-lg transition-all ${
                    passwordsMatch && newPassword
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-gray-700 cursor-not-allowed'
                  }`}
                >
                  Change Password
                </button>
              </div>

              {passwordError && (
                <p className="text-sm text-red-500">{passwordError}</p>
              )}
              {passwordSuccess && (
                <p className="text-sm text-green-500">{passwordSuccess}</p>
              )}

              {/* Password Reset */}
              <div className="mt-4">
                <button
                  type="button"
                  onClick={handlePasswordReset}
                  disabled={isResettingPassword}
                  className="w-full flex items-center justify-center px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 transition-all"
                >
                  {isResettingPassword ? (
                    <FaSpinner className="animate-spin mr-2" />
                  ) : (
                    <>
                      <FaKey className="mr-2" />
                      Forgot Password? Reset via Email
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Account Deletion Section */}
          {!isGithubUser && isAccountDeletionOpen && (
            <div className="bg-gray-800 p-6 rounded-lg mt-2">
              <h3 className="text-xl font-semibold mb-4 text-white text-red-500">Delete Account</h3>
              <form onSubmit={handleAccountDeletion} className="space-y-4">
                <div className="relative">
                  <label htmlFor="deletion-password" className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm Password to Delete Account
                  </label>
                  <input
                    type="password"
                    id="deletion-password"
                    value={deletionPassword}
                    onChange={(e) => setDeletionPassword(e.target.value)}
                    className="w-full pl-4 pr-12 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white"
                    placeholder="Enter your password"
                  />
                </div>
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={!deletionPassword || isDeletingAccount}
                    className={`w-full py-2 rounded-lg transition-all ${
                      deletionPassword && !isDeletingAccount
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-gray-700 cursor-not-allowed'
                    }`}
                  >
                    {isDeletingAccount ? (
                      <FaSpinner className="animate-spin mx-auto" />
                    ) : (
                      'Permanently Delete Account'
                    )}
                  </button>
                </div>
                <p className="text-sm text-red-500 mt-2">
                  Warning: This action cannot be undone. All your data will be permanently deleted.
                </p>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
