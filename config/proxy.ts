/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
  dev: {
    '/admin': {
      target: '	http://59.110.27.185:20244/', // 测试环境网关地址
      // target: '	https://facade.01member.com', // 正式环境网关地址
      changeOrigin: true,
      pathRewrite: { '^/admin/': '/admin/' },
    },
    '/v1': {
      target: 'http://10.11.1.7:8181/', //龙虎
      //target: 'http://10.11.2.2:8181/', //卓程
      //target: 'http://10.11.1.172:8181/', //博文
      changeOrigin: true,
      pathRewrite: { '^/v1': '/v1' },
    },
  },
  test: {
    '/admin': {
      target: '	http://59.110.27.185:20244/', // 测试环境网关地址
      // target: '	https://facade.01member.com', // 正式环境网关地址
      changeOrigin: true,
      pathRewrite: { '^/admin/': '/admin/' },
    },
    '/v1': {
      target: 'http://10.11.1.7:8181/', //龙虎
      //target: 'http://10.11.2.2:8181/', //卓程
      //target: 'http://10.11.1.172:8181/', //博文
      changeOrigin: true,
      pathRewrite: { '^/v1': '/v1' },
    },
  },
  pre: {
    '/api/': {
      target: 'your pre url',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
};
