<script>
	import { getContext, onMount } from 'svelte';

	const user = getContext('user');
	let avatarElement;

	onMount(() => {
		const updateAvatar = async () => {
			const cache = await caches.open('avatar-cache');
			let avatar = await cache.match('/avatar');

			if (!avatar) {
				avatar = await fetch($user.identity.photo);
				if (!avatar.ok) return (avatarElement.src = '/notfound.png');
				cache.put('/avatar', avatar);
			}

			const avatarBlob = await avatar.blob();
			avatarElement.src = window.URL.createObjectURL(avatarBlob);
		};

		updateAvatar();
	});
</script>

<img {...$$restProps} alt="Avatar" bind:this={avatarElement} />
