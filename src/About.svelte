<script>
    import { createEventDispatcher } from 'svelte';
	const page_name = 'about';
    const dispatch = createEventDispatcher();
    
	function close(e) {
		e.stopPropagation();
		dispatch('close', { page: page_name });
	}
</script>
<div class="container">
	<span class="close" on:click={close}><i class="fas fa-times"></i></span>
	<h1>SonBi1</h1>
	<p><a href="https://github.com/TheBreaks/sonbi1">https://github.com/TheBreaks/sonbi1</a></p>
</div>
<style>
    a{ color: var(--primary-color); }
	.close{
		cursor: pointer;
		position: absolute;
		right: 1rem;
		padding: 1rem;
	}
    .container{
        text-align: center;
		z-index: 1;
		position: absolute;
		right: 1rem;
		left: 1rem;
		top: 1rem;
		bottom: 1rem;
		padding: 0 1rem;
		background-color: var(--dark-color);
		color: var(--light-color);
	}
	@media (max-width: 640px) {
		.container { right: 0; left: 0; top: 0; bottom: 0;}
	}
</style>