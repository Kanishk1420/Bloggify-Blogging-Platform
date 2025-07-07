import { Link } from 'react-router-dom'

const Notfound = () => {
    return (
        <div className="bg-gradient-to-r from-purple-300 to-blue-200">
            <div className="w-9/12 m-auto py-16 min-h-screen flex items-center justify-center">
                <div className="bg-white shadow overflow-hidden sm:rounded-lg pb-8">
                    <div className="border-t border-gray-200 text-center pt-8">
                        <h1 className="text-9xl font-bold text-purple-400">404</h1>
                        <h1 className="text-6xl font-medium py-8">Oops! Page not found</h1>
                        <p className="text-2xl pb-8 px-12 font-medium">Oops! The page you are looking for does not exist. It might have been moved or deleted.</p>
                        <Link to='/' className="bg-blue-500 text-white font-semibold px-6 py-3 rounded-md mr-6 hover:bg-blue-600">
                            HOME
                        </Link>
                        <Link to='/' className="bg-red-500 text-white font-semibold px-6 py-3 rounded-md hover:bg-red-600">
                            Contact Us
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Notfound
