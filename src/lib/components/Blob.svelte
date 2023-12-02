<!-- todo put this in a better place, change path on +layout.svelte thank you / nk -->
<!-- too dumb to sort mouse movements please someone make a better PR thanks / nk -->
<script>
	import { onMount } from 'svelte';

	let blob;

	const mouseHandler = event => {
		const { clientX, clientY } = event;

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
		blob.style.setProperty('--tw-translate-x', '-50%');
		blob.style.setProperty('--tw-translate-y', '-50%');
		blob.style.setProperty('--tw-translate-rotate', `${(time / 1000) % 360}deg`);

		requestAnimationFrame(updateColor);
	};

	onMount(() => {
		updateColor();
		document.onmousemove = mouseHandler;
	});
</script>

<div
	bind:this={blob}
	class="pointer-events-none absolute
	left-1/2 top-1/2 -z-10 h-[100vh] w-[100vh]
	transform-gpu rounded-full blur-[100px] opacity-30"
></div>
