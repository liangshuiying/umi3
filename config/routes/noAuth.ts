import { Route } from '@ant-design/pro-layout/es/typings';

export default [
  {
    path: '/users',
    component: '../layouts/LoginLayout',
    routes: [
      {
        name: '登录',
        path: '/users/login',
        component: './Login',
      },
    ],
  },
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      {
        name: '注册成功',
        path: '/user/register-result',
        component: './user/register-result',
      },
      {
        name: '注册',
        path: '/user/register',
        component: './user/register',
      },
      // {
      //   name: '修改密码成功',
      //   path: '/user/forget-result',
      //   component: './user/Forget-result',
      // },
      // {
      //   name: '忘记密码',
      //   path: '/user/forget',
      //   component: './user/Forget',
      // },
      {
        component: './404',
      },
    ],
  },
] as Route[];
