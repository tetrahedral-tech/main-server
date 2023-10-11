<script>
	export let provider;
</script>

<form class="w-1/2" method="post" action="/identity?/{provider}">
	<button class="p-2 w-full bg-white text-black border-none flex text-start" type="submit">
		<img class="w-8 aspect-square" src="/identity/{provider}.svg" alt="" />
		<span class="m-auto">Continue with <span class="capitalize">{provider}</span></span>
	</button>
</form>
