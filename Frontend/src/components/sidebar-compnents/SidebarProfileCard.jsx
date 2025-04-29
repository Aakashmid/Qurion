import React from 'react'

export default function SidebarProfileCard() {
    return (
    <div className=" sidebar-bottom bg-gray-900  hover:bg-gray-800 transition-colors active:bg-gray-800 ">
        {/* onclick profile open popover  */}
        <div className="profile-card h-[5rem] flex items-center gap-3 p-4 transition-all  rounded-lg cursor-pointer">
            {/* profile image */}
            <div className="avatar w-8 h-8 rounded-full bg-purple flex items-center justify-center">
                <span className="text-white font-medium">U</span>
            </div>
            <div className="user-info">
                <h4 className=" font-medium">User Name</h4>
                <p className="text-xs text-gray-300">user@example.com</p>
            </div>
        </div>
    </div>

    )
}
