<template>
	<nav class="navbar">
		<router-link v-if="!isAuthenticated" to="/" class="nav-link">Login</router-link>
		<router-link v-if="isAuthenticated" to="/home" class="nav-link">Home</router-link>
		<router-link v-if="isAuthenticated && (isEditor || isAdmin)" to="/editor" class="nav-link">Editor</router-link>
		<router-link v-if="isAuthenticated && isAdmin" to="/admin" class="nav-link">Admin</router-link>
	</nav>
</template>
//
<script setup>
import { computed } from "vue"
import { useStore } from "vuex"

const store = useStore()
const isAuthenticated = computed(() => store.getters.isAuthenticated)
const isAdmin = computed(() => store.getters.isAdmin)
const isEditor = computed(() => store.getters.isEditor)
</script>

<style scoped>
.navbar { display: flex; justify-content: space-between; width: 250px; margin: 0 auto; }
.nav-link { text-decoration: none; }
</style>
