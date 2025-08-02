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
import { BsSearch } from 'react-icons/bs';

const Home = () => {
    const { data, isLoading, error } = useGetAllPostQuery();
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search'); // Get search from URL
    
    // Fix: define localSearchTerm state to maintain compatibility
    const [localSearchTerm, setLocalSearchTerm] = useState("");
    const [searchedPosts, setSearchedPosts] = useState([]);
    const [followingPosts, setFollowingPosts] = useState([]);
    const [allPost, setAllPosts] = useState([]);
    const [filteredFollowingPosts, setFilteredFollowingPosts] = useState([]);
    const [filteredAllPosts, setFilteredAllPosts] = useState([]);
    const [activeLink, setActiveLink] = useState('explore');
    const { theme } = useSelector((state) => state.theme);
    const [loading, setLoading] = useState(0);
    const { userInfo } = useSelector((state) => state.auth);
    const [getSearchPost, { isLoading: searchLoader }] = useGetSearchPostMutation();
    const { data: followingData, isLoading: followingLoading } = useGetFollowingPostQuery();
    
    const [activePage, setActivePage] = useState(1);
    const [postLength, setPostLength] = useState(0);
    const [showAllPosts, setShowAllPosts] = useState(false);
    
    // Fix: Sync localSearchTerm with URL searchQuery
    useEffect(() => {
        if (searchQuery) {
            setLocalSearchTerm(searchQuery);
        } else {
            setLocalSearchTerm("");
        }
    }, [searchQuery]);

    // Fix: Handle following posts data
    useEffect(() => {
        if (followingData?.followingPost) {
            setFollowingPosts(followingData.followingPost);
            setFilteredFollowingPosts(followingData.followingPost);
        }
    }, [followingData]);

    // Fix: Handle all posts data separately
    useEffect(() => {
        if (data?.allPost) {
            setAllPosts(data.allPost);
            setFilteredAllPosts(data.allPost);
        }
    }, [data]);

    // Filter posts based on URL search parameter
    useEffect(() => {
        if (!searchQuery || searchQuery.trim() === "") {
            // Reset to original posts when search is cleared
            setFilteredAllPosts(allPost);
            setFilteredFollowingPosts(followingPosts);
        } else {
            // Filter posts based on search term from URL
            const searchLower = searchQuery.toLowerCase();
            
            // Filter all posts
            const filteredAll = allPost.filter(post => 
                post.title.toLowerCase().includes(searchLower)
            );
            setFilteredAllPosts(filteredAll);
            
            // Filter following posts
            const filteredFollowing = followingPosts.filter(post => 
                post.title.toLowerCase().includes(searchLower)
            );
            setFilteredFollowingPosts(filteredFollowing);
        }
    }, [searchQuery, allPost, followingPosts]);

    // Loading indicator effect
    useEffect(() => {
        if (isLoading || followingLoading) {
            setLoading(10);
            setTimeout(() => setLoading(50), 300);
            setTimeout(() => setLoading(100), 600);
        }
    }, [isLoading, followingLoading]);

    const fetchMoreFollowing = () => {
    };

    const fetchMorePosts = () => {
    };

    // Handle search input change
    const handleSearchChange = (e) => {
        setLocalSearchTerm(e.target.value);
    };

    // Clear search
    const clearSearch = () => {
        setLocalSearchTerm("");
    };

    useEffect(() => {
        const fetchSearch = async () => {
            try {
                const { data } = await getSearchPost(location.search);
                if (data && data.searchedPost) {
                    setSearchedPosts(data.searchedPost);
                } else {
                    setSearchedPosts([]);
                }
            } catch (err) {
                toast.error('Something went wrong');
            }
        };

        if (searchQuery) {
            fetchSearch();
        } else {
            setSearchedPosts([]);
        }
    }, [searchQuery, getSearchPost, location.search]);

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
                {/* Tab navigation without search bar */}
                {!searchQuery && userInfo && (
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <div className="flex items-center gap-5">
                            <h1
                                className={`text-xl font-semibold cursor-pointer ${
                                    activeLink === 'explore' 
                                    ? theme 
                                        ? 'border-b-2 border-white text-white' 
                                        : 'border-b-2 border-[#1576D8] text-[#1576D8]' 
                                    : theme 
                                        ? 'text-gray-300 hover:text-white' 
                                        : 'text-gray-600 hover:text-[#1576D8]'
                                }`}
                                onClick={() => setActiveLink('explore')}
                            >
                                Explore
                            </h1>
                            <h1
                                className={`text-xl font-semibold cursor-pointer ${
                                    activeLink === 'following' 
                                    ? theme 
                                        ? 'border-b-2 border-white text-white' 
                                        : 'border-b-2 border-[#1576D8] text-[#1576D8]' 
                                    : theme 
                                        ? 'text-gray-300 hover:text-white' 
                                        : 'text-gray-600 hover:text-[#1576D8]'
                                }`}
                                onClick={() => setActiveLink('following')}
                            >
                                Following
                            </h1>
                        </div>
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
                                {!searchLoader && searchedPosts.length === 0 && searchQuery ? (
                                    <h1 className='font-bold text-xl text-center h-[90vh] mt-8'>No Post Found</h1>
                                ) : (
                                    <>
                                        {/* Grid layout for search results */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mx-auto w-full">
                                            {searchedPosts?.map((post) => (
                                                <Link to={`/posts/post/${post._id}`} key={post._id} className="flex justify-center">
                                                    <div className="w-full max-w-[450px]">
                                                        <HomePost post={post} />
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </>
                                )}
                                {activeLink === "following" && !searchQuery ? (
                                    followingLoading ? (
                                        <Loader />
                                    ) : (
                                        <InfiniteScroll
                                            dataLength={filteredFollowingPosts?.length || 0}
                                            next={fetchMoreFollowing}
                                            hasMore={false}
                                            loader={<Loader />}
                                            endMessage={
                                                <div className={`text-center mt-5 ${theme ? "text-slate-400" : "text-black"}`}>
                                                    {filteredFollowingPosts.length > 0 ? 
                                                        localSearchTerm && filteredFollowingPosts.length < followingPosts.length ? 
                                                            "No more matching posts" : "No more posts to show"
                                                        : localSearchTerm ?
                                                            "No posts matching your search" : "Follow more users to see their posts"
                                                    }
                                                </div>
                                            }
                                        >
                                            {/* Grid layout for following posts */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mx-auto w-full">
                                                {filteredFollowingPosts.map((post) => (
                                                    <Link to={`/posts/post/${post._id}`} key={post._id} className="flex justify-center">
                                                        <div className="w-full max-w-[450px]">
                                                            <HomePost post={post} />
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        </InfiniteScroll>
                                    )
                                ) : (!searchQuery && (
                                    <InfiniteScroll
                                        dataLength={filteredAllPosts?.length || 0}
                                        next={fetchMorePosts}
                                        hasMore={false}
                                        loader={<Loader />}
                                        endMessage={
                                            <div className={`text-center mt-5 ${theme ? "text-slate-400" : "text-black"}`}>
                                                {filteredAllPosts.length > 0 ?
                                                    localSearchTerm && filteredAllPosts.length < allPost.length ?
                                                        "No more matching posts" : "No more posts to show"
                                                    : "No posts matching your search"
                                                }
                                            </div>
                                        }
                                    >
                                        {/* Grid layout for all posts */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mx-auto w-full">
                                            {filteredAllPosts.map((post) => (
                                                <Link to={`/posts/post/${post._id}`} key={post._id} className="flex justify-center">
                                                    <div className="w-full max-w-[450px]">
                                                        <HomePost post={post} />
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </InfiniteScroll>
                                ))}
                            </>
                        )}
                        {!userInfo && <h1 className='text-2xl font-bold text-center mt-8'>Login to view posts</h1>}
                    </div>

                    {/* Sidebar */}
                    {!searchQuery && userInfo && (
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
