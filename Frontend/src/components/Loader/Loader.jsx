import React from 'react'
import { useSelector } from 'react-redux'

const Loader = () => {
    const { theme } = useSelector((state) => state.theme)
    return (
        <div className={`flex justify-center items-center h-screen px-10 `}>
            <div className="loader">
                <div className="circle" style={{ backgroundColor: theme ? 'white' : 'black' }}></div>
                <div className="circle" style={{ backgroundColor: theme ? 'white' : 'black' }}></div>
                <div className="circle" style={{ backgroundColor: theme ? 'white' : 'black' }}></div>
                <div className="circle" style={{ backgroundColor: theme ? 'white' : 'black' }}></div>
            </div>
        </div>
    )
}

export default Loader
