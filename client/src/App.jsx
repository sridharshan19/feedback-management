import { ChakraProvider, Box } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Colleges from './pages/Colleges';
import Tutors from './pages/Tutors';
import Feedback from './pages/Feedback';
import FeedbackDetails from './pages/FeedbackDetails';
import FeedbackForm from './pages/feedbackform';
import Login from './pages/Login';

function App() {
  return (
    <ChakraProvider>
      <Router>
        <MainLayout />
      </Router>
    </ChakraProvider>
  );
}

function MainLayout() {
  const location = useLocation();
  const isFeedbackFormPage = location.pathname.startsWith('/feedbackform/');
  const isHomePage = location.pathname === '/';
  const token = localStorage.getItem('token'); 
  if (!token && !isFeedbackFormPage && location.pathname !== '/') {
    return <Navigate to="/" replace />;
  }

  return (
    <Box display="flex">
      {!isFeedbackFormPage && !isHomePage && <Sidebar />}
      <Box flex="1" p={5}>
        <Routes>
          <Route path="/college" element={<Colleges />} />
          <Route path="/tutors" element={<Tutors />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/feedback/:id" element={<FeedbackDetails />} />
          <Route path="/feedbackform/:id" element={<FeedbackForm />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
