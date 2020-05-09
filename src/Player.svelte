<script>
    import { onMount } from 'svelte';
    import Visualizer from './Visualizer.svelte';

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

    let folder = "sounds";
    let sounds = [];

    let current_sound_index = 0;
    $: current_sound_src = (sounds != null && sounds[current_sound_index] != null) 
        ? folder + "/" + sounds[current_sound_index] 
        : "";

    let touch_screenX;
    let touch_screenY;
    let touch_clientX;
    let touch_clientY;
    let touch_target;

    onMount(() => {
        fetch('playlist.json')
        .then((resp) => resp.json())
        .then(function(response){
            sounds = response.songs;
            if(sounds[current_sound_index] != null){
                audio = document.getElementById('audio');
                audio.src = folder + "/" + sounds[current_sound_index];
                
            }
        });
    });

    function init_audio_context(){
        let options = { sampleRate: 44100 }; // defaut sampleRate : 48000 vs 44100 for mp3
        audio_ctx = new (window.AudioContext || window.webkitAudioContext)(options);
        // console.log(audio_ctx.sampleRate);
        media_source = audio_ctx.createMediaElementSource(audio);
        media_source.connect(audio_ctx.destination);
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

    function volume_up(){
        if(volume + 0.1 <= 1) volume += 0.1;
    }

    function volume_down(){
        if(volume - 0.1 >= 0) volume -= 0.1;
    }

    function format(seconds) {
		if (isNaN(seconds)) return '...';
		const minutes = Math.floor(seconds / 60);
		seconds = Math.floor(seconds % 60);
		if (seconds < 10) seconds = '0' + seconds;
		return `${minutes}:${seconds}`;
    }
    
    function handleMousemove(e) {
		if (!(e.buttons & 1)) return; // mouse not down
        if (!duration) return; // video not loaded yet
		const { left, right } = this.getBoundingClientRect();
		time = duration * (e.clientX - left) / (right - left);
    }

    function handleTouchmove(e) {
        if(e.changedTouches.length > 0){
            let theTouch = e.changedTouches[0];
            touch_screenX = theTouch.screenX;
            touch_screenY = theTouch.screenY;
            touch_clientX = theTouch.clientX;
            touch_clientY = theTouch.clientY;
            touch_target = theTouch.target;
        }
        let mouseEv;
        switch(e.type)
        {
            case "touchstart": mouseEv="mousedown"; break;  
            case "touchend":   mouseEv="mouseup"; break;
            case "touchmove":  mouseEv="mousemove"; break;
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

    function play_sound(sound_index){
        current_sound_index = sound_index;
        audio.src = folder + "/" + sounds[current_sound_index];
        audio.play();
    }

    function scroll_to_sound(){
        let elt = document.getElementById("item_"+current_sound_index);
        elt.scrollIntoView({behavior: "smooth"});
    }
</script>

<div class="container">
    
    <div class="playlist bg-dark text-light">
        <div class="playlist_items_wrapper">
            <div class="playlist_items bg-light text-dark">
                {#each sounds as sound, i }
                    <div class="playlist_item" id="item_{i}" class:selected={ current_sound_index === i} on:click={() => play_sound(i)}>{i+1}. {sound}</div>
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
        <Visualizer bind:audio_ctx bind:media_source/>
        {/if}
        <div class="info text-light">
            <span class="time"><strong>{format(time)} / {format(duration)}</strong> | </span>{current_sound_src}
        </div>
        <div class="progress">
            <progress class="bg-light"
                value="{(time / duration) || 0}"
                on:mousemove={handleMousemove}
                on:touchstart={handleTouchmove}
                on:touchmove={handleTouchmove} 
                on:touchend={handleTouchmove}/>
        </div>
        <div class="controls">
            <div class="flexbox">
                <button on:click={previous_sound}><i class='fas fa-step-backward'></i></button> 
                <button on:click={toggle_play_pause}>
                {#if paused === true}
                    <span><i class='fas fa-play'></i></span>
                {:else}
                    <span><i class='fas fa-pause'></i></span>
                {/if}
                </button> 
                <button on:click={stop}><i class='fas fa-stop'></i></button> 
                <button on:click={next_sound}><i class='fas fa-step-forward'></i></button> 
            </div>
            <div class="flexbox">
                <button class:bg-primary={shuffle} on:click={toggle_shuffle}><i class='fas fa-random'></i></button> 
                <button class:bg-primary={loop} on:click={toggle_loop}><i class='fas fa-redo'></i></button> 
                <button class:bg-primary={mute} on:click={toggle_volume_mute}><i class='fas fa-volume-mute'></i></button> 
                <button class:bg-primary={viz} on:click={toggle_viz}><i class='fas fa-signal'></i></button> 
                <!-- <button on:click={volume_down}><i class='fas fa-volume-down'></i></button> 
                <button on:click={volume_up}><i class='fas fa-volume-up'></i></button> -->
            </div>
        </div>
    </div>  
</div>
<style>
    :root{
        --text-light-color: white;
        --text-dark-color: #2b2b2b;
        --text-primary-color: #ff9900;
        --bg-light-color: white;
        --bg-dark-color: #2b2b2b;
        --bg-primary-color: #ff9900;
    }
    .text-light{ color: var(--text-light-color); }
    .text-dark{ color: var(--text-dark-color); }
    .bg-primary, .selected{ background-color: var(--bg-primary-color); }
    .bg-dark{ background-color: var(--bg-dark-color); }
    .bg-light{ background-color: var(--bg-light-color); }

    button{
        background-color: var(--bg-dark-color);
        color: var(--text-light-color);
    }

    button{
        height: 3em;
        cursor: pointer;
        border: #2b2b2b 1px solid;
        border-radius: 0;
    }
    button:focus{
        outline:none;
        border: #ff9900 1px solid;
    }
    button::-moz-focus-inner {
        border: 0;
        padding: 1em;
    }
    .container{
        display: grid;
        height: 100vh;
        padding: 0.5em 1em 1em 1em;
        box-sizing: border-box;
        /* grid-template-rows: [row1-start] auto [row1-end] 1fr [last-line]; */
        grid-template-rows: [row1-start] 1fr [row1-end] auto [last-line];
    }
    /* ---- Player ---- */
	.player{
        padding: 0em 1em 1em 1em ;
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
    .progress{ padding-bottom : 1em; }
    progress {
        border: 0;
		display: block;
		width: 100%;
		height: 1em;
		-webkit-appearance: none;
        appearance: none;
    }
	progress::-webkit-progress-bar { background-color: white; }
    progress::-moz-progress-bar { background-color: #ff9900; }
	progress::-webkit-progress-value { background-color: #ff9900; }
   
    .flexbox{
        display:flex;
    }
    .flexbox button{
        flex: 1 1 0px;
    }

    /* ---- Playlist ---- */
    .playlist{
        overflow: hidden;
        padding: 1em;
    }
    .playlist_items_wrapper{
        height: 100%;
        max-height: 100%;
        overflow-y: scroll;
        scrollbar-width: none;
        background-color: var(--bg-light-color)
    }
    .playlist_items_wrapper::-webkit-scrollbar{ display: none; }
    .playlist_items{
        max-height: 100%;
        min-width: 0;
    }
    .playlist_item{
        cursor: pointer;
        padding: 0.5em;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }

    @media (max-width: 640px) {
		.container {
			padding: 0;
		}
	}
</style>