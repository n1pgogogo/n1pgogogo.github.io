import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
    {
        path: '/',
        redirect: '/layout/home'
    },
    {
        path: '/layout',
        name: 'Layout',
        component: () => import('../views/Layout/index.vue'),
        children: [
            {
                path: 'home',
                name: 'Home',
                component: () => import('../views/Home/index.vue')
            },
            {
                path: 'time',
                name: 'Time',
                component: () => import('../views/Time/index.vue')
            },
            {
                path: 'about',
                name: 'About',
                component: () => import('../views/About/index.vue')
            },
            {
                path: 'test',
                name: 'Test',
                component: () => import('../views/Test/index.vue')
            }
        ]
    }
]
const router = createRouter({
    history: createWebHashHistory(),
    routes
})
export default router;