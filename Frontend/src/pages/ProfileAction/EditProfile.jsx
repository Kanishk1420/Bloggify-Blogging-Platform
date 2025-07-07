/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import avatar from '../../assets/avatar.jpg'
import { useGetUserQuery, useUpdateUserMutation } from '../../api/user';
import { setCredentials } from '../../slices/AuthSlice';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

const EditProfile = () => {
    const [file, setFile] = useState(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [bio, setBio] = useState('');
    const [email, setEmail] = useState('');
    const [userId, setUserId] = useState(0);
    const [preview, setPreview] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [loading, setLoading] = useState(0)
    const [updateUser] = useUpdateUserMutation();
    const { userInfo } = useSelector((state) => state.auth);
    const id = useParams().id;
    const img = import.meta.env.VITE_IMG_URL;
    const dispatch = useDispatch();
    const { data, error } = useGetUserQuery(id);
    const { theme } = useSelector((state) => state.theme)

    useEffect(() => {
        if (data && data.user) {
            const user = data.user;
            setUserId(user._id);
            setUsername(user.username);
            setEmail(user.email);
            setPassword(user.password);
            setBio(user.bio);
            setFirstname(user.firstname);
            setLastname(user.lastname);

            if (user.profilePhoto) {
                setPreview(user?.profilePhoto?.url);
            }
        }
    }, [data]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            const imageUrl = URL.createObjectURL(selectedFile);
            setPreview(imageUrl);
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(10);

            // Prepare user data
            let newUserInfo = {
                username: username,
                email: email,
                bio: bio,
                firstname: firstname,
                lastname: lastname,
            };


            if (password) {
                newUserInfo.password = password;
            }


            if (file) {
                const formData = new FormData();
                formData.append('profilePhoto', file);
                const res = await updateUser(formData).unwrap();

                setLoading(50);

                newUserInfo.profilePhoto = {
                    public_id: res?.public_id,
                    url: res?.secure_url
                };
                
            }


            const updatedUserResponse = await updateUser({ user: newUserInfo }).unwrap();
            dispatch(setCredentials(updatedUserResponse));
            setLoading(100);
            console.log(updatedUserResponse);

        } catch (err) {
            console.log(err);
            toast.error(err?.message || 'Failed to update user info');
            setLoading(0);
        }
    };






    return (
        <>
            <Navbar />

            <span
                role="progressbar"
                aria-labelledby="ProgressLabel"
                aria-valuenow={loading}
                className="block rounded-full bg-slate-700 relative overflow-hidden"
                style={{ height: '3px' }}
            >
                <span className="block absolute inset-0 bg-indigo-600" style={{ width: `${loading}%`, transition: 'width 0.3s ease-in-out' }}></span>
            </span>



            <div className={` w-full flex flex-col gap-5 px-3 md:px-16 lg:px-28 md:flex-row ${theme ? " bg-gradient-to-b from-black to-gray-800 via-black text-white" : "bg-white"}`}>
                {/* Sidebar */}
                <aside className="hidden py-4 md:w-1/3 lg:w-1/4 md:block">
                    <div className={`sticky flex flex-col gap-2 p-4 text-sm border-r ${theme ? "border-slate-700" : "border-zinc-100"} top-12`}>
                        <h2 className="pl-[2.8em] mb-4 text-2xl font-semibold">Settings</h2>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="w-full min-h-screen py-1 md:w-2/3 lg:w-3/4 ">
                    <div className="p-2 md:p-4">
                        <div className="w-full px-6 pb-8 mt-8 sm:max-w-xl sm:rounded-lg">
                            <h2 className="pl-6 text-2xl font-bold sm:text-xl">Public Profile</h2>

                            <form onSubmit={handleSubmit}>
                                <div className="grid max-w-2xl mx-auto mt-8">
                                    {/* Profile Picture */}
                                    <div className="flex flex-col space-y-5 sm:flex-row sm:space-y-0">
                                        <img
                                            className="object-cover w-40 h-40 p-1 rounded-full ring-2 ring-zinc-300 dark:ring-zinc-500"
                                            src={preview ? preview : (data?.user?.profilePhoto ? `${img}${data?.user?.profilePhoto}` : avatar)} alt="Profile Avatar"
                                        />
                                        <div className="flex flex-col space-y-5 sm:ml-8">
                                            <label htmlFor="profilePicInput" className="cursor-pointer">
                                                <input
                                                    type="file"
                                                    id="profilePicInput"
                                                    className="hidden"
                                                    onChange={handleFileChange}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => document.getElementById('profilePicInput').click()}
                                                    className="py-3.5 mt-10 px-7 text-base font-medium text-zinc-100 focus:outline-none bg-zinc-900 rounded-lg border border-zinc-200 hover:bg-zinc-800 focus:z-10 focus:ring-4 focus:ring-zinc-200"
                                                >
                                                    Add Profile Picture
                                                </button>
                                            </label>
                                            {/* 
                                                <button
                                                    type="button"
                                                    className="py-3.5 px-7 text-base font-medium text-black focus:outline-none bg-white rounded-lg border border-zinc-200 hover:bg-zinc-100 hover:text-black focus:z-10 focus:ring-4 focus:ring-zinc-200"
                                                    onClick={() => setFile(null)}
                                                >
                                                    Remove Picture
                                                </button> */}
                                        </div>
                                    </div>

                                    {/* Other Form Fields */}
                                    <div className={`items-center mt-8 sm:mt-14 ${theme ? "text-white" : "text-black"} `}>
                                        <div className="flex space-x-6">
                                            <div className="w-1/2">
                                                <label className="block mb-2 text-sm font-medium">First Name</label>
                                                <input
                                                    type="text"
                                                    value={firstname}
                                                    onChange={(e) => setFirstname(e.target.value)}
                                                    className={`border font-semibold  text-sm rounded-lg  block w-full p-2.5 ${theme ? "border-slate-900  bg-black text-white" : "bg-zinc-100 "}`}
                                                    placeholder={data?.user?.firstname}
                                                    required
                                                />
                                            </div>
                                            <div className="w-1/2">
                                                <label className="block mb-2 text-sm font-medium ">Last Name</label>
                                                <input
                                                    type="text"
                                                    value={lastname}
                                                    onChange={(e) => setLastname(e.target.value)}
                                                    className={`border font-semibold  text-sm rounded-lg  block w-full p-2.5 ${theme ? "border-slate-900  bg-black text-white" : "bg-zinc-100 "}`}
                                                    placeholder={data?.user?.lastname}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="mb-2 mt-2 sm:mb-6 text-white">
                                            <label className="block mb-2 text-sm font-medium ">Your Username</label>
                                            <input
                                                type="text"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                className={`border font-semibold  text-sm rounded-lg  block w-full p-2.5 ${theme ? "border-slate-900  bg-black text-white" : "bg-zinc-100 "}`}
                                                placeholder={data?.user?.username}
                                                required
                                            />
                                        </div>

                                        <div className="mb-2 sm:mb-6">
                                            <label className="block mb-2 text-sm font-medium ">Your email</label>
                                            <input
                                                type="email"
                                                onChange={(e) => setEmail(e.target.value)}
                                                className={`border font-semibold  text-sm rounded-lg  block w-full p-2.5 ${theme ? "border-slate-900  bg-black text-white" : "bg-zinc-100 "}`}
                                                value={email}
                                                placeholder={data?.user?.email}
                                                required
                                            />
                                        </div>

                                        <div className="mb-6">
                                            <label htmlFor="message" className="block mb-2 text-sm font-medium ">Bio</label>
                                            <textarea
                                                rows="4"
                                                value={bio}
                                                required
                                                onChange={(e) => setBio(e.target.value)}
                                                className={`border font-semibold  text-sm rounded-lg  block w-full p-2.5 ${theme ? "border-slate-900  bg-black text-white" : "bg-zinc-100 "}`}
                                                placeholder={`${!userInfo?.user?.bio ? 'Write your bio...' : userInfo?.user?.bio}`}
                                            ></textarea>
                                        </div>

                                        <div className="mb-6">
                                            <label htmlFor="message" className="block mb-2 text-sm font-medium ">New Password</label>
                                            <input
                                                id="message"
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className={`border font-semibold  text-sm rounded-lg  block w-full p-2.5 ${theme ? "border-slate-900  bg-black text-white" : "bg-zinc-100 "}`}
                                                placeholder="Password"
                                            ></input>
                                        </div>

                                        <div className="flex justify-end md:justify-center">
                                            <button
                                                type="submit"
                                                className={`text-white bg-zinc-900 hover:bg-zinc-800 focus:ring-4 focus:outline-none focus:ring-zinc-300 font-medium rounded-lg text-sm w-full sm:w-auto px-10 py-2.5 text-center dark:bg-zinc-600 dark:hover:bg-zinc-700 dark:focus:ring-zinc-800`}
                                            >
                                                Save
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>

                        </div>
                    </div>
                </main>
            </div>

            <Footer />
        </>

    );

}

export default EditProfile;
