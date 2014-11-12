/*__________________________________________________
|              PanaBDRemote v0.1                    |
|                                                   |
| Author : Phil Bri ( 10/2014 )                     |
|    (See http://encausse.wordpress.com/s-a-r-a-h/) |
| Description :                                     |
|    Panasonic BluRay's Plugin for SARAH project    |
|___________________________________________________|
*/

exports.action = function ( data , callback , config , SARAH ) {
    config = config.module.PanaBDRemote;
    var cmd = data.cmd;
    var blurayIP = config.BluRayIP;

    if ( !config.BluRayIP ) {
        console.log ( 'PanaBDRemote => Pas d\'adresse IP configurée dans PanaBDRemote.prop !' );
        callback ({ 'tts': 'Adresse I P incorrecte ou absente !' });
        return;
    }


    var request = require('request');
    var MyRemoteChain = 'cCMD_RC_' + cmd + '.x=100&cCMD_RC_' + cmd + '.y=100';

    request ({
        uri     :   'http://' + blurayIP + ':80/WAN/dvdr/dvd_ctrl.cgi',
        method  :   'POST',
        headers : {
                    'user-agent' : 'MEI-LAN-REMOTE-CALL',
                    'content-lenght' : MyRemoteChain.length
        },
        body    :   'MyRemoteChain'

    }, function (err, response, body) {
    
        if (err || response.statusCode != 200) {
            console.log ('BluRayRemote => uri = ' + request.uri);
            console.log ("BluRayRemote => L'action a échouée " + err);
            callback ({'tts' : "L'action à échouée"});
            return;
        }
        console.log ('BluRayRemote => ' + cmd + ' = OK !\r\n');
        console.log ('Valeur à retourner' + body + '\r\n');
    });
    callback ({ 'tts': data.ttsAction });