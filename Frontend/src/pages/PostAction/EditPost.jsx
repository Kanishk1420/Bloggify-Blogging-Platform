/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetPostByIdQuery, useUpdatePostMutation, useUploadFileMutation } from '../../api/post.js'
import { toast } from 'react-toastify';
import { IoMdCloseCircle } from 'react-icons/io';
import {useSelector } from 'react-redux';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import Loader from '../../components/Loader/Loader';



const EditPost = () => {
  const [category, setCategory] = useState('');
  const [categoryList, setCategoryList] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);



  const [uploadFile] = useUploadFileMutation();
  const [updatePost] = useUpdatePostMutation();
  const { theme } = useSelector((state) => state.theme);

  const { data, isLoading } = useGetPostByIdQuery(id);
  const { userInfo } = useSelector((state) => state.auth);

  const getPost = async () => {
    if (data) {
      setTitle(data?.getPost?.title);
      setDescription(data?.getPost?.description);
      setCategoryList(data?.getPost?.categories);
    }
  };

  const handleEditorChange = (content) => {
    setDescription(content);
  };

  useEffect(() => {
    getPost();
  }, [data]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      let post = {
        title,
        description,
        username: userInfo?.user?.username,
        userId: userInfo?.user?._id,
        categories: categoryList,
      };
      if (file) {
        const formData = new FormData();
        formData.append('image', file);
        const res = await uploadFile(formData).unwrap();
        post.photo = { url: res?.secure_url, public_id: res.public_id };
        setLoading(false);
      }
      const updatedData = await updatePost({ updateData: post, postId: id }).unwrap();
      navigate("/posts/post/" + updatedData?.updatedPost?._id);
      toast.success("Post updated successfully");
      setLoading(false);
      window.location.reload();
    } catch (err) {
      toast.error(err?.message || "Something went wrong");
      setLoading(false);
    }
  };




  const addCategory = () => {
    if (category.trim() !== '') {
      setCategoryList([...categoryList, category]);
      setCategory('');
    }
  };

  const deleteCategory = (index) => {
    const updatedCategories = [...categoryList];
    updatedCategories.splice(index, 1);
    setCategoryList(updatedCategories);
  };
  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <Navbar />
      <div className={`px-6 md:px-[200px] pt-14 ${theme ? "bg-gradient-to-b from-black to-gray-800 via-black text-white" : ""} `}>
        <h1 className="font-bold md:text-2xl text-xl mt-8">Update Post</h1>
        <form className="w-full flex flex-col space-y-4 md:space-y-8 mt-4" onSubmit={submitHandler}>
          <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" className={`outline-none px-4 py-2 rounded-md ${theme ? "bg-black text-white ring-1 ring-gray-600 " : "ring-1 ring-black"}`} placeholder='Enter post title...' required />
          <ReactQuill value={description} onChange={handleEditorChange} className={`${theme ? "bg-black" : "bg-zinc-50 text-black"}w-full  outline-none px-4 py-2 rounded-md`} placeholder="Write description..." />
          {file ? (
            <div className="relative">
              <p className='font-semibold text-md'>File Name: {file.name}</p>
              <img src={URL.createObjectURL(file)} alt="Uploaded File" width={500} className="mt-2 object-cover rounded-lg" />
              <button
                className="absolute top-0 right-12 p-2 text-gray-600 hover:text-gray-800"
                onClick={() => setFile(null)}
              >
                <IoMdCloseCircle size={24} />
              </button>
            </div>
          ) : (
            <div className="relative top-1 bottom-5 border-2 border-dashed border-gray-300 rounded-lg p-8 flex justify-center items-center cursor-pointer">
              <input type="file" className="absolute inset-0 opacity-0" onChange={(e) => setFile(e.target.files[0])} />
              <div className="text-center">
                <p className="text-gray-500">Drag & Drop or Click to Upload</p>
                <p className="text-sm text-gray-500">(Max file size: 10MB)</p>
              </div>
            </div>
          )}

          {loading && (
            <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">Please wait, post is updating...</span>
            </div>
          )}

          <div className="flex items-center space-x-4 md:space-x-8">
            <input value={category} onChange={(e) => setCategory(e.target.value)} type="text" name="category" id="category" className={`px-4 py-2 outline-none rounded-md ${theme ? "bg-black text-white ring-1 ring-gray-600 " : "border border-black"}`} placeholder='Enter category...' />
            <button type="button" onClick={addCategory} className="bg-black text-white px-4 py-2 font-semibold cursor-pointer rounded-md ">
              Add
            </button>
          </div>
          <div className="flex mt-4">
            {categoryList?.map((item, index) => (
              <div key={index} className={`flex justify-center w-24 items-center mr-4 p-5 space-x-2  py-1 rounded-md ${theme ? "bg-black" : "bg-gray-200"}`}>
                <p>{item}</p>
                <p onClick={() => deleteCategory(index)} className="p-1 cursor-pointer" ><IoMdCloseCircle size={18} /></p>
              </div>
            ))}
          </div>

          <div className='pb-10 flex justify-center items-center'>
            <button type='submit' className='bg-gray-200 text-black  mx-auto w-full md:w-[30%] py-3 px-4 rounded-md mt-24 '>Update</button>

          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default EditPost;
