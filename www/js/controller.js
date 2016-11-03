      angular.module('starter.controller', [])

      .controller('SpeechCtrl', function($scope) {

        $scope.checked=false;
        $scope.recognizedText = '';


        $scope.record = function() {
          console.log('record function');
          var recognition = new SpeechRecognition();
          $scope.checked=true;
          recognition.onresult = function(event) {
            if (event.results.length > 0) {
              $scope.recognizedText = event.results[0][0].transcript;
              $scope.checked=false;

              $scope.$apply()

            }
          };
          recognition.start();
        };
      })


      .controller("ExampleController", function($scope, $rootScope, $ionicPlatform, $cordovaBeacon,$cordovaToast,$location, $cordovaSms) {


       $scope.checked=false;
       $scope.recognizedText = '';
  /*
     $scope.gotoHelp = function() {
       console.log('go to help');
         $location.path('/help');
       }*/
        $scope.sendSMS = function() {
      console.log('Sending SMS');
    $cordovaSms
      .send('08008809773', 'need Help ! Kiran', options)
      .then(function() {
        alert('Success');
        // Success! SMS was sent
      }, function(error) {
        alert('Error');
        // An error occurred
      });
  }

       $scope.recordSpeech = function() {
        console.log('record function');
        var recognition = new SpeechRecognition();
        $scope.checked=true;
        recognition.onresult = function(event) {
          if (event.results.length > 0) {
            $scope.recognizedText = event.results[0][0].transcript.toString().trim();
            $scope.checked=false;
            $cordovaToast.showLongBottom($scope.recognizedText);
             
       
            if($scope.recognizedText=='help')
            {
                $scope.sendSMS();
              }
              else
              {
                 $scope.findBeacons($scope.recognizedText,true);
              }
              $scope.$apply()

            }
          };
          recognition.start();
        }


        $scope.beacons = {};
        $scope.findBeacons = function(recognizedText,ttsFlag) {

         $scope.data = {
          speechText: ''
        };
        $scope.txpower=-69;
        $scope.distance = 0;
        console.log('inside find beacon');
        $cordovaToast.showLongBottom('inside find beacon');
        $cordovaBeacon.requestWhenInUseAuthorization();

        $rootScope.$on("$cordovaBeacon:didRangeBeaconsInRegion", function(event, pluginResult) {
               // $cordovaToast.showLongBottom('coming here');
               console.log('coming here');
               var uniqueBeaconKey;
               for(var i = 0; i < pluginResult.beacons.length; i++) {

                uniqueBeaconKey = pluginResult.beacons[i].uuid + ":" + pluginResult.beacons[i].major + ":" + pluginResult.beacons[i].minor;
                $scope.beacons[uniqueBeaconKey] = pluginResult.beacons[i];
                if(pluginResult.beacons[i].rssi==0)
                {
                  $cordovaToast.showLongBottom('cannot find');
                }
                else
                {
                  //major 0 is for entrance
                  if(pluginResult.beacons[i].major==0)
                  {
                   if(recognizedText=='where am I')
                    {

                       $scope.data.speechText='your are near entrance';
                    }
                    else if(recognizedText=='how to go to pantry')
                    {
                     
                       $scope.data.speechText='Take a left';
                    }
                  
                    else if(recognizedText=='how to go to restroom')
                    {
                      
                       $scope.data.speechText='Take a right';
                    }
                    
                  }
                   //major 1 is for Pantry
                  else if(pluginResult.beacons[i].major==1)
                  {
                     if(recognizedText=='where am I')
                    {

                       $scope.data.speechText='your are near Pantry';
                    }
                    else if(recognizedText=='how to go to entrance')
                    {
                     
                       $scope.data.speechText='Take a right';
                    }
                  
                    else if(recognizedText=='how to go to restroom')
                    {
                      
                       $scope.data.speechText='Take a left';
                    }
                  }
                   //major 2 is for Washroom
                  else if(pluginResult.beacons[i].major==2)
                  {
                   if(recognizedText=='where am I')
                    {

                       $scope.data.speechText='your are near restroom';
                    }
                    else if(recognizedText=='how to go to entrance')
                    {
                     
                       $scope.data.speechText='Take a left';
                    }
                  
                    else if(recognizedText=='how to go to pantry')
                    {
                      
                       $scope.data.speechText='Take a right';
                    }
                  }
                  //major 3 is obstacle
                      else if(pluginResult.beacons[i].major==3)
                  {
                   
                       $scope.data.speechText='You have an obstacle';
                   
                  }
                  var rssi=parseInt(pluginResult.beacons[i].rssi);
                   //  $cordovaToast.showLongBottom('rssi'+rssi);
                   var  ratio =rssi/-69;
                    //  $cordovaToast.showLongBottom('ratio'+ratio);
                    var accuracy =  (0.89976)*Math.pow(ratio,7.7095) + 0.111;  
                   //  $cordovaToast.showLongBottom('accuracy'+accuracy);
                   $scope.distance=accuracy;
                   if(accuracy<0.5 && ttsFlag)
                   {
                    ttsFlag=false;
                    $cordovaToast.showLongBottom('speak function');
                    $cordovaToast.showLongBottom($scope.data.speechText);
                    TTS.speak({
                     text: $scope.data.speechText,
                     locale: 'en-GB',
                     rate: 1.5
                   }, function () {
                   
             // Do Something after success
           }, function (reason) {
             // Handle the error case
           });
                  }
                }
                 //  $cordovaToast.showLongBottom(JSON.stringify( )); 

                
               }
               $scope.$apply();
             });

        $cordovaBeacon.startRangingBeaconsInRegion($cordovaBeacon.createBeaconRegion("AltBeacon", "a24366fd-4ef4-4fea-b449-06ea46a4ba3c"));

      };
    });