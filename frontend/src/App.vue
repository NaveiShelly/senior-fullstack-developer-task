<template>
	<div>
		<Navbar v-if="showNavbar" />
		<router-view />
	</div>
</template>

<script setup>
import { computed } from "vue"
import { useRoute } from "vue-router"
import Navbar from "./components/Navbar.vue"

const route = useRoute()
const showNavbar = computed(() => route.path !== "/")
</script>

<style>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
}

button {
	padding: 0.5rem 1rem;
	font-size: 1rem;
	background-color: #dc3545;
	color: white;
	border: none;
	border-radius: 4px;
	cursor: pointer;
	margin-top: 1rem;
}

button:hover {
	background-color: #c82333;
}
</style>
