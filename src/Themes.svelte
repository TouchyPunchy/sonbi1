<script>
	import { createEventDispatcher } from 'svelte';
	import { current_theme, themes } from './stores.js';
	const page_name = 'themes';
    const dispatch = createEventDispatcher();

    
    
	function close(e) {
		e.stopPropagation();
		dispatch('close', { page: page_name });
	}
</script>
<div class="container">
	<span class="close" on:click={close}><i class="fas fa-times"></i></span>
	<div class="grid">
		<div class="header">
			<h1>Themes</h1>
			<div>Current theme :</div>
			<div class="theme_item">
				<div class="theme-colors">
					<div style="background-color:{$current_theme.dark}"></div>
					<div style="background-color:{$current_theme.light}"></div>
					<div style="background-color:{$current_theme.primary}"></div>
					<div style="background-color:{$current_theme.secondary}"></div>
					<div style="background-color:{$current_theme.body}"></div>
				</div>
				<div class="theme-name">{$current_theme.name}</div>
			</div>
		</div>
		<div class="themes bg-dark">
			<div class="themes_items_wrapper bg-light text-dark">
				<div class="themes_items">
					{#each $themes as theme}
					<div class="theme_item" on:click={current_theme.set(theme)}>
						<div class="theme-colors">
							<div style="background-color:{theme.dark}"></div>
							<div style="background-color:{theme.light}"></div>
							<div style="background-color:{theme.primary}"></div>
							<div style="background-color:{theme.secondary}"></div>
							<div style="background-color:{theme.body}"></div>
						</div>
						<div class="theme-name">{theme.name}</div>
					</div>
					{/each}
				</div>
			</div>
		</div>Z
		<div class="preview">
			<div>preview</div>
			<div>random</div>
		</div>
	</div>
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
	.container .grid{
		display: grid;
		height: 100%;
		grid-template-rows: auto 1fr auto;
	}
	/* ---- Playlist ---- */
	.themes{
		overflow: hidden;
	}
	.themes_items_wrapper{
		height: 100%;
		max-height: 100%;
		overflow-y: scroll;
		scrollbar-width: none;
	}
	.themes_items_wrapper::-webkit-scrollbar{ display: none; }
	.themes_items{
		max-height: 100%;
		min-width: 0;
	}
	.theme_item{
		cursor: pointer;
		padding: 0.75rem;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
		display: grid;
		grid-template-columns: 30% auto;
		grid-template-rows: auto;
		grid-template-areas: "th_colors th_name";
	}
	.theme-name{
		text-align: left;
		padding-left: 1rem;
		grid-area: th_name;
	}
	.theme-colors{
		grid-area: th_colors;
		display: flex;
		flex-direction: row;
		align-items: stretch;
	}
	.theme-colors div{
		width: 2rem;
		height: 1.5rem;
	}
	@media (max-width: 640px) {
		.container { right: 0; left: 0; top: 0; bottom: 0;}
	}
</style>