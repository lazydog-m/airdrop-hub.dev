import { Suspense, lazy } from 'react';
import { useRoutes } from 'react-router-dom';
import LoadingScreen from '../components/LoadingScreen';
import DashboardLayout from '../layouts';

// ----------------------------------------------------------------------

const Loadable = (Component) => (props) => {
  window.scrollTo(0, 0);
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    {
      path: '/dashboard',
      element: (
        <DashboardLayout />
      ),
      children: [
        {
          path: 'app',
          element: <GeneralApp />
        },

        {
          path: 'project',
          children: [
            { path: 'list', element: <ProjectList /> },
            // { path: 'create', element: <ProjectList /> },
            // { path: ':id/edit', element: <ProjectList /> },
          ],
        },

        {
          path: 'profile',
          children: [
            { path: 'list', element: <ProfileList /> },
            // { path: 'create', element: <ProfileList /> },
            // { path: ':id/edit', element: <ProfileList /> },
          ],
        },

        {
          path: 'wallet',
          children: [
            { path: 'list', element: <WalletList /> },
            // { path: 'create', element: <WalletList /> },
            // { path: ':id/edit', element: <WalletList /> },
          ],
        },
        {
          path: 'task',
          children: [
            { path: 'list', element: <TaskList /> },
            { path: 'create', element: <TaskNewEdit /> },
            { path: ':id/edit', element: <TaskNewEdit /> },
          ],
        },
        {
          path: 'script',
          children: [
            { path: 'list', element: <ScriptList /> },
            { path: 'create', element: <ScriptNewEdit /> },
            { path: ':name/edit', element: <ScriptNewEdit /> },
          ],
        },
        // { path: 'statistics', element: <ThongKe /> },
      ],
    },

    // { path: '/', element: <Navigate to="/dashboard/employee/list" replace /> },
    // { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}

const ProjectList = Loadable(lazy(() => import('../pages/dashboard/project/list/ProjectList')));
const ProfileList = Loadable(lazy(() => import('../pages/dashboard/profile/list/ProfileList')));
const WalletList = Loadable(lazy(() => import('../pages/dashboard/wallet/list/WalletList')));
const TaskList = Loadable(lazy(() => import('../pages/dashboard/task/list/TaskList')));
const ScriptList = Loadable(lazy(() => import('../pages/dashboard/script/list/ScriptList')));
const ScriptNewEdit = Loadable(lazy(() => import('../pages/dashboard/script/new-edit/ScriptNewEdit')));
const TaskNewEdit = Loadable(lazy(() => import('../pages/dashboard/task/new-edit/TaskNewEdit')));
const GeneralApp = Loadable(lazy(() => import('../pages/dashboard/statistics/GeneralApp')));
