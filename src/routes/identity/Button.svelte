<script>
	export let provider;
</script>

<form class="w-1/2" method="post" action="/identity?/{provider}">
	<button class="flex w-full border-none bg-white p-2 text-start text-black" type="submit">
		<img class="aspect-square w-8" src="/identity/{provider}.svg" alt="" />
		<span class="m-auto">Continue with <span class="capitalize">{provider}</span></span>
	</button>
</form>
