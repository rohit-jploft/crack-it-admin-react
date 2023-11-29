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
import { isAdmin, isSuperAdmin } from './data/user';
import WithDrawalRequest from './pages/WithdrawalReq';
import PromoCodes from './pages/PromoCodes';
import Agencies from './pages/Agencies';
import ContactLeads from './pages/Contact';

function AppRoutes() {
  const isAuthenticateds = isAuthenticated();
  const isadmin = isAdmin();
  const issuperAdmin = isSuperAdmin()
  
  console.log('isadmin', isAuthenticateds);
  console.log('issuperAdmin', );
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
        { path: 'admin', element: isAuthenticateds && issuperAdmin ? <Admins /> : <Page404/> },
        { path: 'agencies', element: isAuthenticateds ? <Agencies /> : <Navigate to="/login" /> },
        { path: 'meetings/:type', element: isAuthenticateds ? <MeetingsPage /> : <Navigate to="/login" /> },
        { path: 'meetings', element: isAuthenticateds ? <MeetingsPage /> : <Navigate to="/login" /> },
        {
          path: 'categories',
          element: isAuthenticateds ? <Categories /> : <Navigate to="/login" />,
        },
        {
          path: 'contacts',
          element: isAuthenticateds ? <ContactLeads /> : <Navigate to="/login" />,
        },
        {
          path: 'categories/:categoryId',
          element: isAuthenticateds ? <Categories /> : <Navigate to="/login" />,
        },
        {
          path: 'promoCodes',
          element: isAuthenticateds ? <PromoCodes /> : <Navigate to="/login" />,
        },

        {
          path: 'payments',
          element: isAuthenticateds && issuperAdmin ? <Payments /> : <Page404 />,
        },
        {
          path: 'withdrawal-request',
          element: isAuthenticateds && issuperAdmin ? <WithDrawalRequest /> : <Page404 />,
        },
        {
          path: 'payments/:paymentStatus',
          element: isAuthenticateds && issuperAdmin ? <Payments /> : <Page404 />,
        },
        {
          path: 'chat',
          element: isAuthenticateds ? <Chat /> : <Navigate to="/login" />,
        },
        {
          path: 'chat/:selectConvo',
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
