<script lang="ts">
	export let items: any[];
	const maxTotal = Math.max(...items.map((i) => i.totalSteps));

	// format numbers with non-breaking space as thousand separator
	function formatNumber(n: number): string {
		return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
	}
</script>

<ul>
	{#each items as p, i}
		<li>
			<section class="info-container">
				<section class="number">
					{String(i + 1).padStart(2, '0')}
				</section>
				<section class="title">
					<small>{p.display}</small>
					<small>{formatNumber(Math.round(p.avgDaily))} / day</small>
				</section>
				<section class="number primary">
					{formatNumber(p.totalSteps)}
				</section>
			</section>
			<div class="bar-container">
				<div class="bar" style="width: {(p.totalSteps / maxTotal) * 100}%"></div>
			</div>
		</li>
	{/each}
</ul>

<style>
	ul {
		margin: 0;
		padding: 0;
		list-style: none;
	}
	li {
		user-select: none;
		margin: var(--list-gap) 0;
	}
	.info-container {
		display: flex;
		gap: var(--h-gap);
		text-transform: lowercase;
		/* align-items: baseline; */
	}
	.number {
		font-size: var(--stat-size);
		line-height: var(--stat-size);
	}
	.number.primary {
		color: var(--primary);
	}
	.title {
		flex: 1 1 1px;
	}
	.title small {
		display: block;
	}
	.bar-container {
		width: 100%;
		background: var(--primary-ghost);
		height: 4px;
		overflow: hidden;
		margin-top: var(--v-gap);
	}
	.bar {
		background: var(--primary);
		width: 0;
		height: 100%;
		box-shadow: 0 0 0 2px var(--background);
	}
</style>
