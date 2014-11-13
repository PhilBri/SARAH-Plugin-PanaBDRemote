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
    
    var myStr = 'cCMD_RC_' +cmd + '.x=100&cCMD_RC_' +cmd + '.y=100';

    var http = require('http');
    var post_options = {
        host: blurayIP,
        port: 80,
        path: '/WAN/dvdr/dvd_ctrl.cgi? HTTP/1.1',
        method: 'POST',
        headers: {
                'User-Agent' : 'MEI-LAN-REMOTE-CALL',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': myStr.length,
                'Connection': 'Keep-Alive'
        }
    };

    // Set up the request
    var post_req = http.request(myStr, function(res) {
        console.log ( 'STATUS = ' + res.statusCode);
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('Reponse: ' + chunk);
            callback ({ 'tts': data.ttsAction });
        });
    });

    req.on('error', function (e) {
        console.log('Problème request = ' + e.message);
    });

    // post the data
    post_req.write(myStr+'\r\n');
    post_req.end();

/*
    request ({
        uri     :   'http://' + blurayIP + ':80/WAN/dvdr/dvd_ctrl.cgi',
        method  :   'post',
        headers : {
                    'user-agent' : 'MEI-LAN-REMOTE-CALL',
                    'Content-lenght' : req.length,
                    'Content-type': 'application/x-www-form-urlencoded',
                    'Connection': 'Keep-Alive'
        },
        body    :   s
    }, function (err, response, body) {
    
        if (err || response.statusCode != 200) {
            console.log ("BluRayRemote => L'action a échouée " + err);
            callback ({'tts' : "L'action à échouée"});
            return;
        }
        console.log ('BluRayRemote => ' + cmd + ' = OK !\r\n');
        console.log ('Valeur à retourner' + body + '\r\n');
    });
*/
}