<script>
    const BASE_PITCH = 1.0;
    const BASE_RATE = 1.0;

    let isMediaRecorderSupported = "MediaRecorder" in window;
    let isMediaDevicesSupported = navigator.mediaDevices && navigator.mediaDevices.enumerateDevices;

    let fileCounter = 0;
    let selectedDeviceId = "";
    let availableOutputDevices = [];

    let fileExt = "webm";
    let mimeType = "audio/webm; codecs=opus";

    let mediaRecorder;
    let isRecording = false;

    async function initialize() {
        if (!isMediaRecorderSupported || !isMediaDevicesSupported) {
            return;
        }
        if (!MediaRecorder.isTypeSupported("audio/webm; codecs=opus")) {
            fileExt = "ogg";
            mimeType = "audio/ogg; codecs=opus";
        }
        await navigator.mediaDevices.getUserMedia({audio: true});
        let devices = await navigator.mediaDevices.enumerateDevices();
        availableOutputDevices = devices.filter(device => device.kind === "audioinput");
        if (!availableOutputDevices || availableOutputDevices.length === 0) {
            isMediaDevicesSupported = false;
            return;
        }

        selectedDeviceId = availableOutputDevices[0].deviceId;
    }

    initialize();

    async function startRecording() {
        if (!selectedDeviceId) {
            isOutputStreamNotSupported = true;
        }

        let chunks = [];
        const constraints = {audio: {deviceId: {exact: selectedDeviceId}}};

        let stream = await navigator.mediaDevices.getUserMedia(constraints);

        mediaRecorder = new MediaRecorder(stream, {
            mimeType: mimeType,
            bitsPerSecond: 256 * 8 * 1024
        });

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                chunks.push(event.data);
            }
        };
        mediaRecorder.onstop = () => {
            let blob = new Blob(
                    chunks,
                    {type: mimeType}
            );
            isRecording = false;
            stream.getAudioTracks().forEach(track => track.stop());
            saveData(blob);
        };
        mediaRecorder.onerror = (error) => {
            console.log(error);
        };

        mediaRecorder.start();
        isRecording = true;
    }

    function stopRecording() {
        if (mediaRecorder.state === "recording") {
            mediaRecorder.stop();
        }
    }

    function saveData(blob) {
        let fileName = `audio_${fileCounter}.${fileExt}`;
        let blobUrl = URL.createObjectURL(blob);
        let a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        a.href = blobUrl;
        a.download = fileName;
        a.click();
    }

</script>


<div class="container">
    {#if isMediaRecorderSupported && isMediaDevicesSupported}

        <div class="section">
            <label>
                <span class="text-label mr-5">Select Microphone</span>
                <select class="voices" bind:value={selectedDeviceId}>
                    {#each availableOutputDevices as {label, deviceId, kind}}
                        <option value={deviceId}>
                            {label} - {kind} - {deviceId}
                        </option>
                    {/each}
                </select>
            </label>
        </div>

        <div class="section justify-content-center confirm">
            {#if isRecording}
                <button class="primary" on:click={stopRecording}>
                    <span>Stop</span>
                </button>
            {:else}
                <button class="primary" on:click={startRecording}>
                    <span>Record</span>
                </button>
            {/if}
        </div>

    {:else}
        <h2>getUserMedia or MediaRecording API are not supported by your browser</h2>
    {/if}
</div>




