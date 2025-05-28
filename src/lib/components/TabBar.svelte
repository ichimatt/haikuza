<script lang="ts">
	import { page } from '$app/stores';

	const tabs = [
		{ href: '/', label: 'Streak' },
		{ href: '/total', label: 'Total' },
		{ href: '/big-days', label: 'Big Days' }
	];

	// re-compute on every navigation
	$: activeIdx = tabs.findIndex((t) => $page.url.pathname === t.href);
</script>

<nav>
	<div class="tabs">
		{#each tabs as { href, label }}
			<a {href} class:selected={$page.url.pathname === href} sveltekit:prefetch>
				{label}
			</a>
		{/each}
		<div class="indicator" style="--idx: {activeIdx}" />
	</div>
</nav>

<style>
	nav {
		position: sticky;
		top: 0;
		display: block;
		padding: 0 21px;
		background-color: var(--background);
		box-shadow: 0 0 0 4px var(--background);
	}
	.tabs {
		position: relative;
		display: flex;
		border-bottom: 2px solid var(--foreground);
	}
	.tabs a {
		display: block;
		padding: 0.75rem 0;
		text-transform: lowercase;
		width: calc(100% / 3);
		text-decoration: none;
		color: var(--foreground);
	}
	.tabs a.selected {
		color: var(--primary);
	}
	.indicator {
		position: absolute;
		bottom: -2px;
		left: calc(var(--idx) * 100% / 3);
		width: calc(100% / 3);
		height: 2px;
		background: var(--primary);
		transition: left 200ms var(--ease-out-expo);
		box-shadow: 0 0 0 2px var(--background);
	}
</style>
