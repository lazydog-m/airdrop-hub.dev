function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/dashboard';

export const PATH_DASHBOARD = {
  project: {
    list: path(ROOTS_DASHBOARD, '/project/list'),
    create: path(ROOTS_DASHBOARD, '/project/create'),
    edit: (id) => path(ROOTS_DASHBOARD, `/project/${id}/edit`),
  },
  profile: {
    list: path(ROOTS_DASHBOARD, '/profile/list'),
    create: path(ROOTS_DASHBOARD, '/profile/create'),
    edit: (id) => path(ROOTS_DASHBOARD, `/profile/${id}/edit`),
  },
  wallet: {
    list: path(ROOTS_DASHBOARD, '/wallet/list'),
    create: path(ROOTS_DASHBOARD, '/wallet/create'),
    edit: (id) => path(ROOTS_DASHBOARD, `/wallet/${id}/edit`),
  },
  task: {
    list: path(ROOTS_DASHBOARD, '/task/list'),
    create: path(ROOTS_DASHBOARD, '/task/create'),
    edit: (id) => path(ROOTS_DASHBOARD, `/task/${id}/edit`),
  },
  script: {
    list: path(ROOTS_DASHBOARD, '/script/list'),
    create: path(ROOTS_DASHBOARD, '/script/create'),
    edit: (fileName) => path(ROOTS_DASHBOARD, `/script/${fileName}/edit`),
  },
  extension: {
    list: path(ROOTS_DASHBOARD, '/extension/list'),
    create: path(ROOTS_DASHBOARD, '/extension/create'),
    edit: (extName) => path(ROOTS_DASHBOARD, `/extension/${extName}/edit`),
  },
  app: path(ROOTS_DASHBOARD, '/app'),
};


