<!-- todo put this in a better place, change path on +layout.svelte thank you / nk -->
<!-- too dumb to sort mouse movements please someone make a better PR thanks / nk -->
<script>
	import { onMount } from 'svelte';

	let blob;

	const mouseHandler = event => {
		const { clientX, clientY } = event;
		const { innerWidth, innerHeight } = window;
		const centerX = innerWidth / 2;
		const centerY = innerHeight / 2;

		blob.animate(
			{
				top: `${clientY}px`,
				left: `${clientX}px`
			},
			{ duration: 5000, fill: 'forwards' }
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

<div
	bind:this={blob}
	class="absolute top-1/2 left-1/2 w-[800px] h-[800px] -z-10 pointer-events-none rounded-full blur-[10rem]"
></div>
