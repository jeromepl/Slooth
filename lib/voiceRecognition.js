(function(){


        //Set these to avoid having to enter them everytime
        var URL = 'wss://httpapi.labs.nuance.com/v1?';

        var APP_ID = "NMDPPRODUCTION_Elie_Harfouche_Slooth_tech_20160221103322";
        var APP_KEY = "00e1bd4b29ebbb658eb27609557cbed1a817e629638c7aa2ae158a46fb8efbfb6fb94699a401fe33b3743c09f0fada9811c0c2754c3c17fb52a1414d2f3c499e";
        var USER_ID = "elie.harfouche@mail.mcgill.ca";


        var userMedia = undefined;
        navigator.getUserMedia = navigator.getUserMedia
        || navigator.webkitGetUserMedia
        || navigator.mozGetUserMedia
        || navigator.msGetUserMedia;


        if(!navigator.getUserMedia){
            finalText.text("No getUserMedia Support in this Browser");
        }
        
        navigator.getUserMedia({
            audio:true
        }, function(stream){
            userMedia = stream;
        }, function(error){
            finalText.text("Could not get User Media: " + error);
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
        var $record = $('#recording');
        var $asrLabel = $('#asr_label');
        var finalText =$("#textBox");
        var errorMessage =$("#errorMessage");
        var recordingIMG =$("#recordingStatus");

        //Variables to determine whether application is still running
        var timeSinceLastVoice =0;
        var volumeThreshhold =135;
        var timeThreshold =3;//in seconds

        //Volume averaging
        var volumeArr = new Array(10);
        var volumeCounter =0;

        //Drawing listening
        var canvas = document.getElementById("canvas").getContext('2d');

        $(document).ready(function(){
            $record.hide();
            connect();
        })
        
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
                    $connect.hide();
                    record(); //On first connection start recording
                },
                onclose: function() {
                    finalText.text("Websocket Closed");
                    $content.removeClass('connected');
                    $connect.show();
                    $record.hide();

                },
                onmessage: function(msg) {

                    if(msg.message=="query_error")
                    {
                        finalText.text(msg.reason);
                    }
                    else if(msg.result_type =="NVC_ASR_CMD"){
                        finalText.text(msg.transcriptions[0]);
                    }
                    else if(msg.message == "volume"){
                        var volume =msg.volume[msg.volume.length-1];
                        volumeArr[volumeCounter++%10] = volume; 
                        drawListener(volume);
                        var currentTime = new Date().getTime();
                        if(averageVolume(volumeArr)<volumeThreshhold){
                            if(((currentTime- timeSinceLastVoice)/1000.0)>timeThreshold)
                            {
                                stop();
                                $("#listening").hide();
                            }
                        }
                        else
                        {
                            timeSinceLastVoice =currentTime;
                        }
                        
                    }

                },
                onerror: function(error) {
                    finalText.text(error);
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
                $("#listening").show();
                finalText.text("");
                var options = {
                    userMedia: userMedia
                };
                Nuance.startASR(options);
                isRecording =!isRecording;
                $record.hide();
            }  
        }

        function stop(){
            if(isRecording){
                Nuance.stopASR();
                isRecording=!isRecording;
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

        function drawListener(volume){
            canvas.clearRect(0,0,1000,100);
            canvas.fillRect((600-volume)/2,10,volume,20);
            canvas.fillStyle="#2C3E50";
            canvas.fill();
        }

    })();
