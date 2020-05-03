<script>
    import { onMount } from 'svelte';

    // https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API
    const bg_color = '#2b2b2b';
    const stroke_color = '#ff9900';
    let viz_index = 0;
    let canvas;
    let ctx;
    let w;
    let h;
    let audioCtx;
    let source;
    let analyser;

    onMount(() => {
        canvas = document.getElementById('viz');
        ctx = canvas.getContext('2d');
        w = ctx.canvas.width;
        h = ctx.canvas.height;
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        audioCtx.resume();
        source = audioCtx.createMediaElementSource(audio);
        analyser = audioCtx.createAnalyser();
        analyser.minDecibels = -90;
        analyser.maxDecibels = 0;
        source.connect(analyser);
        source.connect(audioCtx.destination);
        draw_viz();
    });

    function draw_viz(){
        if(viz_index === 0){
            draw_waveform();
            viz_index += 1;
        }else{
            draw_frequencybars();
            viz_index = 0;
        }
    }

    function draw_waveform(){
        analyser.fftSize = 2048;
        let bufferLength = analyser.frequencyBinCount;
        let dataArray = new Uint8Array(bufferLength);
        analyser.getByteTimeDomainData(dataArray);
        ctx.clearRect(0, 0, w, h);
        function draw() {
            let drawVisual = requestAnimationFrame(draw);
            analyser.getByteTimeDomainData(dataArray);
            ctx.fillStyle = bg_color;
            ctx.fillRect(0, 0, w, h);
            ctx.lineWidth = 3;
            ctx.strokeStyle = stroke_color;
            ctx.beginPath();
            let sliceWidth = w * 1.0 / bufferLength;
            let x = 0;
            for(let i = 0; i < bufferLength; i++) {
                let v = dataArray[i] / 128.0 ;
                let y = v * h / 2;
                if(i === 0)
                    ctx.moveTo(x, y);
                else
                    ctx.lineTo(x, y);
                x += sliceWidth;
            }
            ctx.lineTo(w, h / 2);
            ctx.stroke();
        }
        draw();
    }

    function draw_frequencybars(){
        analyser.fftSize = 256;
        let bufferLength = analyser.frequencyBinCount;
        let dataArray = new Uint8Array(bufferLength);
        ctx.clearRect(0, 0, w, h);

        function draw() {
            let drawVisual = requestAnimationFrame(draw);
            analyser.getByteFrequencyData(dataArray);
            ctx.fillStyle = bg_color;
            ctx.fillRect(0, 0, w, h);
            let barWidth = (w / bufferLength) * 2.5;
            let barHeight;
            let x = 0;
            for(var i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i] / 2;
                ctx.fillStyle = 'rgb(' + (barHeight + 100) + ',100,00)';
                ctx.fillRect(x,h - barHeight / 2,barWidth,barHeight);
                x += barWidth + 1;
            }
        }
        draw();
    }
</script>
    <canvas id="viz" on:click={draw_viz}></canvas>
<style>
    #viz{
        margin-top: 0.5em;
        margin-bottom: 0.5em;
        width: 100%;
        height: 2em;
    }
</style>