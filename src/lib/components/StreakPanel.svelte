<script lang="ts">
	import BarChart from './BarChart.svelte';
	export let items: any[];
	// compute the maximum single-day step count across all participants
	const maxStep = Math.max(0, ...items.flatMap((i) => i.daily.map((d: { steps: any }) => d.steps)));
</script>

<ul>
	{#each items as p, i}
		<li>
			<BarChart
				daily={p.daily}
				name={p.display}
				streak={p.maxStreak}
				average={p.avgDaily}
				{maxStep}
				rank={i + 1}
			/>
		</li>
	{/each}
</ul>

<style>
	ul {
		padding: 0;
		margin: 0;
		/* gap: 1rem; */
	}
	li {
		list-style: none;
		margin: var(--list-gap) 0;
	}
</style>
