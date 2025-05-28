<script lang="ts">
	// import '../app.css';
	export let data;
	const { participants, totalSorted, top5, daysElapsed } = data;

	import StreakPanel from '../lib/components/StreakPanel.svelte';
	// import TotalStepsPanel from '../lib/components/TotalStepsPanel.svelte';
	// import BigDaysPanel from '../lib/components/BigDaysPanel.svelte';
	// import ProgressBar from '../lib/components/ProgressBar.svelte';
</script>

<main>
	<!-- <ProgressBar {daysElapsed} total={84} /> -->
	<!-- <section> -->
	<!-- <h2>Streaks</h2> -->
	<StreakPanel items={data.participants} />
	<!-- </section> -->
	<!-- <section>
		<h2>Total Steps</h2>
		<TotalStepsPanel items={totalSorted} />
	</section>
	<section>
		<h2>Big Days</h2>
		<BigDaysPanel items={data.top5} />
	</section> -->
</main>

<style>
	section {
		padding: 21px;
	}
</style>
