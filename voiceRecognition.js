(function(){


        //Set these to avoid having to enter them everytime
        var URL = 'wss://httpapi.labs.nuance.com/v1?';

        var APP_ID = "NMDPPRODUCTION_Elie_Harfouche_Sloth_io_20160220131750";
        var APP_KEY = "ae1f66cd295dce1e02264f37aababaf9a59138088843c149962d75dcbeb04e6dcfb43af8120916142f654cda1f06d3c5970ccd1f4f8f68e5bcddc27b8d10e85c";
        var USER_ID = "elie.harfouche@mail.mcgill.ca";
        var NLU_TAG = undefined;


        var userMedia = undefined;
        navigator.getUserMedia = navigator.getUserMedia
        || navigator.webkitGetUserMedia
        || navigator.mozGetUserMedia
        || navigator.msGetUserMedia;


        if(!navigator.getUserMedia){
            console.log("No getUserMedia Support in this Browser");
        }
        
        navigator.getUserMedia({
            audio:true
        }, function(stream){
            userMedia = stream;
        }, function(error){
            console.error("Could not get User Media: " + error);
        });

        //
        // APP STATE
        var isRecording = false;
        // NODES
        var $content = $('#content');
        var $url = $('#url');
        var $appKey = $('#app_key');
        var $appId = $('#app_id');
        var $userId = $('#user_id');
        var $nluTag = $('#nlu_tag');
        var $textNluTag = $("#text_nlu_tag");
        //Connection class tag
        var $connect = $('#connect');
        var $ttsGo = $('#tts_go');
        var $ttsText = $('#tts_text');
        var $ttsDebug = $('#tts_debug_output');
        //Recording class tag
        var $asrRecord = $('#asr_go');
        var $asrLabel = $('#asr_label');
        var $nluExecute = $('#nlu_go');
        var $asrViz = $('#asr_viz');
        var $asrDebug = $('#asr_debug_output');
        var $nluDebug = $('#nlu_debug_output');
        var $asrVizCtx = $asrViz.get()[0].getContext('2d');

        var dLog = function dLog(msg, logger){
            var d = new Date();
            logger.prepend('<div><em>'+d.toISOString()+'</em> &nbsp; <pre>'+msg+'</pre></div>');
        };


        //
        // Connect
        function connect() {

            // INIT THE SDK
            Nuance.connect({
                appId: $appId.val(),
                appKey: $appKey.val(),
                userId: $userId.val(),
                url: $url.val(),

                onopen: function() {
                    console.log("Websocket Opened");
                    $content.addClass('connected');
                },
                onclose: function() {
                    console.log("Websocket Closed");
                    $content.removeClass('connected');
                },
                onmessage: function(msg) {
                    console.log(msg);
                    if(msg.message == "volume") {
                       viz(msg.volume);
                    } else if (msg.result_type == "NMDP_TTS_CMD") {
                        dLog(JSON.stringify(msg, null, 2), $ttsDebug);
                    } else if (msg.result_type == "NDSP_ASR_APP_CMD") {
                        if(msg.nlu_interpretation_results.status === 'success'){
                            dLog(JSON.stringify(msg, null, 2), $asrDebug);
                        } else {
                            dLog(JSON.stringify(msg.nlu_interpretation_results.payload.interpretations, null, 2), $asrDebug);
                        }
                    } else if (msg.result_type === "NDSP_APP_CMD") {
                        if(msg.nlu_interpretation_results.status === 'success'){
                            dLog(JSON.stringify(msg.nlu_interpretation_results.payload.interpretations, null, 2), $nluDebug);
                        } else {
                            dLog(JSON.stringify(msg, null, 2), $nluDebug);
                        }
                    }
                },
                onerror: function(error) {
                    console.error(error);
                    $content.removeClass('connected');
                }

            });
        };
        $connect.on('click', connect);

        $url.val(URL || '');
        $appId.val(APP_ID || '');
        $appKey.val(APP_KEY || '');
        $userId.val(USER_ID || '');
        $nluTag.val(NLU_TAG || '');
        $textNluTag.val(NLU_TAG || '');


        // Disconnect
        $(window).unload(function(){
            Nuance.disconnect();
        });




        //
        // TTS
        function tts(evt){
            Nuance.playTTS({
                language: 'eng-USA',
                voice: 'ava',
                text: $ttsText.val()
            });
        };
        $ttsGo.on('click', tts);


        //
        // ASR / NLU
        function asr(evt){
            if(isRecording) {
                Nuance.stopASR();
                $asrLabel.text('RECORD');
            } else {
                cleanViz();

                var options = {
                    userMedia: userMedia
                };
                if($nluTag.val()) {
                    options.nlu = true;
                    options.tag = $nluTag.val();
                }
                Nuance.startASR(options);
                $asrLabel.text('STOP RECORDING');
            }
            isRecording = !isRecording;
        };
        $asrRecord.on('click', asr);


    })();