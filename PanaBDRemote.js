/*__________________________________________________
|              PanaBDRemote v0.9                    |
|                                                   |
| Authors : Phil Bri & Emmanuel Crespin ( 10/2014 ) |
|    (See http://encausse.wordpress.com/s-a-r-a-h/) |
| Description :                                     |
|    Panasonic BluRay's Plugin for SARAH project    |
|___________________________________________________|
*/
var BluRayIP;

exports.init = function ( SARAH ) {

    var findBR = require ( './lib/findBR.js' );

    findBR( 'Panasonic', 'Disc', function ( brIP ) {
        if ( !brIP ) { return console.log ( '\r\nPanaBDRemote => BluRay non trouvé (Auto Détection)\r\n' ) }
        BluRayIP = brIP;
        console.log ( '\r\nPanaBDRemote => BluRay IP = ' + BluRayIP + ' (Auto Détection)\r\n');
    });
}

exports.action = function ( data , callback , config , SARAH ) {

    cmd = data.cmd;

    if ( !BluRayIP ) { return callback ({ 'tts' : 'Blou Ré non trouvé' }) }
   
    var myForm  = require ( 'querystring' ).parse ( 'cCMD_RC_' + cmd + '.x=100&cCMD_RC_' + cmd + '.y=100' ),
        myLen   = require ( 'querystring' ).stringify ( myForm ).length,
        request = require ( 'request' );

    request.post ({

        uri     :   'http://' + BluRayIP + '/WAN/dvdr/dvdr_ctrl.cgi', 
        headers :   { 
                    'Content-Length': myLen,
                    'Connection'    : 'Keep-Alive',
                    'User-Agent'    : 'MEI-LAN-REMOTE-CALL',
                    'content-type'  : 'application/x-www-form-urlencoded'
                    },
        form    :   myForm

    }, function ( err, httpResponse, body ) {
        
        if ( err || httpResponse.statusCode != 200 ) {

            callback ({ 'tts' : "L'action à échouée !" });
        } else {
        
            console.log ( '\r\nPanaBDRemote => "' + cmd + '" => OK !\r\n' );
            callback ({ 'tts' : data.ttsAction });
        }
    });
}