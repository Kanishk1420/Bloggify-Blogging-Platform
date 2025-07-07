import { useState } from 'react';
import PropTypes from 'prop-types';
import avatar from  '../../assets/avatar.jpg'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {useSelector} from 'react-redux'
import { useFollowUserMutation } from '../../api/user';

const AllUsers = ({ user, onFollowSuccess }) => {
    const navigate = useNavigate();
    const [isFollowing, setIsFollowing] = useState(false);
    const [followUser] = useFollowUserMutation();
    const {theme} = useSelector((state) => state.theme)

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

    return (
        <div className='flex items-center justify-between gap-3 mb-5 cursor-pointer '>
            <div className='flex items-center gap-3' onClick={() => navigate(`/profile/${user._id}`)}>
                <img src={user?.profilePhoto?.url ?? avatar} className='w-10 h-10 object-cover rounded-full' alt='' />
                <p className='font-semibold'>{user?.username}</p>
            </div>
            <div>
                {isFollowing ? (
                    <button className='border s px-6 py-1 rounded-3xl border-zinc-800 font-sans ' disabled>
                        Following
                    </button>
                ) : (
                    <button className={`border s px-6 py-1 rounded-3xl border-zinc-800 font-sans ${theme ? "border-white hover:bg-white hover:text-black" : ""}`} onClick={handleFollow}>
                        Follow
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
        profilePhoto: PropTypes.shape({
            url: PropTypes.string
        })
    }).isRequired,
    onFollowSuccess: PropTypes.func.isRequired
};

export default AllUsers;
