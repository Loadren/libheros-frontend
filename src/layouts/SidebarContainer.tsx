import React from 'react';
import { LeftSidebar } from '../components/LeftSidebar';
import { RightSidebar } from '../components/RightSidebar';
import { Outlet } from 'react-router-dom';

/**
 * Layout component with a left sidebar, main content area, and optional right sidebar.
 * Takes full viewport width and height.
 */
const SidebarContainer: React.FC = () => {

    return (
        <div className="flex h-screen w-full">
            {/* Left Sidebar occupies fixed width */}
            <LeftSidebar />

            {/* Main content grows to fill available space */}
            <main className="flex-1 overflow-auto bg-gray-50 p-6">
                <Outlet />
            </main>

            {/* Right Sidebar, if provided, occupies fixed width */}
            <RightSidebar />
        </div>
    );
};

export default SidebarContainer;
