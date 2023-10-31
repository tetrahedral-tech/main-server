<script>
	import { page } from '$app/stores';
	const statusColor = {
		404:"border-l-accent"
	}
	console.log(`border-${statusColor[$page.status]}-500`)
</script>

<main class="flex flex-col items-center justify-center">
	<section class={`flex h-4/5 w-2/5 items-center justify-center border-l-8 ${statusColor[$page.status]}`}>
		<div class="border-r-[5px] p-8 border-suggested">
			<h1 class="text-8xl">{$page.status}</h1>
			<h2 class="text-3xl">{$page.error.message}</h2>
		</div>
		<div class="p-8 w-72 flex flex-col">
			<a href="/dashboard">Go back to Dashboard</a>
			<a href="/identity">Go back to login</a>
		</div>
	</section>
</main>

<style>
	a:hover::before {
		content: "> ";
	}
</style>
