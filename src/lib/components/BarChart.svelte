<script lang="ts">
	export let daily: { date: string; steps: number }[];
	export let threshold = 10000;
	export let maxStep: number;
	export let name: string;
	export let streak: number;
	export let average: number;
	export let rank: number;

	let hover: { date: string; steps: number } | null = null;
	let svgEl: SVGSVGElement;

	function handleTouch(event: TouchEvent) {
		const rect = svgEl.getBoundingClientRect();
		const touchX = event.touches[0].clientX - rect.left;
		// compute which bar was touched based on relative position
		const barWidthCSS = rect.width / daily.length;
		const idx = Math.floor(touchX / barWidthCSS);
		const clamped = Math.max(0, Math.min(idx, daily.length - 1));
		hover = daily[clamped];
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
		const dt = new Date(dateStr);
		const dd = String(dt.getDate()).padStart(2, '0');
		const mm = monthNames[dt.getMonth()];
		return `${dd} ${mm}`;
	}

	// format numbers with a space as thousands separator
	function formatNumber(n: number): string {
		return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
	}

	const w = 342;
	const h = 64;
	$: barW = w / daily.length;
	$: countAbove = daily.filter((d) => d.steps >= threshold).length;
</script>

<figure>
	<figcaption>
		<section class="number">
			{String(rank).padStart(2, '0')}
		</section>
		<section class="title">
			<small>
				{name}
			</small>
			<small>
				{#if hover}
					{formatDate(hover.date)}:
					<span class={hover.steps >= threshold ? 'primary-text' : 'secondary-text'}>
						{new Date(hover.date) > new Date() ? '–' : formatNumber(hover.steps)}
					</span>
				{:else if streak === daily.length}
					<span class="primary-text">unbroken</span>
				{:else}
					<span class="primary-text">{countAbove}</span>
					<span>/</span>
					<span>{daily.length}</span>
				{/if}
			</small>
		</section>
		<section class="number primary">
			{streak}
		</section>
	</figcaption>
	<svg
		bind:this={svgEl}
		width={w}
		height={h}
		viewBox={`0 0 ${w} ${h}`}
		preserveAspectRatio="none"
		style="overflow: visible;"
		on:touchstart={handleTouch}
		on:touchmove={handleTouch}
		on:touchend={() => (hover = null)}
		on:touchcancel={() => (hover = null)}
	>
		{#each daily as d, i}
			<g>
				<!-- invisible full-height overlay for events -->
				<rect
					x={i * barW}
					y={0}
					width={barW}
					height={h}
					fill="white"
					fill-opacity={d === hover ? 0.1 : 0}
					on:mouseover={() => (hover = d)}
					on:mouseout={() => (hover = null)}
				/>
				<!-- visible bar with dynamic classes for state -->
				<rect
					class="bar"
					class:above={d.steps >= threshold}
					class:hidden={hover && d != hover}
					x={i * barW + 0.5}
					y={h - (d.steps / maxStep) * h}
					width={barW - 1}
					height={(d.steps / maxStep) * h}
				/>
			</g>
		{/each}
	</svg>
</figure>

<style>
	figure {
		user-select: none;
		margin: 0;
		border-bottom: 2px solid var(--foreground);
		/* padding: 1.5rem 0; */
		padding-bottom: var(--v-gap);
	}
	figcaption {
		display: flex;
		gap: 21px;
	}
	.title {
		flex: 1 1 1px;
	}
	.number {
		font-size: var(--stat-size);
		line-height: var(--stat-size);
	}
	.number.primary {
		color: var(--primary);
	}
	small {
		display: block;
		text-transform: lowercase;
	}
	.primary-text {
		color: var(--primary);
	}
	.secondary-text {
		color: var(--secondary);
	}
	svg {
		display: block;
		width: 100%;
	}
	svg,
	svg * {
		user-select: none;
		-webkit-user-select: none;
	}
	rect {
		outline-style: none;
	}
	.bar {
		fill: var(--secondary);
		pointer-events: none;
	}
	.bar.hidden {
		fill: var(--secondary-ghost);
	}
	.bar.above {
		fill: var(--primary);
	}
	.bar.above.hidden {
		fill: var(--primary-ghost);
	}
</style>
