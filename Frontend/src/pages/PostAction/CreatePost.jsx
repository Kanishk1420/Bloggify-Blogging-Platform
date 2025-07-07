/* eslint-disable no-unused-vars */
import { useState } from 'react';

import { IoMdCloseCircle } from "react-icons/io";
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {usePostUploadMutation,useUploadFileMutation} from '../../api/post.js'
import { useNavigate } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import Navbar from '../../components/Navbar/Navbar.jsx';
import Footer from '../../components/Footer/Footer.jsx';


const CreatePost = () => {
    const [category, setCategory] = useState('');
    const [categoryList, setCategoryList] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const { userInfo } = useSelector((state) => state.auth);
    const { theme } = useSelector((state) => state.theme)

    const [uploadFile] = useUploadFileMutation();
    const [postUpload] = usePostUploadMutation();
    const navigate = useNavigate();


    //React quill module options 
    const [descriptionError, setDescriptionError] = useState('');

    const modules = {
        toolbar: [
            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
            [{ size: [] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            //  [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],

            [{ 'align': [] }],
            ['clean']
        ],
    }

    const formats = [
        'header', 'font', 'size',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'align'
    ]


    const addCategory = () => {
        setCategoryList([...categoryList, category]);
        setCategory('');
    }

    const deleteCategory = (index) => {
        let updates = [...categoryList];
        updates.splice(index, 1);
        setCategoryList(updates);
    }

    const submitHandler = async (e) => {
        e.preventDefault();

        try {
            if (!description) {
                setDescriptionError('Description is required');
                return;
            }

            if (!file) {
                setDescriptionError('File is required');
                return;
            }


            setLoading(true);
            if (file) {


                const post = {
                    title,
                    description,
                    username: userInfo.user?.username,
                    firstname: userInfo.user?.firstname,
                    lastname: userInfo.user?.lastname,
                    userId: userInfo.user?._id,
                    categories: categoryList,

                };

                const formData = new FormData();
                formData.append('image', file);
                const res = await uploadFile(formData).unwrap();
                post.photo = { url: res?.secure_url, public_id: res.public_id };

              
                const data = await postUpload(post).unwrap();
                navigate("/posts/post/" + data?.newPost?._id);
                toast.success(data?.message);
                setLoading(false);
                setDescriptionError('');
            } else {
                
                const post = {
                    title,
                    description,
                    username: userInfo.user?.username,
                    userId: userInfo.user?._id,
                    category: categoryList
                };

              
                const data = await postUpload(post).unwrap();
                navigate("/posts/post/" + data?.newPost?._id);
                toast.success(data?.message);
                setLoading(false);
                setDescriptionError('');
            }
        } catch (err) {
            toast.error(err?.message || "Something went wrong");
            setLoading(false);
        }
    };

    const handleEditorChange = (content) => {
        setDescription(content);
        setDescriptionError('');

    };

    return (
        <>
            <Navbar />
            <div className={`${theme ? "bg-gradient-to-b from-black to-gray-800 via-black text-white" : ""}`}>
                <div className={`px-6 pt-10 md:px-[200px] ${theme ? "" : ""}`}>
                    <h1 className='font-bold md:text-2xl text-xl mt-8'>Create a post</h1>
                    <form className='w-full flex flex-col space-y-4 md:space-y-8 mt-4' onSubmit={submitHandler}>
                        <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" className={`outline-none px-4 py-2 rounded-md ${theme ? "bg-black text-white ring-1 ring-gray-600 " : "ring-1 ring-black"}`} placeholder='Enter post title...' required />
                        <ReactQuill value={description} onChange={handleEditorChange} className={`${theme ? "bg-black" : "bg-zinc-50 text-black"}w-full  outline-none px-4 py-2 rounded-md`} placeholder="Write description..." />

                        {descriptionError && <p className="text-red-500">{descriptionError}</p>}

                        {file ? (
                            <div className='relative'>
                                <p className='font-semibold text-md'>File Name: {file.name}</p>
                                <img src={URL.createObjectURL(file)} alt="Uploaded File" width={500} className="mt-2 object-cover rounded-lg" />
                                <button
                                    className="absolute top-0 right-0 p-2 text-gray-600 hover:text-gray-800"
                                    onClick={() => setFile(null)}
                                    disabled={loading}
                                >
                                    <IoMdCloseCircle  size={24} color={`${theme ? 'white' : 'black'}`} />
                                </button>
                            </div>
                        ) : (
                            <div className="relative  top-5 bottom-5 border-2 border-dashed border-gray-300 rounded-lg p-8 flex justify-center items-center cursor-pointer">
                                <input type="file" className="absolute inset-0 opacity-0" onChange={(e) => setFile(e.target.files[0])} />
                                <div className="text-center">
                                    <p className="text-gray-500">Drag & Drop or Click to Upload</p>
                                    <p className="text-sm text-gray-500">(Max file size: 10MB)</p>
                                </div>
                            </div>
                        )}

                        {loading && (
                            <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative" role="alert">
                                <span className="block sm:inline">Please wait, post is creating...</span>
                            </div>
                        )}
                        <div className='flex items-center space-x-4 max-sm:pt-10 md:space-x-8 '>
                            <input value={category} onChange={(e) => setCategory(e.target.value)} type="text" name="category" id="category" className={`px-4 py-2 outline-none rounded-md ${theme ? "bg-black text-white ring-1 ring-gray-600 " : "border border-black"}`} placeholder='Enter category...' />
                            <button type="button" onClick={addCategory} className={`bg-black text-white px-4 py-2 font-semibold cursor-pointer rounded-md  `}>
                                Add
                            </button>
                        </div>
                        <div className='flex mt-4'>
                            {categoryList?.map((item, index) => (
                                <div key={index} className={`flex justify-center w-24 items-center mr-4 p-5 space-x-2 py-1 rounded-md  ${theme ? "bg-black" : "bg-gray-300"}`}>
                                    <p>{item}</p>
                                    <p onClick={() => deleteCategory(index)} className='p-1 cursor-pointer' ><IoMdCloseCircle size={18} /></p>
                                </div>
                            ))}
                        </div>

                        <div className='pb-10 flex justify-center items-center'>
                            <button type='submit' className='bg-gray-200 text-black  mx-auto w-full md:w-[30%] py-3 px-4 rounded-md mt-24 '>Create</button>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default CreatePost;
