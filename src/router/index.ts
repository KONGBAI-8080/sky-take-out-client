import { createRouter, createWebHistory } from "vue-router";


const router = createRouter({
    history: createWebHistory(),
    routes : [
        {
            path: "/login",
            component: ()=>import("../views/login/index.vue")
        }
    ]
})

export default router;