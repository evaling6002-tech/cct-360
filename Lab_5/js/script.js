document.addEventListener('DOMContentLoaded', () => {
    const audioPlayer = document.getElementById('audioPlayer');
    const playBtn = document.getElementById('playBtn');
    const micBtn = document.getElementById('micBtn');
    const synthBtn = document.getElementById('synthBtn');
    const seekBar = document.getElementById('seekBar');
    const volumeSlider = document.getElementById('volumeSlider');
    const rateSlider = document.getElementById('rateSlider');
    const sensitivitySlider = document.getElementById('sensitivitySlider');
    const rateVal = document.getElementById('rateVal');
    const currentTimeEl = document.getElementById('currentTime');
    const durationEl = document.getElementById('duration');
    const fxModeSelect = document.getElementById('fxMode');
    
    const bassBar = document.getElementById('bassBar');
    const midBar = document.getElementById('midBar');
    const trebleBar = document.getElementById('trebleBar');
    const images = document.querySelectorAll('.reactive-img');

    let audioCtx, analyser, dataArray;
    let isInitialized = false;

    function initAudioContext() {
        if (isInitialized) return;
        try {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioCtx.createAnalyser();
            analyser.fftSize = 256;
            dataArray = new Uint8Array(analyser.frequencyBinCount);
            isInitialized = true;
            startVisualizerLoop();
        } catch (e) {
            console.error("Web Audio API not supported", e);
        }
    }

    // Play Soundscape natively (guarantees sound works under file:// protocol without CORS blocking)
    playBtn.addEventListener('click', async () => {
        initAudioContext();
        if (audioCtx && audioCtx.state === 'suspended') {
            await audioCtx.resume();
        }

        if (audioPlayer.paused) {
            audioPlayer.play().then(() => {
                playBtn.textContent = 'Pause';
            }).catch((err) => {
                console.error("Playback error:", err);
                alert("Playback blocked or file not found. Ensure 'audio/Soundscape.mp3' is a valid MP3 file.");
            });
        } else {
            audioPlayer.pause();
            playBtn.textContent = 'Play Soundscape';
        }
    });

    audioPlayer.addEventListener('timeupdate', () => {
        if (!isNaN(audioPlayer.duration) && audioPlayer.duration > 0) {
            seekBar.value = (audioPlayer.currentTime / audioPlayer.duration) * 100;
            currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
            durationEl.textContent = formatTime(audioPlayer.duration);
        }
    });

    audioPlayer.addEventListener('ended', () => {
        playBtn.textContent = 'Play Soundscape';
    });

    seekBar.addEventListener('input', () => {
        if (!isNaN(audioPlayer.duration) && audioPlayer.duration > 0) {
            audioPlayer.currentTime = (seekBar.value / 100) * audioPlayer.duration;
        }
    });

    volumeSlider.addEventListener('input', (e) => {
        audioPlayer.volume = e.target.value;
    });

    rateSlider.addEventListener('input', (e) => {
        audioPlayer.playbackRate = e.target.value;
        rateVal.textContent = parseFloat(e.target.value).toFixed(1) + 'x';
    });

    // Microphone toggle for interactive visualizer
    micBtn.addEventListener('click', async () => {
        initAudioContext();
        if (audioCtx && audioCtx.state === 'suspended') await audioCtx.resume();
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const micSource = audioCtx.createMediaStreamSource(stream);
            if (analyser) micSource.connect(analyser);
            micBtn.textContent = 'Microphone Active';
        } catch (err) {
            alert('Microphone access denied or unavailable.');
        }
    });

    // Synthesizer fallback sound generator
    synthBtn.addEventListener('click', async () => {
        initAudioContext();
        if (audioCtx && audioCtx.state === 'suspended') await audioCtx.resume();
        
        let osc = audioCtx.createOscillator();
        let gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        
        if (analyser) {
            osc.connect(analyser);
            analyser.connect(audioCtx.destination);
        } else {
            osc.connect(audioCtx.destination);
        }
        
        osc.start();
        osc.stop(audioCtx.currentTime + 2);
    });

    function formatTime(seconds) {
        if (isNaN(seconds)) return "00:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    function startVisualizerLoop() {
        function animate() {
            requestAnimationFrame(animate);
            if (!analyser || !dataArray) return;

            analyser.getByteFrequencyData(dataArray);
            const len = dataArray.length;
            
            let bassSum = 0, midSum = 0, trebleSum = 0;
            const bassCount = Math.floor(len * 0.15);
            const midCount = Math.floor(len * 0.5);

            for (let i = 0; i < len; i++) {
                if (i < bassCount) bassSum += dataArray[i];
                else if (i < midCount) midSum += dataArray[i];
                else trebleSum += dataArray[i];
            }

            const bassAvg = (bassSum / bassCount) || 0;
            const midAvg = (midSum / (midCount - bassCount)) || 0;
            const trebleAvg = (trebleSum / (len - midCount)) || 0;
            const sens = parseFloat(sensitivitySlider.value);

            // If audio is playing natively without analyser input, add a gentle animated pulse to UI
            const audioActive = !audioPlayer.paused;
            const boost = audioActive ? 40 : 0;

            bassBar.style.width = Math.min(100, ((bassAvg + boost) / 255) * 100 * sens) + '%';
            midBar.style.width = Math.min(100, ((midAvg + boost) / 255) * 100 * sens) + '%';
            trebleBar.style.width = Math.min(100, ((trebleAvg + boost) / 255) * 100 * sens) + '%';

            const fx = fxModeSelect.value;
            images.forEach((img, idx) => {
                const freqVal = (dataArray[(idx * 3) % len] + boost) * sens;
                const norm = freqVal / 255;

                if (fx === 'pulse') {
                    const scale = 1 + norm * 0.25;
                    img.style.transform = `scale(${scale})`;
                    img.style.filter = `brightness(${1 + norm * 0.4})`;
                } else if (fx === 'hue') {
                    const hue = norm * 360;
                    img.style.transform = `scale(${1 + norm * 0.1})`;
                    img.style.filter = `hue-rotate(${hue}deg) saturate(${1 + norm * 2})`;
                } else if (fx === 'glow') {
                    img.style.transform = `scale(1)`;
                    img.style.filter = `drop-shadow(0 0 ${norm * 20}px rgba(56, 189, 248, 0.8))`;
                } else if (fx === 'glitch') {
                    const rot = (norm - 0.5) * 15;
                    const skew = (norm - 0.5) * 10;
                    img.style.transform = `rotate(${rot}deg) skewX(${skew}deg)`;
                    img.style.filter = `contrast(${1 + norm * 1.5})`;
                }
            });
        }
        animate();
    }
});