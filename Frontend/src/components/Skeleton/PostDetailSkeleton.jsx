import { useSelector } from 'react-redux';

const PostDetailSkeleton = () => {

    const { theme } = useSelector((state) => state.theme)

    return (
        <div className={`${theme ? "bg-black" : ""}`}>
            <div className='px-4 md:px-8 py-7 max-w-4xl mx-auto '>
                <div className='animate-pulse'>
                    {/* Title */}
                    <div className='h-8 bg-gray-300 w-3/4 mb-4'></div>
                    {/* Meta */}
                    <div className='flex items-center space-x-2 text-sm text-gray-600 mb-4'>
                        <div className='h-4 bg-gray-300 w-20'></div>
                        <span>|</span>
                        <div className='h-4 bg-gray-300 w-20'></div>
                        <span>|</span>
                        <div className='h-4 bg-gray-300 w-20'></div>
                    </div>
                    {/* User Info */}
                    <div className='flex gap-3 mb-5 justify-start items-center'>
                        <div className='h-12 w-12 bg-gray-300 rounded-full'></div>
                        <div className='flex flex-col'>
                            <div className='h-4 bg-gray-300 w-24'></div>
                            <div className='h-4 bg-gray-300 w-20'></div>
                        </div>
                        <span className='mb-2 text-gray-400'>•</span>
                        <div className='h-4 bg-gray-300 w-20'></div>
                    </div>
                    {/* Border */}
                    <div className='border-gray-100 border-b-2 mb-2'></div>
                    {/* Like and Action Buttons */}
                    <div className='flex mb-5 mt-4'>
                        <div className='h-8 w-8 rounded-full'></div>
                        <div className='flex-grow flex justify-end gap-6'>
                            <div className='h-8 w-8 bg-gray-300 rounded-full'></div>
                            <div className='h-8 w-8 bg-gray-300 rounded-full'></div>
                            <div className='h-8 w-8 bg-gray-300 rounded-full'></div>
                        </div>
                    </div>
                    {/* Image */}
                    <div className='h-96 bg-gray-300 rounded-lg mb-6 shadow-xl'></div>
                    {/* Description */}
                    <div className='h-20 bg-gray-300 mb-6'></div>
                    {/* Categories */}
                    <div className='flex flex-wrap items-center space-x-2 mb-6'>
                        <div className='bg-gray-200 rounded-md px-3 py-1 text-sm text-gray-600'>Category</div>
                        <div className='bg-gray-200 rounded-md px-3 py-1 text-sm text-gray-600'>Category</div>
                    </div>
                    {/* Action Buttons */}
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center space-x-2'>
                            <div className='h-8 w-8 bg-gray-300 rounded-full'></div>
                            <div className='h-8 w-8 bg-gray-300 rounded-full'></div>
                        </div>
                    </div>
                    {/* Comments */}
                    <h3 className='text-xl font-semibold mt-8 mb-4'>Comments:</h3>
                    <div className='h-20 bg-gray-300 mb-8'></div>
                    {/* Write Comment */}
                    <div className='h-20 bg-gray-300 mb-8'></div>
                </div>
            </div>
        </div>
    );
};

export default PostDetailSkeleton;
