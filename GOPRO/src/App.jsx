import React from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './router.jsx';
import { LoanProvider } from './context/LoanContext';

export default function App() {
  return (
    <LoanProvider>
      <RouterProvider router={router} />
    </LoanProvider>
  );
}
