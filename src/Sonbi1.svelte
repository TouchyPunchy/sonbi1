<script>
	import '@fortawesome/fontawesome-free/js/fontawesome.min.js';
	import '@fortawesome/fontawesome-free/js/solid.min.js';
	import { onMount } from 'svelte';
	import { quintOut } from 'svelte/easing';
	import Visualizer from './Visualizer.svelte';
	import Themes from './Themes.svelte';
	import KeyBindings from './KeyBindings.svelte';
	import About from './About.svelte';
	import { current_theme, themes } from './stores.js';
	export let path_to_music = 'sounds';

	const playlist_file_name = 'playlist.json';
	const step = 5; 

	let audio;
	let audio_ctx;
	let media_source;
	let time = 0;
	let duration; 
	let paused = true;
	let volume = 0.5;
	let volume_save = volume;
	let mute = false;
	let loop = false;
	let shuffle = false;
	let viz = false;

	let progress_indicator;
	let progress_indicator_value = 0;
	let progress_indicator_visible = false;
	let progress_indicator_top = 0;
	let progress_indicator_left = 0;

	let folders = [];
	let tracks = [];
	let track_index = 0;

	let touch_screenX;
	let touch_screenY;
	let touch_clientX;
	let touch_clientY;
	let touch_target;

	let key;
	let key_code;

	let menu = false;
	let show_themes = false;
	let show_keybindings = false;
	let show_about = false;
	let deferred_prompt;
	let show_install_button = false;

	$: current_sound = (tracks != null && tracks[track_index] != null) 
		? tracks[track_index] 
		: '';
	$: current_sound_src = (tracks != null && tracks[track_index] != null) 
		? path_to_music + '/' + tracks[track_index] 
		: '';

	onMount(() => {
		init_playlist(path_to_music);
		init_mediasession();
		init_service_worker();
	});

	function init_audio_context(){
		let options = { 
			sampleRate: 44100 // defaut sampleRate : 48000 vs 44100 for mp3
		}; 
		audio_ctx = new (window.AudioContext || window.webkitAudioContext)(options);
		media_source = audio_ctx.createMediaElementSource(audio);
		media_source.connect(audio_ctx.destination);
	}

	function init_playlist(path){
		path_to_music = path;
		fetch(path_to_music + '/' + playlist_file_name +'?v='+Math.random())
		.then((resp) => resp.json())
		.then(function(response){
			folders = (response.folders != null) ? response.folders : [];
			tracks = response.songs;
			if(tracks[track_index] != null){
				audio = document.getElementById('audio');
				audio.src = path_to_music + '/' + tracks[track_index];
			}
		})
		.catch((error)=> {
			console.error('Error: no ['+ playlist_file_name +'] file found in path_to_music ['+ path_to_music +']')
		});
	}

	function init_mediasession(){
		if('mediaSession' in navigator){
			navigator.mediaSession.setActionHandler('play',  function() { paused = false; })
			navigator.mediaSession.setActionHandler('pause', function() { paused = true; });
			navigator.mediaSession.setActionHandler('seekbackward', function() { backward(); });
			navigator.mediaSession.setActionHandler('seekforward', function() { forward(); });
			navigator.mediaSession.setActionHandler('previoustrack', function() { previous_track(); });
			navigator.mediaSession.setActionHandler('nexttrack', function() { next_track(); });
		}
	}

	function init_service_worker(){
		if('serviceWorker' in navigator){
			navigator.serviceWorker
			.register('service_worker.js')
			.then(function(reg){
				//console.log('Service worker successfully registered');
			}).catch(function(err){
				console.log('Error registering service worker : ' + err);
			});
		}
	}

	function set_metadata(title){
		if('mediaSession' in navigator){
			let artwork_path = window.location.href + encodeURI(path_to_music) + '/cover.png';
			navigator.mediaSession.metadata = new MediaMetadata({
				title: title,
				artist: "Label Carrote",
				//album: "Podcast Name",
				artwork: [{ src: artwork_path }]
			});
		}
	}

	function toggle_play_pause(){
		paused = !paused;
	}

	function stop(){
		audio.pause();
		audio.currentTime = 0;
	}

	function previous_track(){
		track_index = (track_index === 0 ) ? tracks.length - 1 : track_index - 1 ;
		play_sound(track_index);
		scroll_to_sound();
	}

	function next_track(){
		if(loop === false) track_index = (track_index + 1) % tracks.length;
		if(shuffle === true) track_index = Math.floor(Math.random() * tracks.length);
		play_sound(track_index);
		scroll_to_sound();
	}

	function backward(){
		audio.currentTime = (audio.currentTime - step < 0) ? 0 : audio.currentTime - step;
	}
	  
	function forward(){
		if(audio.currentTime + step < audio.duration) audio.currentTime += step;
	}

	function volume_up(){
		if(volume + 0.1 <= 1) volume += 0.1;
	}

	function volume_down(){
		if(volume - 0.1 >= 0) volume -= 0.1;
	}

	function toggle_shuffle(){
		shuffle = !shuffle;
	}

	function toggle_loop(){
		loop = !loop;
	}

	function toggle_volume_mute(){
		if(mute === false){
			volume_save = volume;
			volume = 0;
		}else{
			volume = volume_save;
		}
		mute = !mute;
	}

	function toggle_viz(){
		if(!audio_ctx) init_audio_context();
		viz = !viz;
	}

	function toggle_menu(e){
		e.stopPropagation();
		menu = !menu;
	}

	function toggle_themes(){
		show_themes = !show_themes;
	}
	function toggle_keybindings(){
		show_keybindings = !show_keybindings;
	}
	function toggle_about(){
		show_about = !show_about;
	}

	function format(seconds) {
		if (isNaN(seconds)) return '...';
		const minutes = Math.floor(seconds / 60);
		seconds = Math.floor(seconds % 60);
		if (seconds < 10) seconds = '0' + seconds;
		return `${minutes}:${seconds}`;
	}

	function handle_close(event){
		switch(event.detail.page){
			case 'themes' : toggle_themes(); break;
			case 'keybindings' : toggle_keybindings(); break;
			case 'about' : toggle_about(); break;
		}
	}
	
	function handle_mouseout(e){
		progress_indicator_visible = false;
	}

	function handle_mousemove(e) {
		if (!duration) return; // audio not loaded yet
		const { width } = progress_indicator.getBoundingClientRect();
		const { left, right, top } = this.getBoundingClientRect();
		progress_indicator_top = 'calc('+ top +'px - 2.575rem)';
		progress_indicator_left = e.clientX - width / 2;
		progress_indicator_value = duration * (e.clientX - left) / (right - left);
		progress_indicator_visible = true;
		if (!(e.buttons & 1)) return; // mouse button not down
		time = progress_indicator_value;
	}

	function handle_touchmove(e) {
		if(e.changedTouches.length > 0){
			let touch = e.changedTouches[0];
			touch_screenX = touch.screenX;
			touch_screenY = touch.screenY;
			touch_clientX = touch.clientX;
			touch_clientY = touch.clientY;
			touch_target = touch.target;
		}
		let mouseEv;
		switch(e.type) {
			case 'touchstart': mouseEv = 'mousedown'; break;  
			case 'touchend': mouseEv = 'mouseup'; progress_indicator_visible = false; break;
			case 'touchmove':  mouseEv = 'mousemove'; break;
			default: return;
		}
		let mouseEvent = new MouseEvent(mouseEv,{ 
			screenX: touch_screenX, 
			screenY: touch_screenY,
			clientX: touch_clientX,
			clientY: touch_clientY,
			button: 0,
			buttons: 1
		});
		touch_target.dispatchEvent(mouseEvent);
		e.preventDefault();
	}

	function handle_keydown(event) {
		key_code = event.keyCode;
		key = event.key;
		switch(key){
			case 'x': toggle_play_pause(); break;
			case 'c': stop(); break;
			case 'b': previous_track(); break;
			case 'n': next_track(); break;
			case 's': toggle_shuffle(); break;
			case 'l': toggle_loop(); break;
			case 'm': toggle_mute(); break;
			case 'v': toggle_viz(); break;
			case 'ArrowRight': forward(); break;
			case 'ArrowLeft': backward(); break;
			case 'ArrowUp': volume_up(); break;
			case 'ArrowDown': volume_down(); break;
			default: break;
		}
	}

	function play_sound(sound_index){
		track_index = sound_index;
		audio.src = path_to_music + '/' + tracks[track_index];
		audio.play()
		.then(_ => { set_metadata(tracks[track_index]); });
	}

	// ---- PWA ----
	
	function save_install_prompt(event){
		event.preventDefault();
		show_install_button = true;
		deferred_prompt = event;
	}

	function show_install_prompt(){
		if(deferred_prompt != null){
			show_install_button = false;
			deferred_prompt.prompt();
			deferred_prompt.userChoice
			.then((choice) => {
				console.log(
					(choice.outcome === 'accepted') 
					? 'User accepted installation' 
					: 'User dismissed installation'
				);
				deferred_prompt = null;
			});
		}
	}

	// ---- Helpers ----

	function scroll_to_sound(){
		let elt = document.getElementById('item_' + track_index);
		elt.scrollIntoView({behavior: "smooth"});
	}

	function filename(path){
		return path.replace(/^.*[\\\/]/, '')
	}

	function breadcrumbs(path){
		if(path == null) return [];
		let splits = path.split('\/');
		let crumbs = [];
		let temp_path = '';
		let i = 0;
		for(const split of splits){
			temp_path = (i === 0) ? split : temp_path + '/' + split;
			crumbs.push(temp_path);
			i = i + 1;
		}
		return crumbs;
	}
	function handle_click(e){
		// close menu
		menu = false;
	}

	function scale_from_angle(node, { duration }) {
		return {
			duration,
			css: t => {
				const quint = quintOut(t);
				return `
					transform-origin: top right;
					transform: scale(${quint});
					`;
			}
		};
	}
</script>

<svelte:window 
	on:keydown={handle_keydown}
	on:click={handle_click}
	on:beforeinstallprompt={save_install_prompt}/>

<div bind:this={progress_indicator} 
	class="progress_indicator"
	class:hidden={progress_indicator_visible === false}
	style="top: {progress_indicator_top}; left:{progress_indicator_left}px">
	<strong>{format(progress_indicator_value)}</strong>
</div>
<div class="container">
	{#if show_themes === true}
	<Themes on:close={handle_close}/>
	{/if}
	{#if show_keybindings === true}
	<KeyBindings on:close={handle_close}/>
	{/if}
	{#if show_about === true}
	<About on:close={handle_close}/>
	{/if}
	<div class="grid">	
		{#if menu}
			<div class="menu pointer" 
				in:scale_from_angle="{{duration: 200}}"
				out:scale_from_angle="{{duration: 200}}"
				on:click={e => e.stopPropagation()}>
				<div class="menu-item"
					on:click={toggle_themes}>
					Color Themes
				</div>
				<div class="menu-item"
					on:click={toggle_keybindings}>
					Key Bindings
				</div>
				{#if show_install_button === true}
				<div class="menu-item"
					on:click={show_install_prompt}>
					Install App
				</div>
				{/if}
				<div class="menu-item"
					on:click={toggle_about}>
					About
				</div>
			</div>
		{/if}
		<div class="header bg-dark text-light">
			<div class="breadcrumbs">
				<span><i class='fas fa-folder-open'></i></span>
				{#each breadcrumbs(path_to_music) as crumb} 
				/ 
				<span class="breadcrumb pointer text-primary-hover" 
					on:click={init_playlist(crumb)}>
					{filename(crumb)}
				</span>
				{/each}
			</div>
			<button class="pointer" on:click={e => toggle_menu(e)}>
				<i class="fas fa-ellipsis-v"></i>
			</button>
		</div>
		<div class="playlist bg-dark">
			<div class="playlist_items_wrapper bg-light text-dark">
				<div class="playlist_items">
					{#each folders as folder}
					<div class="playlist_item text-light bg-secondary" 
						on:click={init_playlist(folder)}>
						<i class='fas fa-folder'></i> {filename(folder)}
					</div>
					{/each}
					{#each tracks as track,i}
					<div class="playlist_item" 
						id="item_{i}"
						class:selected={track_index === i} 
						on:click={() => play_sound(i)}>
						{i+1}. {track}
					</div>
					{/each}
				</div>
			</div>
		</div>
		<div class="player bg-dark"> 
			<audio id="audio"
				on:ended={next_track}
				bind:paused 
				bind:volume 
				bind:duration
				bind:currentTime={time}
				></audio>
			{#if viz === true}
			<Visualizer bind:audio_ctx bind:media_source />
			{/if}
			<div class="info text-light">
				<span class="time"><strong>{format(time)} / {format(duration)}</strong> | </span>{current_sound}
			</div>
			<div class="progress">
				<progress class="bg-light"
					value="{(time / duration) || 0}"
					on:mousemove={handle_mousemove}
					on:touchstart={handle_touchmove}
					on:touchmove={handle_touchmove} 
					on:touchend={handle_touchmove}
					on:mouseout={handle_mouseout} />
			</div>
			<div class="controls">
				<div class="flexbox">
					<button title="Previous track" 
						on:click={previous_track}><i class='fas fa-step-backward'></i></button> 
					<button title="Play / Pause"
						on:click={toggle_play_pause}>
					{#if paused === true}
						<span><i class='fas fa-play'></i></span>
					{:else}
						<span><i class='fas fa-pause'></i></span>
					{/if}
					</button> 
					<button title="Stop"
						on:click={stop}><i class='fas fa-stop'></i></button> 
					<button title="Next track"
						on:click={next_track}><i class='fas fa-step-forward'></i></button> 
				</div>
				<div class="flexbox">
					<button title="Shuffle"
						class:bg-primary={shuffle} 
						on:click={toggle_shuffle}><i class='fas fa-random'></i></button> 
					<button title="Loop track"
						class:bg-primary={loop} 
						on:click={toggle_loop}><i class='fas fa-redo'></i></button> 
					<button title="Mute / Unmute" 
						class:bg-primary={mute} 
						on:click={toggle_volume_mute}><i class='fas fa-volume-mute'></i></button> 
					<button title="Visualization" 
						class:bg-primary={viz} 
						on:click={toggle_viz}><i class='fas fa-signal'></i></button> 
				</div>
			</div>
		</div>
	</div>
</div>
<style>
	.hidden { visibility: hidden; }
	/* ---- Colors / Pointers ---- */
	:root{
		--light-color: white;
		--dark-color: #2b2b2b;
		--primary-color: #ff9900;
		--secondary-color: #393939;
	}
	.text-light{ color: var(--light-color); }
	.text-dark{ color: var(--dark-color); }
	.bg-primary, .selected{ background-color: var(--primary-color); }
	.bg-secondary{ background-color: var(--secondary-color); }
	.bg-dark{ background-color: var(--dark-color); }
	.bg-light{ background-color: var(--light-color); }
	a{ color: var(--primary-color); }
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
	.text-primary-hover:hover{ color: var(--primary-color); }

	.pointer { cursor: pointer; }

	/* ---- Container ---- */
	.container{
		position: relative;
		padding: 1rem;
		height: 100vh;
		box-sizing: border-box;
	}
	.container .grid{
		display: grid;
		height: 100%;
		grid-template-rows: auto 1fr auto;
	}

	/* ---- Header ---- */
	.header{ 
		display: grid;
		padding: 0 0 0 1rem;
		grid-template-columns: 1fr auto;
	 }
	.breadcrumbs{ 
		padding: 1rem 1rem 0 0;
	}

	.header button{
		padding: 1rem 2rem 1rem 2rem;
		font-size: 1rem;
	}

	/** ---- Menu ---- **/
	.menu{
		background-color: var(--dark-color);
		position: absolute;
		box-sizing: border-box;
		top: 4.225rem;
		right: 2rem;
		width: auto;
		overflow: hidden;
	}
	.menu-item{
		padding: 1rem;
		color: var(--light-color);
	}
	.menu-item:hover{
		color: var(--primary-color);
	}

	/* ---- Playlist ---- */
	.playlist{
		overflow: hidden;
		padding: 0 1rem 1rem 1rem;
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
		padding: 0.75rem;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}

	/* ---- Player ---- */
	.player{
		padding: 0 1rem 1rem 1rem ;
		/* Required for text-overflow to do anything */
		min-width: 0;
	}
	.info{
		padding-bottom : 1rem;
		text-overflow: ellipsis;
		/* Required for text-overflow to do anything */
		white-space: nowrap;
		overflow: hidden;
	}
	.progress{ align-items : 1rem; }
	progress {
		border: 0;
		display: block;
		width: 100%;
		height: 1rem;
		-webkit-appearance: none;
		appearance: none;
	}
	.progress_indicator{
		position: absolute;
		padding: 0.25rem;
		color: var(--dark-color);
		background-color: var(--primary-color);
		z-index: 1;
	}
	.controls{
		padding-top: 1rem;
	}
	.flexbox{ display:flex; }
	.flexbox button{ 
		flex: 1 1 0px; 
		margin: 0.125rem; 
	}
	.player button{
		font-family: inherit;
		font-size: 1.5rem;
		height: 3.5rem;
		cursor: pointer;
		border-radius: 0;
		outline: none;				
	}
	.player button::-moz-focus-inner {
		border: 0;
		padding: 1rem;
	}

	@media (max-width: 640px) {
		.container { padding: 0; }
		.menu { top: 3.225rem; right: 1rem;}
	}
</style>