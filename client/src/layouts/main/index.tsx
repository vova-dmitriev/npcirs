import React from 'react';
import { Outlet } from 'react-router-dom';
import ErrorBoundary from '../../components/ErrorBoundary';

const MainLayout: React.FC = () => {
  return (
    <ErrorBoundary>
      <Outlet />
    </ErrorBoundary>
  );
};

export default MainLayout;
