import { useRoutes, Navigate } from 'react-router-dom';
import DashboardAppPage from './pages/DashboardAppPage';
import UserPage from './pages/UserPage';
import MeetingsPage from './pages/MeetingPage';
import Categories from './pages/Categories';
import LoginPage from './pages/LoginPage';
import SimpleLayout from './layouts/simple/SimpleLayout';
import Page404 from './pages/Page404';
import { isAuthenticated } from './utils/authHelper';
import DashboardLayout from './layouts/dashboard/DashboardLayout';
import Commission from './pages/Commission';
import Chat from './pages/Chat';
import Payments from './pages/Payments';
import Admins from './pages/Admins';
import ChangePassword from './pages/ChangePassword';
import { isAdmin } from './data/user';

function AppRoutes() {
  const isAuthenticateds = isAuthenticated();
  const isadmin = isAdmin();
  console.log('ddd', isAuthenticateds);
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        {
          element: isAuthenticateds ? <Navigate to="/dashboard/app" /> : <Navigate to="/login" />,
          index: true,
        },
        { path: 'app', element: isAuthenticateds ? <DashboardAppPage /> : <Navigate to="/login" /> },
        { path: 'user/:userType', element: isAuthenticateds ? <UserPage /> : <Navigate to="/login" /> },
        { path: 'user', element: isAuthenticateds ? <UserPage /> : <Navigate to="/login" /> },
        { path: 'admin', element: isAuthenticateds ? <Admins /> : <Navigate to="/login" /> },
        { path: 'meetings/:type', element: isAuthenticateds ? <MeetingsPage /> : <Navigate to="/login" /> },
        { path: 'meetings', element: isAuthenticateds ? <MeetingsPage /> : <Navigate to="/login" /> },
        {
          path: 'categories',
          element: isAuthenticateds ? <Categories /> : <Navigate to="/login" />,
        },
        {
          path: 'categories/:categoryId',
          element: isAuthenticateds ? <Categories /> : <Navigate to="/login" />,
        },

        {
          path: 'payments',
          element: isAuthenticateds ? isadmin ? <Payments /> : <Page404 /> : <Navigate to="/login" />,
        },
        {
          path: 'payments/:paymentStatus',
          element: isAuthenticateds ? isadmin ? <Payments /> : <Page404 /> : <Navigate to="/login" />,
        },
        {
          path: 'chat',
          element: isAuthenticateds ? <Chat /> : <Navigate to="/login" />,
        },
        {
          path: 'change-password',
          element: isAuthenticateds ? <ChangePassword /> : <Navigate to="/dashboard/app" />,
        },
      ],
    },
    {
      path: '/login',
      element: isAuthenticateds ? <Navigate to="/dashboard/app" /> : <LoginPage />,
      children: [
        {
          element: isAuthenticateds ? <Navigate to="/dashboard/app" /> : <LoginPage />,
        },
      ],
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    // {
    //   path: '/user/change-password',
    //   element: isAuthenticateds ? <ChangePassword /> : <Navigate to="/dashboard/app" />,
    //   children: [
    //     {
    //       element: isAuthenticateds ? <ChangePassword /> : <Navigate to="/dashboard/app" />,
    //     },
    //   ],
    // },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}

export default AppRoutes;
