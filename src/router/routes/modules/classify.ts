import type { AppRouteModule } from '/@/router/types'

import { LAYOUT } from '/@/router/constant'
import { t } from '/@/hooks/web/useI18n'

const setup: AppRouteModule = {
  path: '/classify',
  name: 'Classify',
  component: LAYOUT,
  redirect: '/classify/index',
  meta: {
    orderNo: 2,
    hideChildrenInMenu: true,
    icon: 'ant-design:apartment-outlined',
    title: t('routes.menu.classify.classify'),
  },
  children: [
    {
      path: 'index',
      name: 'Classify',
      component: () => import('/@/views/classify/index.vue'),
      meta: {
        title: t('routes.menu.classify.classify'),
        icon: 'ant-design:apartment-outlined',
        hideMenu: true,
      },
    },
  ],
}

export default setup
