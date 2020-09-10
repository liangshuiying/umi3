import { CodeFilled } from "@ant-design/icons";

/**
 * code=-1 表示无需控制权限的页面
 * code=-2 表示需要根据子菜单的code来控制权限，用于逻辑判断,没有这个，会默认认为子级菜单都需要权限控制
 * code=-3 表示需要控制的权限在它的routes下，结合父级菜单code=-2将自己的routes挂载到父级
 */
export const fetchQAuth = {
  status: 1,
  data: [
    {
      id: "2",
      name: "会员中心",
      path: "/members",
      routes: [
        {
          id: "8",
          name: "会员管理",
          path: "/members/manage",
          code: "-1",
          routes: [
            {
              path: "/members/manage/page",
              name: "会员列表",
              routes: [
                {
                  id: "117",
                  name: "会员列表",
                  path: "/members/manage/page/list",
                  code: "-1",
                  routes: [
                    {
                      id: "112",
                      name: "手动打标",
                      code: "1",
                      routes: [],
                      is_botton: true,
                      parent_id: "117",
                    },
                    {
                      id: "18",
                      name: "编辑",
                      path: "/members/manage/page/detail",
                      code: "2",
                      routes: [],
                      is_botton: true,
                      nick_name: "",
                      parent_id: "117",
                    },
                  ],
                  is_botton: false,
                  parent_id: "8",
                },
                {
                  id: "91",
                  name: "会员详情",
                  path: "/members/manage/page/detail",
                  code: "-1",
                  routes: [],
                  is_botton: false,
                  parent_id: "8",
                },
              ],
            }
          ],
          is_botton: false,
          nick_name: "",
          parent_id: "2",
        },
        {
          id: "92",
          name: "会员标签",
          path: "/members/tag",
          code: "-1",
          routes: [
            {
              path: "/members/tag/page",
              name: "标签列表",
              routes: [
                {
                  id: "95",
                  name: "标签人群",
                  path: "/members/tag/page/person-group",
                  routes: [
                    {
                      id: "114",
                      name: "下载",
                      code: "4",
                      routes: [],
                      is_botton: true,
                      parent_id: "95",
                    },
                  ],
                  is_botton: false,
                  parent_id: "92",
                },
                {
                  id: "93",
                  name: "标签列表",
                  path: "/members/tag/page/list",
                  code: "-3",
                  routes: [
                    {
                      id: "113",
                      name: "添加标签",
                      path: "/members/tag/add/page",
                      code: "1",
                      routes: [],
                      is_botton: true,
                      parent_id: "93",
                    },
                  ],
                  is_botton: false,
                  parent_id: "92",
                },
                {
                  id: "10938",
                  name: "标签详情",
                  path: "/members/tag/page/detail",
                  routes: [],
                  code: "-1",
                  is_botton: false,
                  parent_id: "92",
                },
              ]
            },
            {
              path: "/members/tag/add",
              name: "添加标签",
              routes: [
                {
                  id: "95",
                  name: "添加标签",
                  path: "/members/tag/add/pages",
                  routes: [],
                  is_botton: false,
                  parent_id: "92",
                },
                {
                  id: "99",
                  name: "添加自动标签",
                  path: "/members/tag/add/page",
                  routes: [],
                  is_botton: false,
                  parent_id: "92",
                },
                {
                  id: "99",
                  name: "添加外部导入标签",
                  path: "/members/tag/add/upload",
                  routes: [],
                  is_botton: false,
                  parent_id: "92",
                }
              ]
            },
            {
              id: "1098",
              name: "任务中心",
              path: "/members/tag/task",
              routes: [
                {
                  id: "1098",
                  name: "任务中心",
                  path: "/members/tag/task/page",
                  routes: [],
                  code: "-1",
                  is_botton: false,
                  parent_id: "92",
                },
              ],
              code: "-1",
              is_botton: false,
              parent_id: "92",
            },
          ],
          is_botton: false,
          parent_id: "2",
        },
      ],
      is_botton: false,
      nick_name: "会员",
      parent_id: "0",
    },
    {
      id: "14",
      name: "会员MOT",
      path: "/mot",
      code: "-1",
      routes: [
        {
          id: "75",
          name: "MOT策略",
          path: "/mot/strategy",
          routes: [
            {
              id: "76",
              name: "MOT策略列表",
              path: "/mot/strategy/page",
              code: "-1",
              routes: [
                {
                  id: "79",
                  name: "MOT策略列表",
                  path: "/mot/strategy/page/list",
                  code: "-1",
                  routes: [
                    {
                      id: "113",
                      path: "/mot/strategy/add/page",
                      name: "添加MOT策略",
                      code: "1",
                      routes: [],
                      is_botton: true,
                      parent_id: "93",
                    }
                  ],
                  is_botton: false,
                  parent_id: "76",
                }
              ],
              is_botton: false,
              parent_id: "75",
            },
            {
              id: "76",
              name: "添加MOT策略",
              path: "/mot/strategy/add",
              code: "-1",
              routes: [
                {
                  id: "79",
                  name: "添加MOT策略",
                  path: "/mot/strategy/add/page",
                  code: "-1",
                  routes: [],
                  is_botton: false,
                  parent_id: "76",
                }
              ],
              is_botton: false,
              parent_id: "75",
            }
          ],
          is_botton: false,
          parent_id: "14",
        },
      ],
      is_botton: false,
      parent_id: "0",
    },
    {
      id: "6",
      name: "应用中心",
      path: "/application",
      code: "-1",
      routes: [
        {
          id: "102",
          name: "应用管理",
          path: "/application/manage",
          routes: [
            {
              id: "98",
              name: "我的应用",
              path: "/application/manage/my",
              code: "-1",
              routes: [
                {
                  id: "99",
                  name: "我的应用",
                  path: "/application/manage/my/list",
                  routes: [],
                  is_botton: false,
                  parent_id: "98",
                },
              ],
              is_botton: false,
              parent_id: "14",
            }
          ],
          is_botton: false,
          parent_id: "6",
        },
        {
          id: "103",
          name: "微信平台",
          path: "/application/wechat",
          routes: [
            {
              id: "105",
              name: "帐号管理",
              path: "/application/wechat/account",
              routes: [
                {
                  id: "99",
                  name: "帐号管理",
                  path: "/application/wechat/account/list",
                  routes: [],
                  is_botton: false,
                  parent_id: "98",
                }
              ],
              is_botton: false,
              parent_id: "103",
            },
            {
              id: "105",
              name: "授权添加",
              path: "/application/wechat/authority",
              routes: [
                {
                  id: "99",
                  name: "授权添加",
                  path: "/application/wechat/authority/add",
                  routes: [],
                  is_botton: false,
                  parent_id: "98",
                }
              ],
              is_botton: false,
              parent_id: "103",
            },
            {
              id: "105",
              name: "素材管理",
              path: "/application/wechat/material",
              routes: [
                {
                  id: "99",
                  name: "素材管理",
                  path: "/application/wechat/material/list",
                  routes: [],
                  is_botton: false,
                  parent_id: "98",
                }
              ],
              is_botton: false,
              parent_id: "103",
            }
          ],
          is_botton: false,
          parent_id: "6",
        },
      ],
      is_botton: false,
      nick_name: "应用",
      parent_id: "0",
    },
    {
      id: "118",
      name: "分析决策",
      path: "/decision",
      code: "-1",
      routes: [
        {
          id: "119",
          name: "会员画像",
          path: "/decision/member",
          code: "-1",
          routes: [
            {
              id: "121",
              name: "活跃分析",
              path: "/decision/member/active",
              code: "-1",
              routes: [
                {
                  id: "124",
                  name: "编辑看板",
                  path: "/decision/member/active/edit",
                  code: "-1",
                  routes: [],
                  is_botton: false,
                  parent_id: "121",
                },
                {
                  id: "123",
                  name: "添加看板",
                  path: "/decision/member/active/new",
                  code: "-1",
                  routes: [],
                  is_botton: false,
                  parent_id: "121",
                },
                {
                  id: "122",
                  name: "活跃分析",
                  path: "/decision/member/active/list",
                  code: "-1",
                  routes: [],
                  is_botton: false,
                  parent_id: "121",
                },
              ],
              is_botton: false,
              parent_id: "119",
            },
            {
              id: "120",
              name: "属性分析",
              path: "/decision/member/attribute",
              code: "-1",
              routes: [
                {
                  id: "120",
                  name: "属性分析",
                  path: "/decision/member/attribute/page",
                  code: "-1",
                  routes: [],
                  is_botton: false,
                  parent_id: "119",
                }
              ],
              is_botton: false,
              parent_id: "119",
            },
          ],
          is_botton: false,
          parent_id: "118",
        },
        {
          id: "125",
          name: "交易分析",
          path: "/decision/business",
          code: "-1",
          routes: [
            {
              id: "130",
              name: "交易分布",
              path: "/decision/business/distribute",
              code: "-1",
              routes: [
                {
                  id: "130",
                  name: "交易分布",
                  path: "/decision/business/distribute/page",
                  code: "-1",
                  routes: [],
                  is_botton: false,
                  parent_id: "125",
                }
              ],
              is_botton: false,
              parent_id: "125",
            },
            {
              id: "126",
              name: "交易趋势",
              path: "/decision/business/trend",
              code: "-1",
              routes: [
                {
                  id: "129",
                  name: "添加看板",
                  path: "/decision/business/trend/new",
                  code: "-1",
                  routes: [],
                  is_botton: false,
                  parent_id: "126",
                },
                {
                  id: "128",
                  name: "编辑看板",
                  path: "/decision/business/trend/edit",
                  code: "-1",
                  routes: [],
                  is_botton: false,
                  parent_id: "126",
                },
                {
                  id: "127",
                  name: "交易趋势",
                  path: "/decision/business/trend/list",
                  code: "-1",
                  routes: [],
                  is_botton: false,
                  parent_id: "126",
                },
              ],
              is_botton: false,
              parent_id: "125",
            },
          ],
          is_botton: false,
          parent_id: "118",
        },
        {
          id: "75",
          name: "事件管理",
          path: "/decision/event-manage",
          routes: [
            {
              id: "76",
              name: "事件模型",
              path: "/decision/event-manage/model",
              code: "-1",
              routes: [
                {
                  id: "79",
                  name: "查看事件",
                  path: "/decision/event-manage/model/detail",
                  code: "-1",
                  routes: [],
                  is_botton: false,
                  parent_id: "76",
                },
                {
                  id: "77",
                  name: "事件列表",
                  path: "/decision/event-manage/model/list",
                  routes: [],
                  is_botton: false,
                  parent_id: "76",
                },
              ],
              is_botton: false,
              parent_id: "75",
            },
            {
              id: "98",
              name: "事件参数",
              path: "/decision/event-manage/param",
              code: "-1",
              routes: [
                {
                  id: "99",
                  name: "事件参数列表",
                  path: "/decision/event-manage/param/list",
                  routes: [],
                  is_botton: false,
                  parent_id: "98",
                },
              ],
              is_botton: false,
              parent_id: "14",
            }
          ],
          is_botton: false,
          parent_id: "14",
        }
      ],
      is_botton: false,
      parent_id: "0",
    },
    {
      id: "15",
      name: "基础管理",
      path: "/bases",
      routes: [
        {
          id: "3",
          name: "权限管理",
          path: "/bases/authority",
          routes: [
            {
              id: "9",
              name: "角色管理",
              path: "/bases/authority/role",
              code: "-2",
              routes: [
                {
                  id: "108",
                  name: "编辑角色",
                  path: "/bases/authority/role/edit",
                  code: "-1",
                  routes: [],
                  is_botton: false,
                  parent_id: "9",
                },
                {
                  id: "107",
                  name: "添加角色",
                  path: "/bases/authority/role/add",
                  code: "-1",
                  routes: [],
                  is_botton: false,
                  parent_id: "9",
                },
                {
                  id: "106",
                  name: "角色管理",
                  path: "/bases/authority/role/list",
                  code: "-3",
                  routes: [
                    {
                      id: "23",
                      name: "删除",
                      code: "3",
                      routes: [],
                      is_botton: true,
                      nick_name: "",
                      parent_id: "106",
                    },
                    {
                      id: "22",
                      name: "编辑",
                      path: "/bases/authority/role/edit",
                      code: "2",
                      routes: [],
                      is_botton: true,
                      nick_name: "",
                      parent_id: "106",
                    },
                    {
                      id: "21",
                      name: "禁用",
                      code: "6",
                      routes: [],
                      is_botton: true,
                      nick_name: "",
                      parent_id: "106",
                    },
                    {
                      id: "20",
                      name: "启用",
                      code: "5",
                      routes: [],
                      is_botton: true,
                      nick_name: "",
                      parent_id: "106",
                    },
                    {
                      id: "19",
                      name: "添加新角色",
                      path: "/bases/authority/role/add",
                      code: "1",
                      routes: [],
                      is_botton: true,
                      nick_name: "",
                      parent_id: "106",
                    },
                  ],
                  is_botton: false,
                  parent_id: "9",
                },
              ],
              is_botton: false,
              nick_name: "",
              parent_id: "3",
            },
            {
              id: "10",
              name: "操作员管理",
              path: "/bases/authority/operator",
              code: "-2",
              routes: [
                {
                  id: "111",
                  name: "编辑操作员",
                  path: "/bases/authority/operator/edit",
                  code: "-1",
                  routes: [],
                  is_botton: false,
                  parent_id: "10",
                },
                {
                  id: "110",
                  name: "添加操作员",
                  path: "/bases/authority/operator/add",
                  code: "-1",
                  routes: [],
                  is_botton: false,
                  parent_id: "10",
                },
                {
                  id: "109",
                  name: "操作员列表",
                  path: "/bases/authority/operator/list",
                  code: "-3",
                  routes: [
                    {
                      id: "28",
                      name: "删除",
                      code: "3",
                      routes: [],
                      is_botton: true,
                      nick_name: "",
                      parent_id: "109",
                    },
                    {
                      id: "27",
                      name: "编辑",
                      path: "/bases/authority/operator/edit",
                      code: "2",
                      routes: [],
                      is_botton: true,
                      nick_name: "",
                      parent_id: "109",
                    },
                    {
                      id: "26",
                      name: "禁用",
                      code: "6",
                      routes: [],
                      is_botton: true,
                      nick_name: "",
                      parent_id: "109",
                    },
                    {
                      id: "25",
                      name: "启用",
                      code: "5",
                      routes: [],
                      is_botton: true,
                      nick_name: "",
                      parent_id: "109",
                    },
                    {
                      id: "24",
                      name: "添加新操作员",
                      path: "/bases/authority/operator/add",
                      code: "1",
                      routes: [],
                      is_botton: true,
                      nick_name: "",
                      parent_id: "109",
                    },
                  ],
                  is_botton: false,
                  parent_id: "10",
                },
              ],
              is_botton: false,
              nick_name: "",
              parent_id: "3",
            }
          ],
          is_botton: false,
          nick_name: "权限",
          parent_id: "15",
        },
        {
          id: "4",
          name: "域管理",
          path: "/bases/domain",
          routes: [
            {
              id: "3",
              name: "上级域管理",
              path: "/bases/domain/superior",
              routes: [
                {
                  id: "12",
                  name: "上级域管理",
                  path: "/bases/domain/superior/list",
                  routes: [
                    {
                      id: "34",
                      name: "再次申请",
                      code: "11",
                      routes: [],
                      is_botton: true,
                      nick_name: "",
                      parent_id: "12",
                    },
                    {
                      id: "33",
                      name: "取消",
                      code: "8",
                      routes: [],
                      is_botton: true,
                      nick_name: "",
                      parent_id: "12",
                    },
                    {
                      id: "32",
                      name: "绑定上级域",
                      code: "9",
                      routes: [],
                      is_botton: true,
                      nick_name: "",
                      parent_id: "12",
                    },
                  ],
                  is_botton: false,
                  parent_id: "4",
                }
              ]
            },
            {
              id: "11",
              name: "子域管理",
              path: "/bases/domain/inferior",
              routes: [
                {
                  id: "12",
                  name: "子域管理",
                  path: "/bases/domain/inferior/list",
                  routes: [
                    {
                      id: "31",
                      name: "解绑",
                      code: "10",
                      routes: [],
                      is_botton: true,
                      nick_name: "",
                      parent_id: "11",
                    },
                    {
                      id: "30",
                      name: "拒绝",
                      code: "8",
                      routes: [],
                      is_botton: true,
                      nick_name: "",
                      parent_id: "11",
                    },
                    {
                      id: "29",
                      name: "同意",
                      code: "7",
                      routes: [],
                      is_botton: true,
                      nick_name: "",
                      parent_id: "11",
                    },
                  ],
                  is_botton: false,
                  parent_id: "4",
                }
              ]
            },
          ],
          is_botton: false,
          nick_name: "域",
          parent_id: "15",
        },
        {
          id: "5",
          name: "开发管理",
          path: "/bases/develop",
          routes: [
            {
              id: "13",
              name: "基本配置",
              path: "/bases/develop/basesetting",
              routes: [
                {
                  id: "13",
                  name: "基本配置",
                  path: "/bases/develop/basesetting/page",
                  routes: [
                    {
                      id: "35",
                      name: "重置",
                      code: "2",
                      routes: [],
                      is_botton: true,
                      nick_name: "",
                      parent_id: "13",
                    },
                  ],
                  is_botton: false,
                  nick_name: "",
                  parent_id: "5",
                }
              ],
              is_botton: false,
              nick_name: "",
              parent_id: "5",
            },
          ],
          is_botton: false,
          nick_name: "开发",
          parent_id: "15",
        }
      ],
      is_botton: false,
      nick_name: "设置",
      parent_id: "0",
    },
  ],
};
