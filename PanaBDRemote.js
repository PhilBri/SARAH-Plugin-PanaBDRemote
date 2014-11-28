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
    var cfg = config.module.PanaBDRemote;
    var cmd = data.cmd;

    if ( !cfg.BluRayIP ) {
        console.log ( 'PanaBDRemote => Pas d\'adresse IP configurée dans PanaBDRemote.prop !' );
        callback ({ 'tts': 'Adresse I P incorrecte ou absente !' });
        return;
    }
   
    var myForm  = ( require ( 'querystring' ).parse( 'cCMD_RC_'+ cmd +'.x=100&cCMD_RC_'+ cmd + '.y=100' ));
    //var myForm = 'cCMD_RC_'+ cmd +'.x=100&cCMD_RC_'+ cmd + '.y=100';
    //var myLen   = myForm.length;
    var myLen = (require('querystring').stringify(myForm).length);

    var request = require ( 'request' );
    request.post ({
        uri     : 'http://192.168.1.200/WAN/dvdr/dvdr_ctrl.cgi', 
        headers : { 'Content-Length': myLen,
                    'Connection'    : 'Keep-Alive',
                    'User-Agent'    : 'MEI-LAN-REMOTE-CALL',
                    'content-type'  : 'application/x-www-form-urlencoded'
                },
        form    : myForm

    }, function ( err, httpResponse, body ) {
        
        if ( err || httpResponse.statusCode != 200 ) {
            console.log ( "PanaBDRemote : Action échouée => "  +err );
            callback ({ 'tts' : "L'action à échouée !" });
            return;
        }
        
        console.log ( 'BluRayRemote => ' + cmd + ' = OK !\r\n' );
        callback ({ 'tts' : data.ttsAction });
    });
}