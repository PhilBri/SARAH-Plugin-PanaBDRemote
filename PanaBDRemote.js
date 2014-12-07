/*__________________________________________________
|              PanaBDRemote v2.1                    |
|                                                   |
| Authors : Phil Bri & Emmanuel Crespin ( 12/2014 ) |
|    (See http://encausse.wordpress.com/s-a-r-a-h/) |
| Description :                                     |
|    Panasonic BluRay's Plugin for SARAH project    |
|___________________________________________________|
*/

var BluRayIP;

exports.init = function ( SARAH ) {
    var config = SARAH.ConfigManager.getConfig();

    if ( /^autodetect$/i.test( config.modules.panabdremote.BluRay_IP ) == false ) {
        return BluRayIP = config.modules.panabdremote.BluRay_IP;
    }

    // Configure ip autodetection : (Auto Detect Plugin)
    if ( !SARAH.context.panabdremote ) {
        fsearch();

        SARAH.listen ( 'autodetect', function ( data ) {
            if ( data.from != 'PanaBDRemote' ) fsearch();
            else
            {
                if ( BluRayIP ) console.log ( '\r\nPanaBDRemote => BluRay : ip = ' + BluRayIP + ' (Auto Detect Plugin)');
                else console.log ( '\r\nPanaBDRemote => BluRay non trouvé (Auto Detect Plugin)' );
                SARAH.context.flag = false;
            }
        });
    }

    function fsearch () {
        if ( SARAH.context.flag != true ) {
            SARAH.context.flag = true;
            findBR = require ( './lib/findBR.js' ) ( 'Panasonic', 'Disc', function ( RetIP ) {
                SARAH.context.panabdremote = {'ip' : RetIP };
                BluRayIP = SARAH.context.panabdremote.ip;
                SARAH.trigger ( 'autodetect', { 'from' : 'PanaBDRemote' });
            });
        }
    }
}

exports.action = function ( data , callback , config , SARAH ) {
    var cmd = data.cmd,
        myReg = /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/;
    
    if ( ! myReg.test( BluRayIP ) && ! myReg.test( config.modules.panabdremote.BluRay_IP )) { 
        return callback ({ 'tts' : 'Blue Ray, non trouvé' }) }
   
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
        
            console.log ( '\r\nPanaBDRemote => Commande : "' + cmd + '" => OK !\r\n' );
            callback ({ 'tts' : data.ttsAction });
        }
    });
}