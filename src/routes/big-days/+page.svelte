<script lang="ts">
	export let data;
	const { participants, totalSorted, top5, daysElapsed } = data;
	import BigDaysPanel from '$lib/components/BigDaysPanel.svelte';
</script>

<section>
	<BigDaysPanel items={data.top5} />
</section>
