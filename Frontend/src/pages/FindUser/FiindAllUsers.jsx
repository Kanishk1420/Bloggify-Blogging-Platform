import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Loader2 } from 'lucide-react';
import { skipToken } from '@reduxjs/toolkit/query/react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import AllUsersList from '../AllUsers/AllUsersList';
import { useGetAllUsersListQuery, useSearchUserQuery } from '../../api/user';
import PageTransition from '../../components/PageTransition/PageTransition';

const FindAllUsers = () => {
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const location = useLocation();
  
  // Parse the search query from URL
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search');
  
  // Only fetch search results if there's actually a search query
  const { 
    data, 
    isLoading: searchUserLoading, 
    error, 
    isFetching 
  } = useSearchUserQuery(searchQuery ? location.search : skipToken);
  
  const { data: allUsersList, isLoading } = useGetAllUsersListQuery();
  const { theme } = useSelector((state) => state.theme);
  const [loading, setLoading] = useState(0);

  // Animation effect for loading bar
  useEffect(() => {
    if (isLoading || searchUserLoading) {
      setLoading(10);
      setTimeout(() => setLoading(50), 300);
      setTimeout(() => setLoading(100), 600);
    }
  }, [isLoading, searchUserLoading]);

  // Handle search results and errors with improved logic
  useEffect(() => {
    // Reset during loading
    if (searchUserLoading || isFetching) {
      setNoResults(false);
      return;
    }
    if (searchQuery) {
      if (error) {
        console.log('Search error detected:', error);
        setSearchedUsers([]);
        setNoResults(true);
      }
      // Then check for successful results
      else if (data && data.searchedUser) {
        if (data.searchedUser.length > 0) {
          setSearchedUsers(data.searchedUser);
          setNoResults(false);
        } else {
          setSearchedUsers([]);
          setNoResults(true);
        }
      }
      // Fallback for unexpected state
      else {
        setSearchedUsers([]);
        setNoResults(true);
      }
    }
    // No search active
    else {
      setSearchedUsers([]);
      setNoResults(false);
    }
  }, [data, error, searchQuery, searchUserLoading, isFetching]);

  useEffect(() => {
    if (allUsersList && allUsersList.allUsers) {
      setUsersList(allUsersList.allUsers);
    }
  }, [allUsersList]);

  return (
    <PageTransition type="fadeInUp">
      <div className="flex flex-col min-h-screen">
        <Navbar />
        
        {/* Loading progress bar */}
        {(isLoading || searchUserLoading || isFetching) && (
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
        
        {/* Main Content */}
        <div className={`flex-1 ${theme ? "bg-gradient-to-b from-black to-gray-900 via-black text-white" : "bg-gray-50"}`}>
          <div className="max-w-4xl mx-auto px-4 py-10">
            <header className="mb-8 text-center">
              <h1 className={`text-3xl font-bold mb-3 ${theme ? "text-white" : "text-gray-800"}`}>
                {searchQuery ? 'Search Results' : 'Discover People'}
              </h1>
              <p className={`${theme ? "text-gray-300" : "text-gray-600"}`}>
                {searchQuery ? 'Users matching your search' : 'Connect with other writers and creators'}
              </p>
            </header>

            {/* Users List */}
            <div className={`rounded-xl shadow-lg overflow-hidden mb-10 ${theme ? "shadow-zinc-800/50" : ""}`}>
              {(isLoading || searchUserLoading || isFetching) ? (
                <div className={`flex flex-col items-center justify-center py-16 ${theme ? "bg-zinc-900" : "bg-white"}`}>
                  <Loader2 className={`animate-spin h-10 w-10 ${theme ? "text-white" : "text-gray-800"}`} />
                  <p className={`mt-4 ${theme ? "text-gray-300" : "text-gray-600"}`}>Loading users...</p>
                </div>
              ) : (
                <div className={`p-6 ${theme ? "bg-zinc-900" : "bg-white"}`}>
                  {!searchQuery && usersList.length > 0 && (
                    <div className="mb-6 border-b pb-4 border-dashed border-gray-700/30">
                      <h2 className={`text-xl font-semibold ${theme ? "text-gray-200" : "text-gray-700"}`}>
                        {usersList.length} People to Follow
                      </h2>
                    </div>
                  )}
                  
                  {searchQuery && searchedUsers.length > 0 && (
                    <div className="mb-6 border-b pb-4 border-dashed border-gray-700/30">
                      <h2 className={`text-xl font-semibold ${theme ? "text-gray-200" : "text-gray-700"}`}>
                        Found {searchedUsers.length} {searchedUsers.length === 1 ? 'user' : 'users'}
                      </h2>
                    </div>
                  )}
                  
                  {/* Display users list */}
                  {!searchQuery && usersList.length > 0 && <AllUsersList users={usersList} />}
                  {searchQuery && searchedUsers.length > 0 && <AllUsersList users={searchedUsers} />}
                  
                  {/* Empty state - this is the key section we need to fix */}
                  {searchQuery && noResults && (
                    <div className="text-center py-16">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <h3 className={`text-xl font-bold mb-2 ${theme ? "text-white" : "text-gray-800"}`}>
                        No Users Found
                      </h3>
                      <p className={`${theme ? "text-gray-400" : "text-gray-600"}`}>
                        We couldn&apos;t find any users matching your search.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default FindAllUsers;
