<script>
	import { page } from '$app/stores';
</script>

<main class="w-screen h-screen flex justify-center items-center flex-col gap-2">
	<section class="w-2/3 h-4/5 flex justify-center items-center flex-col">
		<h1 class="text-2xl">{$page.status} {$page.error.message}</h1>
		<a href="/dashboard">Go back to the Dashboard</a>
	</section>
</main>
