<script>
    let isMediaRecorderSupported = "MediaRecorder" in window;
    let isMediaDevicesSupported = navigator.mediaDevices && navigator.mediaDevices.enumerateDevices;

    let fileCounter = 0;
    let selectedDeviceId = "";
    let availableOutputDevices = [];

    let fileExt;
    let mimeType;

    const opusWebm = "audio/webm; codecs=opus";
    const opusOgg = "audio/ogg; codecs=opus";

    let mediaRecorder;
    let isRecording = false;
    let currentConstraints = [];

    async function initialize() {
        if (!isMediaRecorderSupported || !isMediaDevicesSupported) {
            return;
        }
        if (MediaRecorder.isTypeSupported(opusWebm)) {
            fileExt = "webm";
            mimeType = "audio/webm; codecs=opus";
        } else if (MediaRecorder.isTypeSupported(opusOgg)) {
            fileExt = "ogg";
            mimeType = "audio/ogg; codecs=opus";
        } else {
            fileExt = "mp4";
            mimeType = "audio/mp4";
        }
        await navigator.mediaDevices.getUserMedia({audio: true});
        let devices = await navigator.mediaDevices.enumerateDevices();
        availableOutputDevices = devices.filter(device => device.kind === "audioinput");
        if (!availableOutputDevices || availableOutputDevices.length === 0) {
            isMediaDevicesSupported = false;
            return;
        }

        selectedDeviceId = availableOutputDevices[0].deviceId;

        let supportedContraints = navigator.mediaDevices.getSupportedConstraints() || {};
        const AUDIO_INPUT_CONSTRAINTS = [
            "autoGainControl",
            "echoCancellation",
            "noiseSuppression"
        ];

        currentConstraints = AUDIO_INPUT_CONSTRAINTS.reduce((acc, constraintName) => {
            if (supportedContraints[constraintName]) {
                acc.push({constraintName: constraintName, enabled: true});
            }
            return acc;
        }, []);
    }

    initialize();

    async function startRecording() {
        if (!selectedDeviceId) {
            isOutputStreamNotSupported = true;
        }

        let chunks = [];
        const constraints = currentConstraints.reduce((acc, constraint) => {
            acc[constraint.constraintName] = constraint.enabled;
            return acc;
        }, {
            audio: {deviceId: {exact: selectedDeviceId}}
        });

        let stream = await navigator.mediaDevices.getUserMedia(constraints);

        mediaRecorder = new MediaRecorder(stream, {
            mimeType: mimeType,
            bitsPerSecond: 128000
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
        if (mediaRecorder && mediaRecorder.state === "recording") {
            mediaRecorder.stop();
        }
    }

    function saveData(blob) {
        let fileConstraints = currentConstraints.reduce((acc, constraint) => {
            acc += `${constraint.constraintName}_${constraint.enabled}_`;
            return acc;
        }, "");
        let fileName = `audio_${fileConstraints}${fileCounter}.${fileExt}`;
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

        <div class="section flex-column">
            <div>Enable / Disable Media Constraints</div>
            {#each currentConstraints as constraint}
                <label>
                    <input type=checkbox bind:checked={constraint.enabled} class="mr-5">
                    <span class="text-label">{constraint.constraintName}</span>
                </label>
            {/each}
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




