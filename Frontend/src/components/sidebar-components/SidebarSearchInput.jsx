import React, { useState, useEffect, useRef } from 'react'

import { IoArrowBack, IoSearch, IoSearchCircle } from 'react-icons/io5'
import { useSidebar } from '../../context/SidebarContext';
import useToggle from '../../hooks/useToggle';
import useLoading from '../../hooks/useLoading';
import { fetchSearchedConversation } from '../../services/apiServices';
import useClickOutside from '../../hooks/useClickOutside';
import SuggestionConversation from '../Search-modal/SuggestionConversation';
import SuggestionSkelton from '../Search-modal/SuggestionSkelton';
import CirculareL1 from '../Loaders/CirculareL1';

export default function SidebarSearchInput({ ToggleShowSearch }) {
    const { conversations, setConversations } = useSidebar();
    const [isError, setIsError] = useState(false);
    const { loading, stopLoading, startLoading } = useLoading();
    const [filteredConversation, setFilteredConversation] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const debounceTimeout = useRef(null);
    const searchRef = useRef();
    useClickOutside(searchRef, ToggleShowSearch);

    // Debounce effect for search
    useEffect(() => {
        const fetchData = async () => {
            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
            }
            if (searchQuery.length > 0) {
                setFilteredConversation(
                    conversations.length > 0 && conversations.filter(conv =>
                        conv.name?.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                );
                startLoading();
                debounceTimeout.current = setTimeout(async () => {
                    try {
                        const data = await fetchSearchedConversation(searchQuery);
                        if (data?.results?.length > 0) {
                            setFilteredConversation(prev => {
                                const existingIds = new Set(prev.map(conv => conv.id));
                                const newResults = data.results.filter(conv => !existingIds.has(conv.id));
                                return [...prev, ...newResults];
                            });
                        }
                    }
                    catch {
                        setIsError(true);
                    }
                    finally {
                        stopLoading();
                    }
                }, 300); // 300ms debounce
            } else {
                setFilteredConversation([]);
                stopLoading();
            }
        };

        fetchData();

        return () => clearTimeout(debounceTimeout.current);
    }, [searchQuery]);

    const handleChange = (e) => {
        setSearchQuery(e.target.value);
    }

    return (

        <div ref={searchRef}
            className={`
                    bg-gray-900 md:rounded-xl shadow-lg relative flex flex-col w-full h-full py-2 px-3
                    max-w-xl  md:h-[80%]
                `}
        >
            <div className="w-full py-2  flex items-center border-b pb-4  border-b-gray-700  bg-gray-900 md:rounded-lg">
                <button onClick={ToggleShowSearch} className="rounded-full text-gray-300 hover:text-white p-1">
                    <IoArrowBack className="h-6 w-auto" />
                </button>
                <input
                    value={searchQuery}
                    onChange={handleChange}
                    type="text"
                    placeholder="Search chats..."
                    className="focus:outline-none caret-purple lg:text-lg w-full px-2 lg:px-4 bg-gray-900 outline-none py-1 rounded-md text-white"
                />
            </div>


            {/* suggestions */}
            <div className="suggestions px-2 py-4 h-full scrollbar-dark overflow-y-auto">
                <div className="flex flex-col gap-2  ">
                    {filteredConversation && filteredConversation.length > 0 ? filteredConversation.map((conv) => (
                        <SuggestionConversation toggleShowSearch={ToggleShowSearch} conversation={conv} key={conv.id} />
                    )) :
                        !loading && searchQuery.length > 0 && <div className="text-left flex  text-gray-300  gap-5">
                            <IoSearch className='h-6 w-auto' />   No search results found
                        </div>
                    }

                    {/* <div className="flex flex-col gap-2">
                        {!loading &&
                            [1, 2, 3, 4].map((i) => (
                                <SuggestionSkelton />
                            ))
                        }
                        </div> */}
                    {loading &&
                        <div className="w-full flex justify-center ">
                            <CirculareL1 />
                        </div>
                    }
                </div>
            </div>
        </div>

    )
}
