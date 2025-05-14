import { useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { useSidebar } from "../context/SidebarContext";
import Header from "../components/Header";

const HomePageLayout = ({ children }) => {
    const { isSidebarOpen, toggleSidebarOpen } = useSidebar();

    
    return (
        <>
            <header className={`${isSidebarOpen ? 'md:ml-[33%] xl:ml-[25%] ' : 'md:ml-0 xl:ml-0'} transition-all duration-300 ease-linear`}>
                <Header/>
            </header>
            <main className="flex w-full ">
                <div className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-all duration-300 ease-linear fixed top-0 left-0 z-20  w-full md:w-[33%]  xl:w-[25%] `}>
                    <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebarOpen={toggleSidebarOpen} />
                </div>
                {/* <div className="fixed top-0"><Sidebar/></div> */}
                <div className={`w-full  ${isSidebarOpen ? 'md:ml-[33%] xl:ml-[25%] ' : 'md:ml-0 xl:ml-0'} transition-all duration-300 ease-linear  `}>
                    {children}
                </div>
            </main>
        </>
    );
};

export default HomePageLayout;