import React from 'react'

export default function CircualrProgress2({width}) {
    return (
        <div className="flex justify-center items-center">
            <div className={`w-${width} h-${width} border-4 border-purple-500 rounded-full border-t-transparent animate-spin`}></div>
        </div>)
}
