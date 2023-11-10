<script>
	import { enhance } from '$app/forms';
	import { ArrowPath } from 'svelte-heros-v2';
</script>

<section class="overflow-hidden">
	<form method="post" use:enhance>
		<button
			class="square"
			title="Invoke Algorithm Check"
			formaction="/dashboard/botControls?/invokeAlgorithmCheck"
		>
			<ArrowPath class="icon" />
		</button>
	</form>
</section>
