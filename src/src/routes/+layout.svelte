<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { user, isLoading, loadUser } from '$lib/stores/auth';
	import '@/styles/global.css';

	let { children } = $props();

	onMount(async () => {
		await loadUser();

		const publicRoutes = ['/login'];
		const isPublic = publicRoutes.some((r) => $page.url.pathname.startsWith(r));

		if (!$user && !isPublic) {
			goto('/login');
		}
		if ($user && $page.url.pathname === '/login') {
			goto('/dashboard');
		}
	});
</script>

{#if $isLoading}
	<div class="loader-overlay">
		<div class="loader-spinner"></div>
	</div>
{:else}
	{@render children()}
{/if}
