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
    //config = config.module.PanaBDRemote;
    var cmd = data.cmd;
    var blurayIP = '192.168.1.200';//config.BluRayIP;

    //if ( !config.BluRayIP ) {
    //    console.log ( 'PanaBDRemote => Pas d\'adresse IP configurée dans PanaBDRemote.prop !' );
    //    callback ({ 'tts': 'Adresse I P incorrecte ou absente !' });
    //    return;
    //}


    var request = require('request');

    var str1 = 'cCMD_RC_' +cmd + '.x';
    var str2 = 'cCMD_RC_' +cmd + '.y';
    
    var myForm = {};
    myForm [str1]='100';
    myForm [str2]='100';

    var qs = require ('querystring');
    var req = qs.stringify(myForm);

    request ({
        url     :   'http://192.168.1.200:80/WAN/dvdr/dvd_ctrl.cgi',
        method  :   'post',
        headers : {
                    'User-Agent' : 'MEI-LAN-REMOTE-CALL',
                    'Content-Length' : req.length,
        },
        form    :   req

    }, function (err, response, body) {
    
        if (err || response.statusCode != 200) {
            console.log ("BluRayRemote => L'action a échouée " + err);
            callback ({'tts' : "L'action à échouée"});
            return;
        }
        console.log ('BluRayRemote => ' + cmd + ' = OK !\r\n');
        //console.log ('Valeur à retourner' + body + '\r\n');
    });
    callback ({ 'tts': data.ttsAction });
}