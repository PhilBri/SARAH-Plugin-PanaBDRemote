/*__________________________________________________
|              PanaBDRemote v2.1                    |
|                                                   |
| Authors : Phil Bri & Emmanuel Crespin ( 12/2014 ) |
|    (See http://encausse.wordpress.com/s-a-r-a-h/) |
| Description :                                     |
|    Panasonic BluRay's Plugin for SARAH project    |
|___________________________________________________|
*/

exports.init = function ( SARAH ) {
    var config = SARAH.ConfigManager.getConfig();

    if ( /^autodetect$/i.test( config.modules.PanaBDRemote.BluRay_IP ) == false ) return console.log ( 'VieraRemote => Autodetect [OFF]' );

    // Configure ip autodetection : (Auto Detect Plugin)
    if ( !SARAH.context.panabdremote ) {
        fsearch();

        SARAH.listen ( 'autodetect', function ( data ) {
            if ( data.from != 'PanaBDRemote' ) fsearch();
            else {

                if ( SARAH.context.panabdremote.ip ) console.log ( '\r\nPanaBDRemote => Autodetect [ON] : ip = ' + SARAH.context.panabdremote.ip );
                else console.log ( '\r\nPanaBDRemote => Autodetect [ON] : ip non trouvée !' );
                SARAH.context.flag = false;
            }
        });
    }

    function fsearch () {
        if ( SARAH.context.flag != true ) {
            SARAH.context.flag = true;

            findBR = require ( './lib/findBR.js' ) ( 'Panasonic', 'Disc', function ( RetIP ) {
                SARAH.context.panabdremote = { 'ip' : RetIP };
                SARAH.trigger ( 'autodetect', { 'from' : 'PanaBDRemote' });
            });
        }
    }
}

exports.action = function ( data , callback , config , SARAH ) {
    var myReg = /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/,
        BluRayIP;

    if ( typeof(SARAH.context.panabdremote) != 'undefined' ) BluRayIP = SARAH.context.panabdremote.ip
    else if ( myReg.test( config.modules.PanaBDRemote.BluRay_IP ) == true ) BluRayIP = config.modules.PanaBDRemote.BluRay_IP
    else return callback ({ 'tts' : 'Blu Ray non trouvé' })

    
    var myForm  = require ( 'querystring' ).parse ( 'cCMD_RC_' + data.cmd + '.x=100&cCMD_RC_' + data.cmd + '.y=100' ),
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
        
            console.log ( '\r\nPanaBDRemote => Commande : "' + data.cmd + '" => OK !\r\n' );
            callback ({ 'tts' : data.ttsAction });
        }
    });
}
