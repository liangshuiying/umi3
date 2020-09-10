import noAuth from "./noAuth";


const routes = [
  ...noAuth,
  {
    path: '/',
    component: '../layouts/SecurityLayout',
    routes: [
      {
        path: "/",
        component: "../layouts/NestLayout",
        routes: [
          { path: "/", redirect: "/home" },
          {
            path: "/home",
            name: "首页",
            component: "./Home"
          },
          { component: "./404" }
        ]
      },
      {
        component: './404',
      },
    ],
  },
  {
    component: './404',
  },
]
export default routes;