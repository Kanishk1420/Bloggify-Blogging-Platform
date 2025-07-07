/* eslint-disable no-unused-vars */
// Sidebar.js

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useGetAllUsersQuery } from '../../api/user';
import AllUsers from '../User/AllUsers'


const Sidebar = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const [users, setUsers] = useState([]);
    const [showFollowedAllMessage, setShowFollowedAllMessage] = useState(false);

    const id = userInfo?.user?._id;
    const { data } = useGetAllUsersQuery(id);

    const handleFollowSuccess = (userId) => {
        setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
    };

    useEffect(() => {
        setUsers(data?.allUser);
    }, [data]);

    useEffect(() => {
        if (data?.allUser?.length === 0) {
            setShowFollowedAllMessage(true);
            setTimeout(() => {
                setShowFollowedAllMessage(false);
            }, 10000);
        }
    }, [users]);

    return (
        <div className='flex float-end flex-col gap-5 max-sm:hidden max-xl:hidden'>

            {showFollowedAllMessage && (
                <div className='text-start font-semibold text-[19px] animate-pulse duration-300'>
                    You followed all the users
                </div>
            )}

            {users?.length > 0 && (

                <div className='text-start font-semibold text-[19px]'>
                    Who to follow
                </div>

            )}

            <div>
                {/* All Users */}
                {users?.map((user) => (
                    <div key={user._id}>
                        <AllUsers user={user} onFollowSuccess={handleFollowSuccess} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;
