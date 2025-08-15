 
import { useState, useEffect } from 'react';
import { IoMdCloseCircle } from "react-icons/io";
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {usePostUploadMutation, useUploadFileMutation} from '../../api/post.js'
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
    const { theme } = useSelector((state) => state.theme);

    const [uploadFile] = useUploadFileMutation();
    const [postUpload] = usePostUploadMutation();
    const navigate = useNavigate();

    const [descriptionError, setDescriptionError] = useState('');

    // Add custom CSS for the editor based on theme
    useEffect(() => {
        const style = document.createElement('style');
        if (theme) {
            // Dark theme styles
            style.innerHTML = `
                .ql-toolbar.ql-snow {
                    background: #1a1a1a !important;
                    border-color: #333 !important;
                    border-top-left-radius: 8px;
                    border-top-right-radius: 8px;
                }
                .ql-container.ql-snow {
                    background: #111 !important;
                    border-color: #333 !important;
                    color: white !important;
                    border-bottom-left-radius: 8px;
                    border-bottom-right-radius: 8px;
                    min-height: 200px;
                }
                .ql-editor.ql-blank::before {
                    color: #666 !important;
                }
                .ql-picker, .ql-picker-label {
                    color: #ccc !important;
                }
                .ql-picker-options {
                    background-color: #222 !important;
                    color: #ccc !important;
                }
                .ql-snow .ql-stroke {
                    stroke: #ccc !important;
                }
                .ql-snow .ql-fill {
                    fill: #ccc !important;
                }
                .ql-snow .ql-picker.ql-expanded .ql-picker-options {
                    border-color: #444 !important;
                }
                .ql-snow.ql-toolbar button:hover, 
                .ql-snow .ql-toolbar button:hover,
                .ql-snow.ql-toolbar button.ql-active, 
                .ql-snow .ql-toolbar button.ql-active {
                    background-color: #333 !important;
                }
                /* Code block styling */
                .ql-editor pre.ql-syntax {
                    background-color: #2d2d2d !important;
                    color: #f8f8f2 !important;
                    border-radius: 4px;
                    padding: 1em;
                    overflow-x: auto;
                    font-family: 'Fira Code', monospace;
                    font-size: 0.85rem !important; /* Reduced font size */
                    line-height: 1.4;
                }
            `;
        } else {
            // Light theme styles
            style.innerHTML = `
                .ql-toolbar.ql-snow {
                    background: #f8f8f8 !important;
                    border-color: #ddd !important;
                    border-top-left-radius: 8px;
                    border-top-right-radius: 8px;
                }
                .ql-container.ql-snow {
                    background: #fff !important;
                    border-color: #ddd !important;
                    border-bottom-left-radius: 8px;
                    border-bottom-right-radius: 8px;
                    min-height: 200px;
                }
                .ql-editor.ql-blank::before {
                    color: #999 !important;
                }
                .ql-picker-options {
                    background-color: #fff !important;
                }
                .ql-snow.ql-toolbar button:hover, 
                .ql-snow .ql-toolbar button:hover,
                .ql-snow.ql-toolbar button.ql-active, 
                .ql-snow .ql-toolbar button.ql-active {
                    background-color: #e6e6e6 !important;
                }
                /* Code block styling */
                .ql-editor pre.ql-syntax {
                    background-color: #f5f5f5 !important;
                    color: #333 !important;
                    border-radius: 4px;
                    padding: 1em;
                    overflow-x: auto;
                    font-family: 'Fira Code', monospace;
                    border: 1px solid #e0e0e0;
                    font-size: 0.85rem !important; /* Reduced font size */
                    line-height: 1.4;
                }
            `;
        }
        document.head.appendChild(style);
        
        return () => {
            document.head.removeChild(style);
        };
    }, [theme]);

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'align': [] }],
            ['link', 'image', 'code-block'],  // Added code-block here
            ['clean']
        ],
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image', 'align',
        'code-block'  // Added code-block here
    ];

    const addCategory = () => {
        if (category.trim() !== '') {
            setCategoryList([...categoryList, category]);
            setCategory('');
        }
    };

    const deleteCategory = (index) => {
        let updates = [...categoryList];
        updates.splice(index, 1);
        setCategoryList(updates);
    };

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
            <div className={`min-h-screen ${theme ? "bg-gradient-to-b from-black to-gray-800 via-black text-white" : "bg-gray-50"}`}>
                <div className={`container mx-auto px-4 md:px-6 lg:px-8 xl:max-w-5xl py-10`}>
                    <div className={`${theme ? "bg-zinc-900/60 shadow-lg shadow-zinc-800/20" : "bg-white shadow-lg"} rounded-xl p-6 md:p-8`}>
                        <h1 className={`text-2xl md:text-3xl font-bold ${theme ? "text-white" : "text-gray-800"} mb-6`}>Create a post</h1>
                        
                        <form className='w-full flex flex-col space-y-5 md:space-y-7' onSubmit={submitHandler}>
                            {/* Title Input */}
                            <div className="space-y-2">
                                <label className={`text-sm font-medium ${theme ? "text-gray-200" : "text-gray-700"}`}>Post Title</label>
                                <input 
                                    value={title} 
                                    onChange={(e) => setTitle(e.target.value)} 
                                    type="text" 
                                    className={`w-full outline-none px-4 py-3 rounded-lg transition-colors ${
                                        theme 
                                            ? "bg-zinc-800/80 text-white border border-zinc-700 focus:border-purple-500" 
                                            : "bg-white border border-gray-300 focus:border-purple-500"
                                    }`} 
                                    placeholder='Enter an engaging title...' 
                                    required 
                                />
                            </div>
                            
                            {/* Rich Text Editor */}
                            <div className="space-y-2">
                                <label className={`text-sm font-medium ${theme ? "text-gray-200" : "text-gray-700"}`}>Post Content</label>
                                <div className="editor-wrapper">
                                    <ReactQuill 
                                        value={description} 
                                        onChange={handleEditorChange} 
                                        modules={modules}
                                        formats={formats}
                                        placeholder="Write your post content here..."
                                        className="rounded-lg overflow-hidden"
                                    />
                                </div>
                                {descriptionError && <p className="text-red-500 text-sm mt-1">{descriptionError}</p>}
                            </div>
                            
                            {/* File Upload */}
                            <div className="space-y-2">
                                <label className={`text-sm font-medium ${theme ? "text-gray-200" : "text-gray-700"}`}>Featured Image</label>
                                
                                {file ? (
                                    <div className='relative'>
                                        <img src={URL.createObjectURL(file)} alt="Uploaded File" className="mt-2 max-h-[300px] w-auto object-cover rounded-lg" />
                                        <div className="mt-2 flex items-center justify-between">
                                            <p className={`font-medium text-sm ${theme ? "text-gray-300" : "text-gray-600"}`}>
                                                {file.name.length > 40 ? `${file.name.substring(0, 40)}...` : file.name}
                                            </p>
                                            <button
                                                type="button"
                                                className={`p-2 rounded-full ${theme ? "bg-red-900/40 hover:bg-red-900/60" : "bg-red-100 hover:bg-red-200"}`}
                                                onClick={() => setFile(null)}
                                                disabled={loading}
                                            >
                                                <IoMdCloseCircle size={20} color={theme ? '#ff9999' : '#dc2626'} />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={`relative border-2 border-dashed rounded-lg p-8 flex justify-center items-center cursor-pointer ${
                                        theme ? "border-zinc-700 bg-zinc-800/40" : "border-gray-300 bg-gray-50"
                                    }`}>
                                        <input 
                                            type="file" 
                                            className="absolute inset-0 opacity-0 cursor-pointer" 
                                            onChange={(e) => setFile(e.target.files[0])}
                                            accept="image/*"
                                        />
                                        <div className="text-center">
                                            <p className={`${theme ? "text-gray-400" : "text-gray-500"}`}>Drag & Drop or Click to Upload</p>
                                            <p className={`text-sm ${theme ? "text-gray-500" : "text-gray-400"}`}>(Max file size: 10MB)</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            {loading && (
                                <div className={`rounded-lg p-3 ${
                                    theme ? "bg-blue-900/30 border border-blue-800 text-blue-300" : "bg-blue-100 border border-blue-200 text-blue-700"
                                }`} role="alert">
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Please wait, post is creating...
                                    </span>
                                </div>
                            )}
                            
                            {/* Categories */}
                            <div className="space-y-3">
                                <label className={`text-sm font-medium ${theme ? "text-gray-200" : "text-gray-700"}`}>Categories</label>
                                
                                <div className='flex items-center space-x-4'>
                                    <input 
                                        value={category} 
                                        onChange={(e) => setCategory(e.target.value)} 
                                        type="text" 
                                        name="category" 
                                        className={`flex-1 px-4 py-2 outline-none rounded-lg ${
                                            theme 
                                                ? "bg-zinc-800/80 text-white border border-zinc-700 focus:border-purple-500" 
                                                : "bg-white border border-gray-300 focus:border-purple-500"
                                        }`} 
                                        placeholder='Enter category...' 
                                    />
                                    <button 
                                        type="button" 
                                        onClick={addCategory} 
                                        className={`px-4 py-2 font-medium rounded-lg transition ${
                                            theme 
                                                ? "bg-purple-700 hover:bg-purple-600 text-white" 
                                                : "bg-purple-600 hover:bg-purple-700 text-white"
                                        }`}
                                    >
                                        Add
                                    </button>
                                </div>
                                
                                <div className='flex flex-wrap gap-2 mt-2'>
                                    {categoryList?.map((item, index) => (
                                        <div 
                                            key={index} 
                                            className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                                                theme 
                                                    ? "bg-zinc-800 border border-zinc-700" 
                                                    : "bg-gray-100 border border-gray-200"
                                            }`}
                                        >
                                            <p className="text-sm">{item}</p>
                                            <button 
                                                type="button"
                                                onClick={() => deleteCategory(index)} 
                                                className={`rounded-full p-1 transition ${
                                                    theme 
                                                        ? "hover:bg-zinc-700" 
                                                        : "hover:bg-gray-200"
                                                }`}
                                            >
                                                <IoMdCloseCircle size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className='pt-6'>
                                <button 
                                    type='submit' 
                                    disabled={loading}
                                    className={`w-full md:w-auto px-8 py-3 rounded-lg font-medium transition ${
                                        theme 
                                            ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white" 
                                            : "bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white"
                                    }`}
                                >
                                    Publish Post
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default CreatePost;
