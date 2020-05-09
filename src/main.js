import App from './App.svelte';

const app = new App({
	target: document.body,
	props: { path_to_music : 'sounds'}
});

export default app;