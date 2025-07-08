import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import avatar from '../../assets/avatar.jpg'
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useFollowUserMutation, useUnfollowUserMutation, useUserFollowerListQuery, useUserFollowingListQuery } from '../../api/user'
import Loader from '../../components/Loader/Loader';

const AllUsersList = ({ users }) => {

  const { userInfo } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const { refetch: refetchFollowing } = useUserFollowerListQuery(userInfo?.user?._id);
  const { data: followingData,isLoading, refetch: refetchFollowers } = useUserFollowingListQuery(userInfo?.user?._id);
  const [followUser] = useFollowUserMutation();
  const [unfollowUser] = useUnfollowUserMutation();
  const [followingUsers, setFollowingUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { theme } = useSelector((state) => state.theme)
  const [loading, setLoading] = useState(0);


  useEffect(() => {
    if (followingData) {
      const followingIds = followingData.following.map(user => user._id);
      setFollowingUsers(followingIds);

    }
  }, [followingData]);

  const handleFollow = async (id) => {
    try {
      setLoading(100)
      const res = await followUser(id).unwrap();
      refetchFollowing();
      refetchFollowers();
      setFollowingUsers(prevState => [...prevState, id]);
      toast.success(res?.message || 'User followed successfully');

    } catch (error) {
      console.error('Error following user:', error);
      toast.error(error?.data?.message || 'Failed to follow user');
    }
    finally {
      setLoading(0)
    }
  };

  const handleUnfollow = async (id) => {
    try {
      setLoading(100)
      const res = await unfollowUser(id).unwrap();
      refetchFollowing();
      refetchFollowers();
      setFollowingUsers(prevState => prevState.filter(userId => userId !== id));
      toast.success(res?.message || 'User unfollowed successfully');
    } catch (error) {
      console.error('Error unfollowing user:', error);
      toast.error('Failed to unfollow user');
    } finally {
      setLoading(0)
    }

  };


  const startIndex = (currentPage - 1) * 10;
  const endIndex = startIndex + 10;

  return (

    <>

      {isLoading && <Loader />}

      {loading > 0 && (
        <div>
          <span
            role="progressbar"
            aria-labelledby="ProgressLabel"
            aria-valuenow={loading}
            className={`block rounded-full bg-slate-700 relative overflow-hidden`}
            style={{ height: '3px' }}
          >
            <span className="block absolute inset-0 bg-indigo-600" style={{ width: `${loading}%`, transition: 'width 0.3s ease-in-out' }}></span>
          </span>
        </div>
      )}


      <div className={`h-auto  ${theme ? "bg-gradient-to-b from-black to-gray-800 via-black text-white " : ""} `}>
        <div className="max-w-sm mx-auto py-10">
          {users?.slice(startIndex, endIndex).map((user) => (
            <div key={user._id} className={`p-3 flex items-center justify-between border-t cursor-pointer duration-300 ${theme ? " hover:bg-slate-800 border-gray-200" : "hover:bg-gray-200 text-black"}`}>
              <div className="flex items-center" onClick={() => navigate(`/profile/${user?._id}`)}>
                <img className="rounded-full h-10 w-10 object-cover" src={user.profilePhoto?.url ?? avatar} alt="John Doe" />
                <div className="ml-2 flex flex-col">
                  <div className={`leading-snug text-sm  font-bold ${theme ? "text-white" : "text-gray-600"}`}>{user.firstname} {user.lastname}</div>
                  <div className={`leading-snug text-xs `}>{user.username}</div>
                </div>
              </div>
              <div>
                {followingUsers.includes(user._id) ? (
                  <button className={`h-8 px-3 text-md font-semibold  border border-zinc-400 rounded-full  ${theme ? " text-white" : "hover:bg-gray-400 hover:text-white text-black"}`} onClick={() => handleUnfollow(user._id)}>Unfollow</button>
                ) : (
                  <button className={`h-8 px-3 text-md font-semibold  border border-zinc-400 rounded-full  ${theme ? " text-white" : "hover:bg-gray-400 hover:text-white text-black"}`} onClick={() => handleFollow(user._id)}>Follow</button>
                )}
              </div>
            </div>
          ))}



          {/* Pagination */}

          {users?.length > 10 && (
            <div className="flex justify-between mt-4 mx-8">
              <button
                onClick={() => setCurrentPage(prevPage => Math.max(prevPage - 1, 1))}
                disabled={currentPage === 1}
                className={`border rounded-md px-5 py-1 font-semibold`}
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prevPage => prevPage + 1)}
                disabled={endIndex >= users.length}
                className={`rounded-md  border px-5 py-1 font-semibold ${theme ? "text-white" : "text-black"}`}
              >
                Next
              </button>
            </div>
          )}

        </div>
      </div>
    </>
  );



};

AllUsersList.propTypes = {
  users: PropTypes.array.isRequired
};

export default AllUsersList;
