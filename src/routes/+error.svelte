<script>
	import { page } from '$app/stores';
</script>

<main class="flex flex-col items-center justify-center">
	<section class="flex h-4/5 w-2/3 flex-col items-center justify-center">
		<h1 class="text-2xl">{$page.status} {$page.error.message}</h1>
		<a href="/dashboard">Go back to the Dashboard</a>
	</section>
</main>
