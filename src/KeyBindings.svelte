<script>
	import { createEventDispatcher } from 'svelte';

	const page_name = 'keybindings';
	const dispatch = createEventDispatcher();

	function close(e) {
		e.stopPropagation();
		dispatch('close', { page: page_name});
	}
</script>
<div class="container">
	<span class="close" on:click={close}><i class="fas fa-times"></i></span>
	<h2>Key Bindings</h2>
	<table>
		<tr>
			<th>Fonction</th>
			<th>Keyboard key</th>
		</tr>
		<tr>
			<td>play / pause</td><td><strong>x</strong></td>
		</tr>
		<tr>
			<td>stop</td><td><strong>c</strong></td>
		</tr>
		<tr>
			<td>previous track</td><td><strong>b</strong></td>
		</tr>
		<tr>
			<td>next track</td><td><strong>n</strong></td>
		</tr>
		<tr>
			<td>forward</td><td><strong>Arrow right</strong></td>
		</tr>
		<tr>
			<td>backward</td><td><strong>Arrow left</strong></td>
		</tr>
		<tr>
			<td>toggle mute</td><td><strong>m</strong></td>
		</tr>
		<tr>
			<td>volume_up </td><td><strong>Arrow up</strong></td>
		</tr>
		<tr>
			<td>volume_down</td><td><strong>Arrow down</strong></td>
		</tr>
		<tr>
			<td>toggle shuffle</td><td><strong>s</strong></td>
		</tr>
		<tr>
			<td>toggle loop track</td><td><strong>l</strong></td>
		</tr>
		<tr>
			<td>toggle viz</td><td><strong>v</strong></td>
		</tr>
	</table>
</div>
<style>
	h2{ text-align: center; }
	table{ margin: 0 auto}
	th { text-align: left; }
	td { 
		padding: 0.25rem 1rem 0.25rem 0;
	}
	.close{
		cursor: pointer;
		position: absolute;
		right: 1rem;
		padding: 1rem;
	}
	.container{
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