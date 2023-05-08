import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/redirect',
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  // 注册
  {
    path: '/register',
    component: () => import('@/views/register/index'),
    hidden: true
  },
  // 找回密码
  {
    path: '/password',
    component: () => import('@/views/password/index'),
    hidden: true
  },
  // 个人中心
  {
    path: '/personalCenter',
    component: Layout,
    redirect: '/personalCenter',
    meta: { title: '个人中心' },
    children: [
      {
        path: '/personalCenter',
        component: () => import('@/views/personalCenter/index'),
        name: 'PersonalCenter',
        meta: { title: '基本信息' },
        hidden: true
      }
    ],
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        component: () => import('@/views/dashboard/main'),
        name: 'Dashboard',
        meta: { title: '工作台', icon: 'icon-gongzuotai1', affix: true }
      }
    ]
  }
]

export const asyncRoutes = [
  {
    path: '/enterprise',
    component: Layout,
    redirect: '/enterprise/record/info',
    alwaysShow: true, // will always show the root menu
    meta: {
      title: '企业管理',
      icon: 'icon-qiyexinxiguanli',
      roles: ['admin'],
      permission: 'MENU_ENTERPRISE_MANAGEMENT'
    },
    children: [
      {
        path: '/enterprise/record/info',
        component: () => import('@/views/enterpriseInfo/record'),
        name: 'EnterpriseRecord',
        meta: {
          title: '企业资料',
          // icon: 'icon-qiyebeianxinxi',
          roles: ['admin'],
          permission: 'MENU_ORG_DATA'
        }
      },
      {
        path: '/enterprise/entCerfication',
        component: () => import('@/views/enterpriseInfo/entCerfication'),
        name: 'EntCerfication',
        meta: {
          title: '企业认证',
          // icon: 'icon-qiyebeianxinxi',
          roles: ['admin'],
          permission: 'MENU_ORG_CERTIFICATION'
        }
      },
      // {
      //   path: '/enterprise/goods/info',
      //   component: () => import('@/views/enterpriseInfo/goods'),
      //   name: 'EnterpriseGoods',
      //   meta: {
      //     title: '企业商品维护',
      //     icon: 'icon-qiyeshangpinweihu',
      //     roles: ['admin'],
      //     permission: 'MENU_ORG_GOODS'
      //   }
      // },
      {
        path: '/enterprise/organization',
        component: () => import('@/views/enterpriseInfo/organization/index.vue'),
        name: 'Organization',
        meta: {
          title: '组织管理',
          // icon: 'icon-qiyezhanghaoguanli',
          roles: ['admin'],
          permission: 'MENU_ORGANIZATION_MANAGEMENT'
        }
      },
      {
        path: '/enterprise/organization/salearea',
        component: () => import('@/views/enterpriseInfo/organization/saleArea'),
        name: 'SaleArea',
        meta: {
          title: '区域',
          roles: ['admin'],
          permission: 'MENU_ORGANIZATION_MANAGEMENT_BUTTON_AREA'
        },
        hidden: true
      },
      {
        path: '/enterprise/account/info',
        component: () => import('@/views/enterpriseInfo/account'),
        name: 'EnterpriseAccount',
        meta: {
          title: '用户管理',
          // icon: 'icon-qiyezhanghaoguanli',
          roles: ['admin'],
          permission: 'MENU_USER_MANAGEMENT'
        }
      }
      // {
      //   path: '/enterprise/traceCode/info',
      //   component: () => import('@/views/enterpriseInfo/traceCode'),
      //   name: 'EnterpriseTraceCode',
      //   meta: {
      //     title: '溯源码申请列表',
      //     icon: 'icon-suyuanmashenqingliebiao',
      //     roles: ['admin'],
      //     permission: 'MENU_TRACE_CODE_APPLY'
      //   }
      // }
    ]
  },
  {
    path: '/traceability',
    component: Layout,
    redirect: '/traceability/traceInfo/manage',
    alwaysShow: true, // will always show the root menu
    meta: {
      title: '追溯信息备案',
      icon: 'icon-zhuisuchaxun',
      roles: ['admin'],
      permission: 'MENU_TRACEABILITY_INFORMATION'
    },
    children: [
      {
        path: '/traceability/materialInfo',
        component: () => import('@/views/TraceabilityInfo/materialInfo'),
        name: 'MaterialInfo',
        meta: {
          title: '原料信息',
          // icon: 'icon-qiyechanpinxinxi',
          roles: ['admin'],
          showSecondPage: true, // 二级菜单页面显示 or 三级路由页面的显示
          permission: 'MENU_MATERIAL_INFORMATION'
        },
        children: [
        //   {
        //   path: '/traceability/materialInfo/materialDetail',
        //   component: () => import('@/views/TraceabilityInfo/materialInfo/materialDetail'),
        //   name: 'MaterialDetail',
        //   meta: {
        //     title: '原料详情',
        //     roles: ['admin'],
        //     showSecondPage: false,
        //     activeMenu: '/traceability/materialInfo',
        //     permission: 'MENU_MATERIAL_INFORMATION_BUTTON_DETAILS'
        //   },
        //   hidden: true
        // },
          {
            path: '/traceability/materialInfo/createOrEdit',
            component: () => import('@/views/TraceabilityInfo/materialInfo/createOrEdit'),
            name: 'CreateOrEdit',
            meta: {
              title: '新增原料',
              roles: ['admin'],
              showSecondPage: false,
              activeMenu: '/traceability/materialInfo', // 设置所属二级菜单高亮
              permission: 'MENU_MATERIAL_INFORMATION_BUTTON_ADD'
            },
            hidden: true
          }]
      },
      // {
      //   path: '/traceability/materialInfo/createOrEdit',
      //   component: () => import('@/views/TraceabilityInfo/materialInfo/createOrEdit'),
      //   name: 'CreateOrEdit',
      //   meta: {
      //     title: '原料信息',
      //     roles: ['admin'],
      //     permission: 'MENU_TRACEABILITY_REPORT'
      //   },
      //   hidden: true
      // },
      {
        path: '/traceability/productInfo',
        component: () => import('@/views/TraceabilityInfo/productInfo'),
        name: 'ProductInfo',
        meta: {
          title: '产品信息',
          // icon: 'icon-qiyechanpinxinxi',
          roles: ['admin'],
          showSecondPage: true,
          permission: 'MENU_PRODUCT_INFORMATION'
        },
        children: [
        //   {
        //   path: '/traceability/productInfo/productDetail',
        //   component: () => import('@/views/TraceabilityInfo/productInfo/productDetail'),
        //   name: 'ProductDetail',
        //   meta: {
        //     title: '产品详情',
        //     roles: ['admin'],
        //     showSecondPage: false,
        //     activeMenu: '/traceability/productInfo',
        //     permission: 'MENU_PRODUCT_INFORMATION_BUTTON_DETAILS'
        //   },
        //   hidden: true
        // },
          {
            path: '/traceability/productInfo/createOrEdit',
            component: () => import('@/views/TraceabilityInfo/productInfo/createOrEdit'),
            name: 'CreateOrEdit',
            meta: {
              title: '新增产品',
              roles: ['admin'],
              showSecondPage: false,
              activeMenu: '/traceability/productInfo',
              permission: 'MENU_PRODUCT_INFORMATION_BUTTON_ADD'
            },
            hidden: true
          }]
      },
      // {
      //   path: '/traceability/productInfo/createOrEdit',
      //   component: () => import('@/views/TraceabilityInfo/productInfo/createOrEdit'),
      //   name: 'CreateOrEdit',
      //   meta: {
      //     title: '产品信息',
      //     roles: ['admin'],
      //     permission: 'MENU_TRACEABILITY_REPORT'
      //   },
      //   hidden: true
      // },
      // {
      //   path: '/traceability/productInfo/productDetail',
      //   component: () => import('@/views/TraceabilityInfo/productInfo/productDetail'),
      //   name: 'ProductDetail',
      //   meta: {
      //     title: '产品详情',
      //     roles: ['admin'],
      //     permission: 'MENU_TRACEABILITY_REPORT'
      //   },
      //   hidden: true
      // },
      // {
      //   path: '/traceability/materialInfo/materialDetail',
      //   component: () => import('@/views/TraceabilityInfo/materialInfo/materialDetail'),
      //   name: 'MaterialDetail',
      //   meta: {
      //     title: '原料详情',
      //     roles: ['admin'],
      //     permission: 'MENU_TRACEABILITY_REPORT'
      //   },
      //   hidden: true
      // },
      {
        path: '/traceability/batchInfo',
        component: () => import('@/views/TraceabilityInfo/batchInfo'),
        name: 'BatchInfo',
        meta: {
          title: '批次信息',
          roles: ['admin'],
          permission: 'MENU_BATCH_INFORMATION'
        }
      },
      {
        path: '/traceability/deliver',
        component: () => import('@/views/TraceabilityInfo/deliverRecord'),
        name: 'DeliverRecord',
        meta: {
          title: '发货记录',
          roles: ['admin'],
          permission: 'MENU_DELIVERY_RECORD'
        }
      },
      {
        path: '/traceability/receive',
        component: () => import('@/views/TraceabilityInfo/receiveRecord'),
        name: 'ReceiveRecord',
        meta: {
          title: '收货记录',
          roles: ['admin'],
          permission: 'MENU_RECEIVING_RECORD'
        }
      }
    ]
  },
  {
    path: '/announcement',
    component: Layout,
    redirect: '/announcement/notice',
    alwaysShow: true, // will always show the root menu
    name: 'Announcement',
    meta: {
      title: '公告管理',
      icon: 'icon-gonggao',
      roles: ['admin', 'editor'], // you can set roles in root nav
      permission: 'MENU_ANNOUNCEMENT_MANAGEMENT'
    },
    children: [
      {
        path: '/announcement/notice',
        component: () => import('@/views/announcement/notice'),
        name: 'Notice',
        meta: {
          title: '公告信息',
          // icon: 'icon-suyuanmazhishengcheng',
          roles: ['admin'], // or you can only set roles in sub nav
          permission: 'MENU_ANNOUNCEMENT_INFORMATION'
        }
      },
      {
        path: '/announcement/earlyWarning',
        component: () => import('@/views/announcement/earlyWarning'),
        name: 'EarlyWarning',
        meta: {
          title: '预警信息',
          // icon: 'icon-suyuanmazhishengcheng',
          roles: ['admin'], // or you can only set roles in sub nav
          permission: 'MENU_WARNING_INFORMATION'
        }
      }
    ]
  },
  {
    path: '/basicSetting',
    component: Layout,
    redirect: '/basicSetting/productReport',
    alwaysShow: true, // will always show the root menu
    meta: {
      title: '基础模块',
      icon: 'icon-jichumokuai',
      roles: ['admin'],
      permission: 'MENU_BASIC_MODULE'
    },
    children: [
      {
        path: '/basicSetting/productReport',
        component: () => import('@/views/basicSetting/productReport'),
        name: 'ProductReport',
        meta: {
          title: '产品检测报告',
          // icon: 'icon-jiaosequanxian',
          roles: ['admin'],
          permission: 'MENU_PRODUCT_REVIEW_RECORD'
        }
      },
      // {
      //   path: '/basicSetting/efficacyReport',
      //   component: () => import('@/views/basicSetting/efficacyReport'),
      //   name: 'EfficacyReport',
      //   meta: {
      //     title: '功效宣称检测报告',
      //     // icon: 'icon-jiaosequanxian',
      //     roles: ['admin'],
      //     permission: 'MENU_EFFECT_REVIEW_RECORD'
      //   }
      // },
      {
        path: '/basicSetting/labelApply',
        component: () => import('@/views/basicSetting/labelApply'),
        name: 'BasicSetting',
        meta: {
          title: '标签申请',
          // icon: 'icon-jiaosequanxian',
          roles: ['admin'],
          permission: 'MENU_LABEL_APPLY_RECORD'
        }
      },
      {
        path: '/basicSetting/activeInvlid',
        component: () => import('@/views/basicSetting/activeInvlid'),
        name: 'ActiveInvlid',
        meta: {
          title: '作废激活',
          // icon: 'icon-jiaosequanxian',
          roles: ['admin'],
          permission: 'MENU_INVALID_ACTIVE'
        }
      },
      {
        path: '/basicSetting/productAttribute',
        component: () => import('@/views/basicSetting/productAttribute'),
        name: 'AroductAttribute',
        meta: {
          title: '产品属性',
          // icon: 'icon-jiaosequanxian',
          roles: ['admin'],
          permission: 'MENU_PRODUCT_ATTRIBUTE'
        }
      },
      {
        path: '/basicSetting/receiveManage',
        component: () => import('@/views/basicSetting/receiveManage'),
        name: 'ReceiveManage',
        meta: {
          title: '收货地址',
          // icon: 'icon-jiaosequanxian',
          roles: ['admin'],
          permission: 'MENU_SHIPPING_ADDRESS'
        }
      }
    ]
  },
  {
    path: '/authority',
    component: Layout,
    redirect: '/role/authority',
    alwaysShow: true, // will always show the root menu
    meta: {
      title: '功能权限',
      icon: 'icon-gongnengquanxian1',
      roles: ['admin'],
      permission: 'MENU_FUNCTIONAL_AUTHORITY'
    },
    children: [
      {
        path: '/role/authority',
        component: () => import('@/views/authority/roleAuthority'),
        name: 'RoleAuthrity',
        meta: {
          title: '角色权限',
          // icon: 'icon-jiaosequanxian',
          roles: ['admin'],
          permission: 'MENU_ROLE_AUTHORITY'
        }
      },
      {
        path: '/role/opration/log',
        component: () => import('@/views/authority/oprationLog'),
        name: 'OprationLog',
        meta: {
          title: '操作日志',
          // icon: 'icon-jiaosequanxian',
          roles: ['admin'],
          permission: 'MENU_ROLE_AUTHORITY'
        }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
