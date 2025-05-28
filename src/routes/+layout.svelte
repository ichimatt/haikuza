<!-- src/routes/+layout.svelte -->
<script lang="ts">
	import '../app.css';
	export let data;
	import TabBar from '$lib/components/TabBar.svelte';
	const { participants, totalSorted, top5, daysElapsed, globalMaxStep, currentPath } = data;
</script>

<!-- src/routes/+layout.svelte -->
<svelte:head>
	<!-- tell browser to grab the font ASAP -->
	<link
		rel="preload"
		href="/fonts/ibm-plex-sans-condensed-v7-latin-700.woff2"
		as="font"
		type="font/woff2"
	/>
</svelte:head>

<section class="layout" style="--primary: {data.primaryColor}; --primary-ghost: {data.ghostColor}">
	<TabBar />
	<main class="panel">
		<slot {data} />
	</main>
</section>

<style>
	.layout {
		max-width: var(--max-w);
		margin: 0 auto 33vh;
	}
	main {
		padding: 0 21px;
	}
</style>
