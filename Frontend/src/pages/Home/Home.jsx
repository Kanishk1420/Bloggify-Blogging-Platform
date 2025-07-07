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
    const { data: followingData } = useGetFollowingPostQuery();

    const [activePage, setActivePage] = useState(1);
    const [postLength, setPostLength] = useState(0);
    const [showAllPosts, setShowAllPosts] = useState(false);

    const fetchMoreFollowing = () => {
        const followingPost = followingData?.followingPost;
        if (followingPost) {
            setActivePage(activePage + 1);
            setFollowingPosts([...followingPosts, ...followingPost]);
            setPostLength(followingPost.length);
        }
    };

    const fetchMorePosts = () => {
        const allPosts = data?.allPost;
        if (allPosts) {
            setActivePage(activePage + 1);
            setAllPosts([...allPost, ...allPosts]);
            setPostLength(allPosts.length);
        }
    };

    useEffect(() => {
        if (followingData) {
            setLoading(10);
            fetchMorePosts();
            setLoading(50);
            fetchMorePosts();
            setLoading(100);
        } else {
            setLoading(10);
            fetchMorePosts();
            setLoading(50);
            fetchMorePosts();
            setLoading(100);
        }
    }, [followingData, data?.allPost]);

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
            {isLoading && (
                <div>
                    <span
                        role="progressbar"
                        aria-labelledby="ProgressLabel"
                        aria-valuenow={loading}
                        className={`block rounded-full  relative overflow-hidden ${theme ? "bg-slate-700" : "bg-red-500"}`}
                        style={{ height: '3px' }}
                    >
                        <span className="block absolute inset-0 bg-indigo-600" style={{ width: `${loading}%`, transition: 'width 0.3s ease-in-out' }}></span>
                    </span>
                </div>
            )}
            <div className={`px-8 min-h-screen py-8 md:px-[200px] min-h-auto ${theme ? " bg-gradient-to-b from-black to-gray-900 via-black text-white" : ""} `}>
                {!search && (
                    <div className='flex justify-center items-center gap-5 text-xl font-semibold font-sans '>
                        <h1 className={`text-xl  font-semibold cursor-pointer ${activeLink === 'explore' ? 'border-b-2 border-zinc-800  duration-300 ' : ''}`} onClick={() => setActiveLink('explore')}>Explore</h1>
                        <h1 className={`text-xl font-semibold cursor-pointer ${activeLink === 'following' ? 'border-b-2 border-zinc-800  duration-300 ' : ''}`} onClick={() => setActiveLink('following')}>Following</h1>
                    </div>
                )}

                {error && <h1 className='text-2xl font-bold text-center mt-8'>Something went wrong</h1>}

                {userInfo && (
                    <>
                        {!search && <Sidebar />}
                        {searchLoader && <Loader />}
                        {!searchLoader && searchedPosts.length === 0 && search ? (
                            <h1 className='font-bold text-xl text-center h-[90vh] mt-8'>No Post Found</h1>
                        ) : (
                            <>

                                {searchedPosts?.map((post) => (
                                    <Link to={`/posts/post/${post._id}`} key={post._id}>
                                        <HomePost post={post} />
                                    </Link>
                                ))}
                            </>
                        )}
                        {activeLink === "following" ? (
                            <InfiniteScroll
                                dataLength={followingPosts?.length || 0}
                                hasMore={followingPosts.length < postLength}
                                next={fetchMoreFollowing}
                                endMessage={
                                    <div className={`text-center mt-5 ${theme ? "text-slate-400" : "text-black"}`}>
                                        Follow more users :)
                                    </div>
                                }
                            >
                                {followingPosts.length === 0 ? <div className='text-center mt-10 font-bold text-xl'>No post found</div> : (
                                    <>
                                        {followingPosts?.map((post) => (
                                            <Link to={`/posts/post/${post._id}`} key={post._id}>
                                                <HomePost post={post} />
                                            </Link>
                                        ))}
                                    </>
                                )}
                            </InfiniteScroll>
                        ) : (
                            <InfiniteScroll
                                dataLength={allPost?.length || 0}
                                hasMore={allPost.length < postLength}
                                next={fetchMorePosts}
                                loader={<Loader />}
                            >
                                {!search && data && data?.allPost.map((post) => (
                                    <Link to={`/posts/post/${post._id}`} key={post._id}>
                                        <HomePost post={post} key={post._id} />
                                    </Link>
                                ))}
                            </InfiniteScroll>
                        )}
                    </>
                )}
                {!userInfo && <h1 className='text-2xl font-bold text-center mt-8'>Login to view posts</h1>}
            </div>
            <Footer />
        </>
    );
};

export default Home;
