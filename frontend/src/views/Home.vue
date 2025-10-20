<template>
	<div class="home">
		<h1>Home Page</h1>
		<p>Welcome {{ username }}!</p>
	</div>
</template>

<script setup>
// Read username from Vuex
import { computed } from "vue"
import { useStore } from "vuex"
// Store access for template
const store = useStore()
const username = computed(() => store.getters.username)
</script>

<style scoped>
.home {
	padding: 2rem;
	text-align: center;
}
</style>
