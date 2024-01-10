// component

import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import DiscountIcon from '@mui/icons-material/Discount';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import CategoryIcon from '@mui/icons-material/Category';
import PaidIcon from '@mui/icons-material/Paid';
import { CropRotateSharp } from '@mui/icons-material';
import ChatIcon from '@mui/icons-material/Chat';
import { isAdmin } from '../../../data/user';

import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;
const isadmin = isAdmin()
const superAdminConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Users',
    path: '/dashboard/user',
    icon: icon('ic_user'),
  },
  {
    title: 'Sub-Admins',
    path: '/dashboard/admin',
    icon: <AdminPanelSettingsIcon/>,
  },
  {
    title: 'Agencies',
    path: '/dashboard/agencies',
    icon: <AdminPanelSettingsIcon/>,
  },
  {
    title: 'Meetings',
    path: '/dashboard/meetings',
    icon: <SupervisorAccountIcon/>,
  },
  {
    title: 'Categories',
    path: '/dashboard/categories',
    icon: <CategoryIcon/>,
  },
  {
    title: 'PromoCodes',
    path: '/dashboard/promoCodes',
    icon: <DiscountIcon/>,
  },
 
  {
    title: 'Payments',
    path: '/dashboard/payments',
    icon:<PaidIcon/>,
  },
  {
    title: 'WithDrawal Request',
    path: '/dashboard/withdrawal-request',
    icon:<PaidIcon/>,
  },
  {
    title: 'Chat',
    path: '/dashboard/chat',
    icon: <ChatIcon/>,
  },
  {
    title: 'Contacts',
    path: '/dashboard/contacts',
    icon: <ContactPageIcon/>,
  },

  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: icon('ic_disabled'),
  // },
];
const adminConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Users',
    path: '/dashboard/user',
    icon: icon('ic_user'),
  },

  {
    title: 'Agencies',
    path: '/dashboard/agencies',
    icon: <AdminPanelSettingsIcon/>,
  },
  {
    title: 'Meetings',
    path: '/dashboard/meetings',
    icon: <SupervisorAccountIcon/>,
  },
  {
    title: 'Categories',
    path: '/dashboard/categories',
    icon: <CategoryIcon/>,
  },
  {
    title: 'PromoCodes',
    path: '/dashboard/promoCodes',
    icon: <DiscountIcon/>,
  },
  {
    title: 'Chat',
    path: '/dashboard/chat',
    icon: <ChatIcon/>,
  },
  {
    title: 'Contacts',
    path: '/dashboard/contacts',
    icon: <ContactPageIcon/>,
  },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: icon('ic_disabled'),
  // },
];
console.log(isadmin, "final isAdmin")
const navConfig = isadmin ? adminConfig :superAdminConfig;


export default navConfig;
