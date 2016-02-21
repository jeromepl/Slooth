(function(){


        //Set these to avoid having to enter them everytime
        var URL = 'wss://httpapi.labs.nuance.com/v1?';

        var APP_ID = "NMDPPRODUCTION_Elie_Harfouche_Sloth_io_20160220131750";
        var APP_KEY = "ae1f66cd295dce1e02264f37aababaf9a59138088843c149962d75dcbeb04e6dcfb43af8120916142f654cda1f06d3c5970ccd1f4f8f68e5bcddc27b8d10e85c";
        var USER_ID = "elie.harfouche@mail.mcgill.ca";


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
        var $url = "wss://httpapi.labs.nuance.com/v1?";
        var $appKey = APP_KEY;
        var $appId = APP_ID;
        var $userId = USER_ID;
        var $connect = $('#connect');
        var $record = $('#asr_go');
        var $asrLabel = $('#asr_label');
        var finalText =$("#phrase");
        var errorMessage =$("#errorMessage");
        var recording =$("#recordingStatus");

        //Variables to determine whether application is still running
        var timeSinceLastVoice =0;
        var volumeThreshhold =135;
        var timeThreshold =2;//in seconds

        //Volume averaging
        var volumeArr = new Array(10);
        var volumeCounter =0;



        
        // Connect
        function connect() {
            // INIT THE SDK
            Nuance.connect({
                appId: $appId,
                appKey: $appKey,
                userId: $userId,
                url: $url,

                onopen: function() {
                    console.log("Websocket Opened");
                    $content.addClass('connected');
                    record(); //On first connection start recording
                },
                onclose: function() {
                    console.log("Websocket Closed");
                    $content.removeClass('connected');
                    $connect.show();

                },
                onmessage: function(msg) {

                    if(msg.message=="query_error")
                    {
                        errorMessage.text(msg.reason);
                    }
                    else if(msg.result_type =="NVC_ASR_CMD"){
                        finalText.text(msg.transcriptions[0]);
                        errorMessage.text("");    
                    }
                    else if(msg.message == "volume"){
                        var volume =msg.volume[msg.volume.length-1];
                        var currentTime = new Date().getTime();
                        volumeArr[volumeCounter++%10] = volume; 
                        if(averageVolume(volumeArr)<volumeThreshhold){
                            if(((currentTime- timeSinceLastVoice)/1000.0)>timeThreshold)
                            {
                                stop();
                            }
                        }
                        else
                        {
                            timeSinceLastVoice =currentTime;
                        }
                        
                    }

                },
                onerror: function(error) {
                    errorMessage.text(error);
                    $content.removeClass('connected');
                }

            });
        };
        $connect.on('click', connect);

        // Disconnect
        $(window).unload(function(){
            Nuance.disconnect();
        });



        //Starts asr
        function record(){
            if(!isRecording){
                for(var i=0;i<volumeArr.length;i++)
                   volumeArr[i]=150;
                errorMessage.text("");
                finalText.text("");
                var options = {
                    userMedia: userMedia
                };
                Nuance.startASR(options);
                isRecording =!isRecording;
                recordingIMG.show();
                $record.hide();
            }  
        }

        function stop(){
            if(isRecording){
                Nuance.stopASR();
                isRecording=!isRecording;
                recordingIMG.hide();
                $record.show();
            }
        }
        //
        // ASR / NLU
        $record.on('click', record);

        function averageVolume(volumeArr)
        {
            var average =0;
            for(var i =0; i<volumeArr.length;i++)
            {
                average +=volumeArr[i];
            }
            average =average/volumeArr.length;

            return average;
        }

    })();