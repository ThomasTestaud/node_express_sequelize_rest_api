import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'AllTasks',
      component: () => import('../views/AllTasks.vue')
    },
    /*
    {
      path: '/task',
      name: 'Task',
      component: () => import('../views/Task.vue')
    },
    {
      path: '/new-task',
      name: 'NewTask',
      component: () => import('../views/NewTask.vue')
    },*/
  ]
})

export default router
