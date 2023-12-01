<script>
	import { enhance } from '$app/forms';
	import { Trash } from 'svelte-heros-v2';
</script>

<section class="p-0 w-96 text-left">
	<div class="p-5 header">
		<h1 class="text-2xl">delete bot?</h1>
	</div>
	<div class="p-5 border border-light">
		<p class="text-base">this action is irreversible!</p>
	</div>
	<form method="post" class="p-3 w-full" use:enhance>
		<button
			class="border-red/20 hover:bg-red transition-all ml-auto block"
			title="Delete Bot?"
		>
			<Trash class="icon" />
		</button>
	</form>
</section>
