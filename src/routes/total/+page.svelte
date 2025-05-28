<script lang="ts">
	// import '../app.css';
	export let data;
	const { totalSorted } = data;

	// import StreakPanel from '../lib/components/StreakPanel.svelte';
	import TotalStepsPanel from '$lib/components/TotalStepsPanel.svelte';
	// import BigDaysPanel from '../lib/components/BigDaysPanel.svelte';
	// import ProgressBar from '../lib/components/ProgressBar.svelte';
</script>

<main>
	<TotalStepsPanel items={totalSorted} />
</main>
