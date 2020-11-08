<div class="bg-body">
	<div class="container-theme-preview">
	<div class="theme-preview">
		<div class="grid">
			<div class="header bg-dark text-light">
				<div class="breadcrumbs">
					<span><i class='fas fa-folder-open'></i></span> <strike>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</strike>
				</div>
				<button class="pointer">
					<i class="fas fa-ellipsis-v"></i>
				</button>
			</div>
			<div class="playlist bg-dark">
				<div class="playlist_items_wrapper bg-light text-dark">
					<div class="playlist_items">
						<div class="playlist_item text-light bg-secondary">
							<i class='fas fa-folder'></i> <strike>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</strike>
						</div>
						<div class="playlist_item selected">
							1. <strike>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</strike>
						</div>
						<div class="bg-light">
						&nbsp;
						</div>
					</div>
				</div>
			</div>
			<div class="player bg-dark">
				<div class="info text-light">
					<span class="time"><strong>124</strong> | </span><strike>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</strike>
				</div>
				<div class="progress">
					<progress class="bg-light" />
				</div>
				<div class="controls">
					<div class="flexbox">
						<button title="Previous track"><i class='fas fa-step-backward'></i></button> 
						<button title="Play / Pause">
							<span><i class='fas fa-play'></i></span>
						</button> 
						<button title="Stop"><i class='fas fa-stop'></i></button> 
						<button title="Next track"><i class='fas fa-step-forward'></i></button> 
					</div>
				</div>
			</div>
		</div>
	</div>
	</div>
</div>
<style>
	/* ---- Colors / Pointers ---- */
	
	.text-light{ color: var(--light-color); }
	.text-dark{ color: var(--dark-color); }
	.selected{ background-color: var(--primary-color); }
	.bg-secondary{ background-color: var(--secondary-color); }
	.bg-dark{ background-color: var(--dark-color); }
	.bg-light{ background-color: var(--light-color); }
	.bg-body{ background-color: var(--body-color); }
	
	button{
		background-color: var(--dark-color);
		color: var(--light-color);
		border: var(--dark-color) 1px solid;
	}
	button:focus{ outline: none; }
	.player button:focus{ border: var(--primary-color) 1px solid; }
	progress::-webkit-progress-bar { background-color: var(--light-color); }
	progress::-moz-progress-bar { background-color: var(--primary-color); }
	progress::-webkit-progress-value { background-color: var(--primary-color); }

	.pointer { cursor: pointer; }

	/* ---- Container ---- */
	.theme-preview{
		font-size: 8px;
	}
	.container-theme-preview{
		width: 80%;
		margin: 1em auto;
		text-align: left;
	}
	.container-theme-preview .grid{
		display: grid;
		height: 100%;
		grid-template-rows: auto 1fr auto;
	}

	/* ---- Header ---- */
	.header{ 
		display: grid;
		padding: 0 0 0 1em;
		grid-template-columns: 1fr auto;
	 }
	.breadcrumbs{ 
		padding: 1em 1em 0 0;
	}

	.header button{
		padding: 1em 2em 1em 2em;
		font-size: 1em;
	}

	/* ---- Playlist ---- */
	.playlist{
		overflow: hidden;
		padding: 0 1em 1em 1em;
	}
	.playlist_items_wrapper{
		height: 100%;
		max-height: 100%;
		overflow-y: scroll;
		scrollbar-width: none;
	}
	.playlist_items_wrapper::-webkit-scrollbar{ display: none; }
	.playlist_items{
		max-height: 100%;
		min-width: 0;
	}
	.playlist_item{
		cursor: pointer;
		padding: 0.75em;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}

	/* ---- Player ---- */
	.player{
		padding: 0 1em 0.5em 1em ;
		/* Required for text-overflow to do anything */
		min-width: 0;
	}
	.info{
		padding-bottom : 1em;
		text-overflow: ellipsis;
		/* Required for text-overflow to do anything */
		white-space: nowrap;
		overflow: hidden;
	}
	.progress{ align-items : 1em; }
	progress {
		border: 0;
		display: block;
		width: 100%;
		height: 1em;
		-webkit-appearance: none;
		appearance: none;
	}
	.controls{
		padding-top: 0.5em;
	}
	.flexbox{ display:flex; }
	.flexbox button{ 
		flex: 1 1 0px; 
		margin: 0.125em; 
	}
	.player button{
		font-family: inherit;
		font-size: 1.2em;
		height: 2.5em;
		cursor: pointer;
		border-radius: 0;
		outline: none;				
	}
	.player button::-moz-focus-inner {
		border: 0;
		padding: 1em;
	}

	@media (max-width: 640px) {
		.container { padding: 0; }
	}
</style>