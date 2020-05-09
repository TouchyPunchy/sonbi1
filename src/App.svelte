<script>
	import Player from './Player.svelte';
	import '@fortawesome/fontawesome-free/js/fontawesome.min.js';
	import '@fortawesome/fontawesome-free/js/solid.min.js';

	export let path_to_music;
</script>
<main>
	<Player path_to_music={path_to_music}/>
</main>
<style>
	@media (min-width: 640px) {
		main {
			max-width: 960px;
			margin: 0 auto;
		}
	}
</style>