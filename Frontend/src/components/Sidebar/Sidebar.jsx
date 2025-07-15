/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useGetAllUsersQuery } from '../../api/user';
import AllUsers from '../User/AllUsers';

const Sidebar = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const [users, setUsers] = useState([]);
    const [showFollowedAllMessage, setShowFollowedAllMessage] = useState(false);
    const { theme } = useSelector((state) => state.theme);

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

    // If there are no users to show, don't render the sidebar
    if (!users || (users.length === 0 && !showFollowedAllMessage)) {
        return null;
    }

    return (
        <div className={`
            w-full mx-auto max-w-xs md:max-w-sm lg:max-w-md
            px-4 py-3 my-4 md:my-6
            rounded-xl shadow-sm
            ${theme ? 'bg-zinc-900/50 text-white' : 'bg-white text-gray-800 border border-gray-100'}
        `}>
            <div className="mb-3 border-b pb-2 border-gray-700/30">
                <h2 className="font-bold text-lg">
                    {showFollowedAllMessage ? (
                        <span className="animate-pulse duration-300">You followed all users</span>
                    ) : (
                        "Who to follow"
                    )}
                </h2>
            </div>

            <div className="space-y-3 divide-y divide-gray-700/20">
                {/* All Users */}
                {users?.map((user) => (
                    <div key={user._id} className="pt-3 first:pt-0">
                        <AllUsers user={user} onFollowSuccess={handleFollowSuccess} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;
