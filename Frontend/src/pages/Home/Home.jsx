/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar'
import Loader from '../../components/Loader/Loader'
import HomePost from '../../components/HomePost/HomePost'
import { Link, useLocation } from 'react-router-dom';
import { useGetAllPostQuery, useGetFollowingPostQuery, useGetSearchPostMutation } from '../../api/post.js'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import InfiniteScroll from 'react-infinite-scroll-component';
import Footer from '../../components/Footer/Footer';

const Home = () => {
    const { data, isLoading, error } = useGetAllPostQuery();
    const dispatch = useDispatch();
    const { search } = useLocation();
    const [searchedPosts, setSearchedPosts] = useState([]);
    const [followingPosts, setFollowingPosts] = useState([]);
    const [allPost, setAllPosts] = useState([]);
    const [activeLink, setActiveLink] = useState('explore');
    const { theme } = useSelector((state) => state.theme);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(0)
    const { userInfo } = useSelector((state) => state.auth);
    const [getSearchPost, { isLoading: searchLoader }] = useGetSearchPostMutation();
    const { data: followingData, isLoading: followingLoading } = useGetFollowingPostQuery();

    const [activePage, setActivePage] = useState(1);
    const [postLength, setPostLength] = useState(0);
    const [showAllPosts, setShowAllPosts] = useState(false);

    // Fix: Properly handle following posts data
    useEffect(() => {
        if (followingData?.followingPost) {
            console.log("Following posts loaded:", followingData.followingPost.length);
            setFollowingPosts(followingData.followingPost);
        }
    }, [followingData]);

    // Fix: Handle all posts data separately
    useEffect(() => {
        if (data?.allPost) {
            setAllPosts(data.allPost);
        }
    }, [data]);

    // Loading indicator effect
    useEffect(() => {
        if (isLoading || followingLoading) {
            setLoading(10);
            setTimeout(() => setLoading(50), 300);
            setTimeout(() => setLoading(100), 600);
        }
    }, [isLoading, followingLoading]);

    const fetchMoreFollowing = () => {
        // This would be implemented if pagination was supported on the backend
        console.log("Fetching more following posts...");
        // For now, we're just using what we have
    };

    const fetchMorePosts = () => {
        // This would be implemented if pagination was supported on the backend
        console.log("Fetching more posts...");
        // For now, we're just using what we have
    };

    useEffect(() => {
        const fetchSearch = async () => {
            try {
                const { data } = await getSearchPost(search);
                if (data && data.searchedPost) {
                    setSearchedPosts(data.searchedPost);
                } else {
                    setSearchedPosts([]);
                }
            } catch (err) {
                toast.error('Something went wrong');
            }
        };

        if (search) {
            fetchSearch();
        } else {
            setSearchedPosts([]);
        }
    }, [search, getSearchPost]);

    return (
        <>
            <Navbar />
            {(isLoading || followingLoading) && (
                <div>
                    <span
                        role="progressbar"
                        aria-labelledby="ProgressLabel"
                        aria-valuenow={loading}
                        className={`block rounded-full relative overflow-hidden ${theme ? "bg-slate-700" : "bg-red-500"}`}
                        style={{ height: '3px' }}
                    >
                        <span className="block absolute inset-0 bg-indigo-600" style={{ width: `${loading}%`, transition: 'width 0.3s ease-in-out' }}></span>
                    </span>
                </div>
            )}
            <div className={`px-4 md:px-6 lg:px-8 min-h-screen py-8 ${theme ? "bg-gradient-to-b from-black to-gray-900 via-black text-white" : ""}`}>
                {/* Tab navigation */}
                {!search && userInfo && (
                    <div className='flex justify-start items-center gap-5 text-xl font-semibold font-sans mb-6'>
                        <h1
                            className={`text-xl font-semibold cursor-pointer ${activeLink === 'explore' ? 'border-b-2 border-zinc-800 duration-300' : ''}`}
                            onClick={() => setActiveLink('explore')}
                        >
                            Explore
                        </h1>
                        <h1
                            className={`text-xl font-semibold cursor-pointer ${activeLink === 'following' ? 'border-b-2 border-zinc-800 duration-300' : ''}`}
                            onClick={() => setActiveLink('following')}
                        >
                            Following
                        </h1>
                    </div>
                )}

                {/* Main content layout - fixed to have sidebar on the right */}
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Main content area - posts grid on larger screens */}
                    <div className="flex-1 order-2 md:order-1">
                        {error && <h1 className='text-2xl font-bold text-center mt-8'>Something went wrong</h1>}

                        {userInfo && (
                            <>
                                {searchLoader && <Loader />}
                                {!searchLoader && searchedPosts.length === 0 && search ? (
                                    <h1 className='font-bold text-xl text-center h-[90vh] mt-8'>No Post Found</h1>
                                ) : (
                                    <>
                                        {/* Grid layout for search results */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {searchedPosts?.map((post) => (
                                                <Link to={`/posts/post/${post._id}`} key={post._id}>
                                                    <HomePost post={post} />
                                                </Link>
                                            ))}
                                        </div>
                                    </>
                                )}
                                {activeLink === "following" ? (
                                    followingLoading ? (
                                        <Loader />
                                    ) : (
                                        <InfiniteScroll
                                            dataLength={followingPosts?.length || 0}
                                            next={fetchMoreFollowing}
                                            hasMore={false}
                                            loader={<Loader />}
                                            endMessage={
                                                <div className={`text-center mt-5 ${theme ? "text-slate-400" : "text-black"}`}>
                                                    {followingPosts.length > 0 ? "No more posts to show" : "Follow more users to see their posts"}
                                                </div>
                                            }
                                        >
                                            {/* Grid layout for following posts */}
                                            {followingPosts.length === 0 ? (
                                                <div className='text-center mt-10 font-bold text-xl'>No posts from users you follow</div>
                                            ) : (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    {followingPosts.map((post) => (
                                                        <Link to={`/posts/post/${post._id}`} key={post._id}>
                                                            <HomePost post={post} />
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </InfiniteScroll>
                                    )
                                ) : (
                                    <InfiniteScroll
                                        dataLength={allPost?.length || 0}
                                        next={fetchMorePosts}
                                        hasMore={false}
                                        loader={<Loader />}
                                    >
                                        {/* Grid layout for all posts */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {!search && allPost.map((post) => (
                                                <Link to={`/posts/post/${post._id}`} key={post._id}>
                                                    <HomePost post={post} />
                                                </Link>
                                            ))}
                                        </div>
                                    </InfiniteScroll>
                                )}
                            </>
                        )}
                        {!userInfo && <h1 className='text-2xl font-bold text-center mt-8'>Login to view posts</h1>}
                    </div>

                    {/* Sidebar */}
                    {!search && userInfo && (
                        <div className="md:w-80 lg:w-96 order-1 md:order-2 mb-6 md:mb-0">
                            <Sidebar />
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Home;
