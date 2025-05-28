<script lang="ts">
	export let daysElapsed: number;
	export let total: number;
	const pct = (daysElapsed / total) * 100;
</script>

<div style="background:#eee; width:100%; height:16px; border-radius:8px; overflow:hidden;">
	<div style="background:green; width:{pct}%; height:100%;"></div>
</div>
<p>{daysElapsed} / {total} days</p>
