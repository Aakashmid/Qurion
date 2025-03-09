import Sidebar from "../components/Sidebar";
import { useSidebar } from "../context/SidebarContext";

const HomePageLayout = ({ children }) => {
    const { isSidebarOpen, toggleSidebarOpen } = useSidebar();

    // have to solve inconsistency in sidebar open and close   , also have to adjust height of layout to completely take screen
    return (
        <div className="flex w-full min-h-[92vh]">
            <div className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-all duration-300 ease-linear fixed top-0 left-0 z-20 h-screen w-full lg:w-[33%] xl:w-[25%] `}>
                <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebarOpen={toggleSidebarOpen} />
            </div>
            <div className={`w-full ${isSidebarOpen ? 'lg:ml-[33%] xl:ml-[25%] ' : 'lg:ml-0 xl:ml-0'} transition-all duration-300 ease-linear pt-[4rem] `}>
                {/* <Chatpage /> */}
                {children}
            </div>        
            </div>
    );
};

export default HomePageLayout;