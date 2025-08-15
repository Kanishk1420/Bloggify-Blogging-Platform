/* eslint-disable no-unused-vars */
import { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { DEFAULT_AVATAR, getRandomAvatar } from '../../utils/avatarUtil';
import OptimizedAvatar from '../../components/Avatar/OptimizedAvatar';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { useFollowUserMutation, useUserFollowingListQuery } from '../../api/user';


const Userfollowing = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id: userId } = useParams();
    const scrollContainerRef = useRef(null);

    const [followUser] = useFollowUserMutation();
    const { data, isLoading, isError } = useUserFollowingListQuery(userId);
    const { theme } = useSelector((state) => state.theme);

    useEffect(() => {
        if (isError) {
            toast.error('Failed to fetch user following list.');
        }
    }, [isError]);

    const navigateToProfile = (followerId) => {
        navigate(`/profile/${followerId}`);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-20">
                <Loader2 className={`animate-spin h-10 w-10 ${theme ? "text-white" : "text-gray-800"}`} />
            </div>
        );
    }


    const following = data?.following || [];

    return (
        <div className={`flex flex-col min-h-[200px] max-h-[500px] rounded-xl overflow-hidden ${
            theme ? "bg-zinc-950 border border-zinc-800" : "bg-white border border-blue-100 shadow-sm"
        }`}>
            <h2 className={`text-xl font-bold mb-4 px-4 pt-4 sticky top-0 ${
                theme ? "bg-zinc-950 text-white" : "bg-white text-gray-700"
            } z-10 border-b ${theme ? "border-zinc-800" : "border-blue-50"} pb-3`}>
                Following
                <span className="text-gray-500 text-sm ml-2">({following.length})</span>
            </h2>

            {following.length === 0 ? (
                <div className="flex items-center justify-center h-64 text-gray-500">
                    <p>No users followed by this user</p>
                </div>
            ) : (
                <div
                    ref={scrollContainerRef}
                    className="overflow-y-auto px-4 pb-4 flex-grow scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-transparent scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400"
                >
                    {following.map((followingUser) => (
                        <div
                            className={`flex items-center justify-between gap-3 p-3 mb-2 rounded-lg ${

                                theme
                                    ? "hover:bg-zinc-900 border border-zinc-800/50"
                                    : "hover:bg-blue-50/80 border border-blue-50"
                            } transition-all duration-200 cursor-pointer`}
                            key={followingUser._id}
                            onClick={() => navigateToProfile(followingUser._id)}
                        >
                            <div className="flex items-center gap-3">
                                <OptimizedAvatar
                                    src={followingUser.profilePhoto?.url || getRandomAvatar(followingUser._id)}
                                    className={`w-12 h-12 object-cover rounded-full ${
                                        theme
                                            ? "border border-zinc-700"
                                            : "border-2 border-blue-100"
                                    } shadow-sm`}
                                    alt={`${followingUser.username}'s profile`}
                                    fallbackSrc={DEFAULT_AVATAR}
                                    loading="lazy"
                                />
                                <div>
                                    <p className={`font-semibold ${theme ? "text-white" : "text-gray-800"}`}>
                                        {followingUser.username}
                                    </p>
                                    {followingUser.fullName && (
                                        <p className="text-sm text-gray-500">
                                            {followingUser.fullName}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <button
                                className={`text-sm px-4 py-1.5 rounded-full transition-all ${

                                    theme
                                        ? "bg-zinc-800 hover:bg-zinc-700 text-gray-300"
                                        : "bg-blue-50 hover:bg-blue-100 text-blue-600"
                                } font-medium`}
                                onClick={(e) => {
                                    navigateToProfile(followingUser._id);
                                    e.stopPropagation();
                                }}
                            >
                                View
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Userfollowing;
