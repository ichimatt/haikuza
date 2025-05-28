<script lang="ts">
	export let items: { name: string; date: string; steps: number }[];

	// compute the maximum step count among the top days
	const maxStep = Math.max(...items.map((d) => d.steps));

	// format numbers with space separator
	function formatNumber(n: number): string {
		return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
	}

	const monthNames = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec'
	];
	function formatDate(dateStr: string): string {
		const d = new Date(dateStr);
		const dd = String(d.getDate()).padStart(2, '0');
		const mm = monthNames[d.getMonth()];
		return `${dd} ${mm}`;
	}
</script>

<ul>
	{#each items as d, i}
		<li>
			<section class="info-container">
				<section class="number">{String(i + 1).padStart(2, '0')}</section>
				<section class="title">
					<small>{d.name}</small>
					<small>{formatDate(d.date)}</small>
				</section>
				<section class="number primary">{formatNumber(d.steps)}</section>
			</section>
			<div class="bar-container">
				<div class="bar" style="width: {(d.steps / maxStep) * 100}%" />
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
