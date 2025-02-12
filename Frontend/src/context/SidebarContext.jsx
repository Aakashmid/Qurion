import React, { createContext, useState, useContext } from 'react';
import useToggle from '../hooks/useToggle';

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
    const [isSidebarOpen, toggleSidebarOpen] = useToggle(false);

    return (
        <SidebarContext.Provider value={{ isSidebarOpen, toggleSidebarOpen }}>
            {children}
        </SidebarContext.Provider>
    );
};

export const useSidebar = () => useContext(SidebarContext);