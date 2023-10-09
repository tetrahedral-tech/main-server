<!-- todo put this in a better place, change path on +layout.svelte thank you / nk -->
<script>
	import { onMount } from "svelte";

    let blob;
    const mm = event => { 
        const { clientX, clientY } = event;

        blob.animate({
            left: `${clientX}px`,
            top: `${clientY}px`,
        }, { duration: 1000, fill: "forwards" });
    }


    function updateGradient(t) {
        const width = blob.clientWidth;
        const height = blob.clientHeight;

        const red = 128 + (50 * Math.sin(t / 1000));
        const green = 128 + (50 * Math.cos(t / 1000));
        const blue = 128+50;

        blob.style.background = `linear-gradient(to right, rgb(${red},${green},${blue}), rgb(${blue},${green},${red}))`;
        blob.style.transform = `translate(-50%, -50%) rotate(${(t / 100) % 360}deg)`
    }

    // Call updateGradient with your desired t value, e.g., every frame
    let t = 0;
    function animate() {
        updateGradient(t);
        t += 16; // Increment t with a suitable value to control the speed of the animation (e.g., 16ms for 60fps)
        requestAnimationFrame(animate);
    }
    onMount(animate);
</script>

<main class="w-screen h-screen bg-transparent absolute" on:mousemove={mm}> <!-- as much as i would to z-index this behind itll disable the mouse effect! -->
    <div id="blob" bind:this={blob} class="blob absolute -z-10 top-1/2 left-1/2 pointer-events-auto rounded-[50%] bg-white h-[80vh] w-[50vw] blur-[200rem]">

    </div>
</main>
