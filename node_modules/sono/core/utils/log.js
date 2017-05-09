'use strict';

exports.__esModule = true;
exports.default = log;
function log(api) {
    var title = 'sono ' + api.VERSION,
        info = 'Supported:' + api.isSupported + ' WebAudioAPI:' + api.hasWebAudio + ' TouchLocked:' + api.isTouchLocked + ' State:' + (api.context && api.context.state) + ' Extensions:' + api.file.extensions;

    if (navigator.userAgent.indexOf('Chrome') > -1) {
        var args = ['%c ♫ ' + title + ' ♫ %c ' + info + ' ', 'color: #FFFFFF; background: #379F7A', 'color: #1F1C0D; background: #E0FBAC'];
        console.log.apply(console, args);
    } else if (window.console && window.console.log.call) {
        console.log.call(console, title + ' ' + info);
    }
}