<!-- todo put this in a better place, change path on +layout.svelte thank you / nk -->
<!-- too dumb to sort mouse movements please someone make a better PR thanks / nk -->
<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let blob;
	let t = 0;

	const mouseHandler = event => {
		const { clientX, clientY } = event;
		const { innerWidth, innerHeight } = window;
		const centerX = innerWidth / 2;
		const centerY = innerHeight / 2;
		const modifier = innerHeight / 4;

		blob.animate(
			{
				top: `${centerY + modifier * (clientY / innerHeight - 0.5) * 2}px`,
				left: `${centerX + modifier * (clientX / innerWidth - 0.5) * 2}px`
			},
			{ duration: 1000, fill: 'forwards' }
		);
	};

	const updateColor = (time = Date.now()) => {
		const red = 128 + 50 * Math.sin(time / 1000);
		const green = 128 + 50 * Math.cos(time / 1000);
		const blue = 128 + 50;

		blob.style.background = `linear-gradient(to right, rgb(${red},${green},${blue}), rgb(${blue},${green},${red}))`;
		blob.style.transform = `translate(-50%, -50%) rotate(${(time / 100) % 360}deg)`;

		requestAnimationFrame(updateColor);
	};

	onMount(() => {
		updateColor();
		document.onmousemove = mouseHandler;
	});
</script>

<main class="w-screen h-screen bg-transparent absolute">
	<div
		bind:this={blob}
		class="absolute -z-10 top-1/2 left-1/2 pointer-events-none rounded-[50%] h-[50vh] w-[50vh] blur-[200rem]"
	></div>
</main>
