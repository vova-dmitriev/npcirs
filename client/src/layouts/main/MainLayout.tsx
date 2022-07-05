import React, { useState, createRef } from 'react';
import { Outlet } from 'react-router-dom';
import {
  ErrorBoundary,
  Header,
  Sidebar as CustomSidebar,
} from '../../components';
import { Sidebar, Sticky } from 'semantic-ui-react';

import './MainLayout.css';

const MainLayout: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <ErrorBoundary>
      <div className="main-layout">
        <Header toggleSidebar={toggleSidebar} />

        <Sidebar.Pushable>
          <CustomSidebar isOpen={isOpen} />
          <Sidebar.Pusher>
            <div className="page">
              <Outlet />
            </div>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
    </ErrorBoundary>
  );
};

export default MainLayout;
