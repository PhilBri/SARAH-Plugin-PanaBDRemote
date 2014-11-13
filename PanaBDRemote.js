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

var net = require('net');
var opts = {
  host: '192.168.1.200',
  port: 80
}

var socket = net.connect(opts, function() {
  socket.end(
    'POST /WAN/dvdr/dvdr_ctrl.cgi HTTP/1.1\r\n' +
    'Accept: text/html, application/xhtml+xml, */*\r\n' +
    'Accept-Language: en-US\r\n' +
    'Content-Type: application/x-www-form-urlencoded\r\n' +
    'User-Agent: MEI-LAN-REMOTE-CALL\r\n' +
    'Accept-Encoding: gzip, deflate\r\n' +
    'Host: 192.168.1.200\r\n' +
    'Content-Length: 39\r\n' +
    'Connection: Keep-Alive\r\n' +
    'Cache-Control: no-cache\r\n\r\n' +
    'cCMD_RC_POWER.x=100&cCMD_RC_POWER.y=100\r\n');
});

    socket.on('data', function(chunk) {
        console.log(chunk.toString());
        callback ({ 'tts': 'commande ok' });
    });

    socket on('error', function (e){
        console.log('erreur = ' + e);
    });

}