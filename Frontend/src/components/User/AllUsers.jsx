import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useFollowUserMutation } from '../../api/user';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import avatar from '../../assets/avatar.jpg';

const AllUsers = ({ user, onFollowSuccess }) => {
    const { theme } = useSelector((state) => state.theme);
    const [followUser, { isLoading }] = useFollowUserMutation();
    const [isFollowed, setIsFollowed] = useState(false);

    const followHandler = async () => {
        try {
            await followUser(user._id).unwrap();
            setIsFollowed(true);
            toast.success('User followed successfully');
            if (onFollowSuccess) {
                onFollowSuccess(user._id);
            }
        } catch (error) {
            toast.error(error?.data?.message || 'Failed to follow user');
        }
    };

    return (
        <div className="flex items-center justify-between">
            <Link to={`/profile/${user._id}`} className="flex items-center gap-3 flex-grow">
                <div className="relative">
                    <img
                        src={user.profilePhoto?.url || avatar}
                        alt={user.username}
                        className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-sm"
                    />
                </div>
                <div className="flex flex-col">
                    <h3 className={`font-medium truncate max-w-[120px] ${theme ? "text-white" : "text-gray-900"}`}>
                        {user.firstname} {user.lastname}
                    </h3>
                    <p className={`text-xs truncate max-w-[120px] ${theme ? "text-gray-400" : "text-gray-600"}`}>
                        @{user.username}
                    </p>
                </div>
            </Link>

            <button
                disabled={isLoading || isFollowed}
                onClick={followHandler}
                className={`px-4 py-1 text-xs font-medium rounded-full transition-all ${
                    isLoading
                        ? "bg-gray-400 cursor-not-allowed"
                        : isFollowed
                            ? "bg-gray-500 text-white cursor-not-allowed"
                            : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                }`}
            >
                {isLoading ? 'Loading...' : isFollowed ? 'Followed' : 'Follow'}
            </button>
        </div>
    );
};

AllUsers.propTypes = {
    user: PropTypes.object.isRequired,
    onFollowSuccess: PropTypes.func
};

export default AllUsers;
