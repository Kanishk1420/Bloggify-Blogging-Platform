import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import AllUsersList from '../AllUsers/AllUsersList';
import { useGetAllUsersListQuery, useSearchUserQuery } from '../../api/user';
import Loader from '../../components/Loader/Loader';

const FindAllUsers = () => {
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const { search } = useLocation();
  const { data, isLoading: searchUserLoading } = useSearchUserQuery(search);
  const { data: allUsersList, isLoading } = useGetAllUsersListQuery();
  const { theme } = useSelector((state) => state.theme);

  // Keep existing useEffects
  useEffect(() => {
    if (data && data.searchedUser) {
      setSearchedUsers(data.searchedUser);
    } else {
      setSearchedUsers([]);
    }
  }, [data]);

  useEffect(() => {
    if (allUsersList && allUsersList.allUsers) {
      setUsersList(allUsersList.allUsers);
    }
  }, [allUsersList]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Main Content - Improved UI */}
      <div className={`flex-1 ${theme ? "bg-gradient-to-b from-zinc-900 to-black text-white" : "bg-gray-50"}`}>
        <div className="max-w-3xl mx-auto px-4 py-8">
          <header className="mb-8 text-center">
            <h1 className={`text-3xl font-bold mb-2 ${theme ? "text-white" : "text-gray-800"}`}>
              {search ? 'Search Results' : 'Discover People'}
            </h1>
            <p className={`${theme ? "text-gray-300" : "text-gray-600"}`}>
              {search ? 'Users matching your search' : 'Connect with other writers and creators'}
            </p>
          </header>

          {/* Users List with improved loading state */}
          <div className="bg-opacity-70 rounded-xl shadow-sm overflow-hidden mb-10">
            {isLoading || searchUserLoading ? (
              <div className={`flex flex-col items-center justify-center py-16 ${theme ? "bg-zinc-800/50" : "bg-white"}`}>
                <Loader />
                <p className={`mt-4 ${theme ? "text-gray-300" : "text-gray-600"}`}>Loading users...</p>
              </div>
            ) : (
              <div className={`p-6 ${theme ? "bg-zinc-800/50" : "bg-white"}`}>
                {!search && usersList.length > 0 && (
                  <div className="mb-4">
                    <h2 className={`font-semibold ${theme ? "text-gray-200" : "text-gray-700"}`}>
                      {usersList.length} People to Follow
                    </h2>
                  </div>
                )}
                
                {search && searchedUsers.length > 0 && (
                  <div className="mb-4">
                    <h2 className={`font-semibold ${theme ? "text-gray-200" : "text-gray-700"}`}>
                      Found {searchedUsers.length} {searchedUsers.length === 1 ? 'user' : 'users'}
                    </h2>
                  </div>
                )}
                
                {!search && usersList.length > 0 && <AllUsersList users={usersList} />}
                {search && searchedUsers.length > 0 && <AllUsersList users={searchedUsers} />}
                
                {search && searchedUsers.length === 0 && (
                  <div className="text-center py-12">
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

      {/* Footer - Remove black bar by ensuring direct connection to content */}
      <Footer />
    </div>
  );
};

export default FindAllUsers;
