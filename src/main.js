import Sonbi1 from './Sonbi1.svelte';

const app = new Sonbi1({
	target: document.querySelector('main'),
	props: { path_to_music : 'sounds'}
});

export default app;