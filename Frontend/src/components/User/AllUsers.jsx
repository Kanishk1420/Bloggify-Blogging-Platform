import { useState } from 'react';
import PropTypes from 'prop-types';
import avatar from '../../assets/avatar.jpg';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useFollowUserMutation } from '../../api/user';

const AllUsers = ({ user, onFollowSuccess }) => {
    const navigate = useNavigate();
    const [isFollowing, setIsFollowing] = useState(false);
    const [followUser] = useFollowUserMutation();
    const { theme } = useSelector((state) => state.theme);

    const handleFollow = async () => {
        try {
            const id = user._id;
            setIsFollowing(true);
            setTimeout(async () => {
                const res = await followUser(id).unwrap();
                toast.success(res?.message || 'User followed successfully');
                onFollowSuccess(id);
            }, 1000);
        } catch (error) {
            console.error('Error following user:', error);
            toast.error(error?.data?.message || 'Failed to follow user');
            setIsFollowing(false);
        }
    };

    const handleUserClick = () => {
        navigate(`/profile/${user._id}`);
    };

    return (
        <div className={`flex items-center justify-between gap-4 p-4 mb-3 rounded-lg transition-all ${
            theme ? 'hover:bg-zinc-700/50' : 'hover:bg-gray-50'
        }`}>
            <div className="flex items-center gap-3 flex-grow cursor-pointer" onClick={handleUserClick}>
                <img 
                    src={user?.profilePhoto?.url ?? avatar} 
                    className="w-12 h-12 object-cover rounded-full ring-2 ring-offset-2 
                    ring-opacity-50 transition-transform hover:scale-105
                    ring-offset-zinc-900 ring-zinc-700"
                    alt={user?.username || 'User'} 
                />
                <div>
                    <p className={`font-semibold ${theme ? 'text-white' : 'text-gray-800'}`}>
                        {user?.firstname} {user?.lastname}
                    </p>
                    <p className={`text-sm ${theme ? 'text-gray-400' : 'text-gray-500'}`}>
                        @{user?.username.replace('@', '')}
                    </p>
                </div>
            </div>
            
            <div>
                {isFollowing ? (
                    <button 
                        className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all ${
                            theme 
                                ? 'bg-gray-700 text-gray-300' 
                                : 'bg-gray-200 text-gray-500'
                        }`} 
                        disabled
                    >
                        <span className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Following
                        </span>
                    </button>
                ) : (
                    <button 
                        className={`h-8 px-3 text-md font-semibold  border border-zinc-400 rounded-full   text-white`} 
                        onClick={handleFollow}
                    >
                        <span className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                            </svg>
                            Follow
                        </span>
                    </button>
                )}
            </div>
        </div>
    );
};

AllUsers.propTypes = {
    user: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired,
        firstname: PropTypes.string,
        lastname: PropTypes.string,
        profilePhoto: PropTypes.shape({
            url: PropTypes.string
        })
    }).isRequired,
    onFollowSuccess: PropTypes.func.isRequired
};

export default AllUsers;
