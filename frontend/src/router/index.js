import { createRouter, createWebHistory } from "vue-router"
import store from "../store"
import Login from "../views/Login.vue"

const routes = [
	{
		path: "/",
		name: "Login",
		component: Login,
	},
	{
		path: "/home",
		name: "Home",
		component: () => import("../views/Home.vue"),
// Home (any role)
		meta: { requiresAuth: true, allowedRoles: ['User', 'Editor', 'Admin'] }
	},
	{
		path: "/editor",
		name: "Editor",
		component: () => import("../views/EditorView.vue"),
// Editor (Editors/Admins)
		meta: { requiresAuth: true, allowedRoles: ['Editor', 'Admin'] }
	},
// Admin (Admins)
	{
		path: "/admin",
		name: "Admin",
		component: () => import("../views/AdminView.vue"),
		meta: { requiresAuth: true, allowedRoles: ['Admin'] }
	}
]

const router = createRouter({
	history: createWebHistory(),
	routes,
})
// Global auth/role checks
function userHasRole(allowedRoles, userRoles) {
	return allowedRoles.some(role => userRoles.includes(role))
}

router.beforeEach((to, from, next) => {
	const isAuthenticated = store.getters.isAuthenticated
	const userRoles = store.getters.userRoles
	
	if (to.meta.requiresAuth && !isAuthenticated) {
		next({ name: 'Login' })
		return
	}
	
	if (to.meta.allowedRoles && isAuthenticated) {
		if (!userHasRole(to.meta.allowedRoles, userRoles)) {
			next({ name: 'Login' })
			return
		}
	}
	
	if (to.name === 'Login' && isAuthenticated) {
		next({ name: 'Home' })
		return
	}
	
	next()
})

export default router
