import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: '发现音乐' }
  },
  {
    path: '/discover',
    name: 'Discover',
    component: () => import('@/views/DiscoverView.vue'),
    meta: { title: '音乐库' }
  },
  {
    path: '/charts',
    name: 'Charts',
    component: () => import('@/views/ChartsView.vue'),
    meta: { title: '热歌榜' }
  },
  {
    path: '/playlist/:id',
    name: 'PlaylistDetail',
    component: () => import('@/views/PlaylistDetailView.vue'),
    meta: { title: '歌单详情' }
  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: () => import('@/views/FavoritesView.vue'),
    meta: { title: '我的收藏' }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/ProfileView.vue'),
    meta: { title: '个人中心' }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

router.afterEach((to) => {
  document.title = `${to.meta.title || 'EchoMusic'} - EchoMusic`
})

export default router
