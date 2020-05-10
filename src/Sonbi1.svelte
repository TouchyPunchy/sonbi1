<script>
	import '@fortawesome/fontawesome-free/js/fontawesome.min.js';
	import '@fortawesome/fontawesome-free/js/solid.min.js';
	import { onMount } from 'svelte';
	import Visualizer from './Visualizer.svelte';

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

	let folders = [];
	let sounds = [];
	let current_sound_index = 0;

	let touch_screenX;
	let touch_screenY;
	let touch_clientX;
	let touch_clientY;
	let touch_target;

	let key;
	let key_code;

	$: current_sound = (sounds != null && sounds[current_sound_index] != null) 
		? sounds[current_sound_index] 
		: '';
	$: current_sound_src = (sounds != null && sounds[current_sound_index] != null) 
		? path_to_music + '/' + sounds[current_sound_index] 
		: '';

	onMount(() => {
		init_playlist(path_to_music);
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
			sounds = response.songs;
			if(sounds[current_sound_index] != null){
				audio = document.getElementById('audio');
				audio.src = path_to_music + '/' + sounds[current_sound_index];
			}
		})
		.catch((error)=> {
			console.error('Error: no ['+ playlist_file_name +'] file found in path_to_music ['+ path_to_music +']')
		});
	}

	function toggle_play_pause(){
		paused = !paused;
	}

	function stop(){
		audio.pause();
		audio.currentTime = 0;
	}

	function previous_sound(){
		current_sound_index = (current_sound_index === 0 ) ? sounds.length - 1 : current_sound_index - 1 ;
		play_sound(current_sound_index);
		scroll_to_sound();
	}

	function next_sound(){
		if(loop === false) current_sound_index = (current_sound_index + 1) % sounds.length;
		if(shuffle === true) current_sound_index = Math.floor(Math.random() * sounds.length);
		play_sound(current_sound_index);
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
		viz = ! viz;
	}

	function format(seconds) {
		if (isNaN(seconds)) return '...';
		const minutes = Math.floor(seconds / 60);
		seconds = Math.floor(seconds % 60);
		if (seconds < 10) seconds = '0' + seconds;
		return `${minutes}:${seconds}`;
	}
	
	function handle_mousemove(e) {
		if (!(e.buttons & 1)) return; // mouse not down
		if (!duration) return; // audio not loaded yet
		const { left, right } = this.getBoundingClientRect();
		time = duration * (e.clientX - left) / (right - left);
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
			case 'touchend': mouseEv = 'mouseup'; break;
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
			case 'b': previous_sound(); break;
			case 'n': next_sound(); break;
			case 's': toggle_shuffle(); break;
			case 'l': toggle_loop(); break;
			case 'm': toggle_mute(); break;
			case 'v': toggle_viz(); break;
			case 'ArrowRight': forward(); break;
			case 'ArrowLeft': backward(); break;
			default: break;
		}
	}

	function play_sound(sound_index){
		current_sound_index = sound_index;
		audio.src = path_to_music + '/' + sounds[current_sound_index];
		audio.play();
	}

	function scroll_to_sound(){
		let elt = document.getElementById('item_' + current_sound_index);
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
</script>

<svelte:window on:keydown={handle_keydown}/>
<div class="container">
	<div class="breadcrumbs bg-dark text-light">
		<span><i class='fas fa-folder-open'></i></span>
		{#each breadcrumbs(path_to_music) as crumb} 
		/ 
		<span class="breadcrumb pointer text-primary-hover" 
			on:click={init_playlist(crumb)}>
			{filename(crumb)}
		</span>
		{/each}
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
				{#each sounds as sound,i}
				<div class="playlist_item" 
					id="item_{i}"
					class:selected={current_sound_index === i} 
					on:click={() => play_sound(i)}>
					{i+1}. {sound}
				</div>
				{/each}
			</div>
		</div>
	</div>
	<div class="player bg-dark"> 
		<audio id="audio"
			on:ended={next_sound}
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
				on:touchend={handle_touchmove}/>
		</div>
		<div class="controls">
			<div class="flexbox">
				<button title="Previous track" 
					on:click={previous_sound}><i class='fas fa-step-backward'></i></button> 
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
					on:click={next_sound}><i class='fas fa-step-forward'></i></button> 
			</div>
			<div class="flexbox">
				<button title="Toggle Shuffle"
					class:bg-primary={shuffle} 
					on:click={toggle_shuffle}><i class='fas fa-random'></i></button> 
				<button title="Toggle Track Loop"
					class:bg-primary={loop} 
					on:click={toggle_loop}><i class='fas fa-redo'></i></button> 
				<button title="Mute / Unmute" 
					class:bg-primary={mute} 
					on:click={toggle_volume_mute}><i class='fas fa-volume-mute'></i></button> 
				<button title="Toggle Waveform" 
					class:bg-primary={viz} 
					on:click={toggle_viz}><i class='fas fa-signal'></i></button> 
			</div>
		</div>
	</div>  
</div>
<style>
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
	button{
		background-color: var(--dark-color);
		color: var(--light-color);
		border: var(--dark-color) 1px solid;
	}
	button:focus{ border: var(--primary-color) 1px solid; }
	progress::-webkit-progress-bar { background-color: var(--light-color); }
	progress::-moz-progress-bar { background-color: var(--primary-color); }
	progress::-webkit-progress-value { background-color: var(--primary-color); }
	.text-primary-hover:hover{ color: var(--primary-color); }

	.pointer { cursor: pointer; }

	/* ---- Container ---- */
	.container{
		display: grid;
		height: 100vh;
		padding: 1rem;
		box-sizing: border-box;
		grid-template-rows: auto 1fr auto;
	}

	/* ---- Breadcrumbs ---- */
	.breadcrumbs{ padding: 1rem 0 0 1rem; }

	/* ---- Playlist ---- */
	.playlist{
		overflow: hidden;
		padding: 1rem;
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
	.progress{ padding-bottom : 1rem; }
	progress {
		border: 0;
		display: block;
		width: 100%;
		height: 1rem;
		-webkit-appearance: none;
		appearance: none;
	}
	.flexbox{ display:flex; }
	.flexbox button{ 
		flex: 1 1 0px; 
		margin: 0.25rem; 
	}
	button{
		font-family: inherit;
		font-size: 1.5rem;
		height: 3.5rem;
		cursor: pointer;
		border-radius: 0;
		outline: none;				
	}
	button::-moz-focus-inner {
		border: 0;
		padding: 1rem;
	}

	@media (max-width: 640px) {
		.container { padding: 0; }
	}
</style>