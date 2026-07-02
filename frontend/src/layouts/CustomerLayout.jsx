import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import PageContainer from '../components/PageContainer.jsx';

export default function CustomerLayout() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      <PageContainer>
        <Outlet />
      </PageContainer>
      <Footer />
    </div>
  );
}
