import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux'
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import AllUsersList from '../AllUsers/AllUsersList'
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
      <div className={`flex-1 pt-8 pb-10 ${theme ? "bg-zinc-950 text-white" : "bg-white"}`}>
        {/* Content without the search bar */}
        <div className='mb-10'>
          {isLoading || searchUserLoading ? (
            <div className="flex justify-center py-8">
              <Loader />
            </div>
          ) : (
            <>
              {!search && <AllUsersList users={usersList} />}
              {search && searchedUsers.length > 0 && <AllUsersList users={searchedUsers} />}
              {search && searchedUsers.length === 0 && (
                <h1 className={`font-bold text-xl text-center mt-8 mb-20 ${theme ? "text-white" : "text-black"}`}>No User Found</h1>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FindAllUsers;
