import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { useFollowUserMutation, useUnfollowUserMutation } from '../../api/user';
import { DEFAULT_AVATAR } from '../../utils/avatarUtil';

const AllUsersList = ({ users: initialUsers }) => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const { theme } = useSelector((state) => state.theme);
  const [followUser] = useFollowUserMutation();
  const [unfollowUser] = useUnfollowUserMutation();
  const [processing, setProcessing] = useState(null);
  const [users, setUsers] = useState(initialUsers);
  
  // Update users when initialUsers changes
  useEffect(() => {
    setUsers(initialUsers);
  }, [initialUsers]);

  const handleFollow = async (userId) => {
    try {
      setProcessing(userId);
      await followUser(userId).unwrap();
      
      // Update local state to reflect the follow action
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user._id === userId 
            ? { 
                ...user, 
                followers: [...(user.followers || []), userInfo.user._id] 
              } 
            : user
        )
      );
      
      toast.success('User followed successfully!');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to follow user');
    } finally {
      setProcessing(null);
    }
  };

  const handleUnfollow = async (userId) => {
    try {
      setProcessing(userId);
      await unfollowUser(userId).unwrap();
      
      // Update local state to reflect the unfollow action
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user._id === userId 
            ? { 
                ...user, 
                followers: (user.followers || []).filter(id => id !== userInfo.user._id) 
              } 
            : user
        )
      );
      
      toast.success('User unfollowed successfully!');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to unfollow user');
    } finally {
      setProcessing(null);
    }
  };

  const navigateToProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="space-y-4">
      {users.map((user) => {
        const isFollowing = user.followers?.includes(userInfo?.user?._id);
        const isCurrentUser = user._id === userInfo?.user?._id;
        const isProcessing = processing === user._id;

        return (
          <div
            key={user._id}
            className={`flex items-center justify-between p-4 rounded-xl ${
              theme ? "bg-zinc-800/70 hover:bg-zinc-800" : "bg-white hover:bg-gray-50 border border-gray-100"
            } transition-colors shadow-sm`}
          >
            {/* User Info */}
            <div
              className="flex items-center gap-3 flex-grow cursor-pointer"
              onClick={() => navigateToProfile(user._id)}
            >
              <img
                src={user.profilePhoto?.url || DEFAULT_AVATAR}
                alt={user.username}
                className="w-12 h-12 rounded-full object-cover border border-gray-200 shadow-sm"
              />
              <div className="user-details">
                <p className={`font-bold ${theme ? "text-white" : "text-gray-900"}`}>
                  {user.firstname} {user.lastname}
                </p>
                <p className={`text-sm ${theme ? "text-gray-400" : "text-gray-600"}`}>
                  {user.username.startsWith('@') ? user.username : `@${user.username}`}
                </p>
              </div>
            </div>

            {/* Follow/Unfollow Button */}
            {!isCurrentUser && (
              isFollowing ? (
                <button
                  onClick={() => handleUnfollow(user._id)}
                  disabled={isProcessing}
                  className={`flex items-center gap-2 px-5 py-1.5 rounded-full font-medium text-sm transition-all ${
                    isProcessing
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white"
                  }`}
                >
                  {isProcessing ? (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6" />
                      </svg>
                      <span>Unfollow</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={() => handleFollow(user._id)}
                  disabled={isProcessing}
                  className={`flex items-center gap-2 px-5 py-1.5 rounded-full font-medium text-sm transition-all ${
                    isProcessing
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                  }`}
                >
                  {isProcessing ? (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span>Follow</span>
                    </>
                  )}
                </button>
              )
            )}
          </div>
        );
      })}
    </div>
  )  
};

AllUsersList.propTypes = {
  users: PropTypes.array.isRequired,
};

export default AllUsersList;
