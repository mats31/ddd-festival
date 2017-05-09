'use strict';

exports.__esModule = true;

var _sono = require('../core/sono');

var _sono2 = _interopRequireDefault(_sono);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function microphone(connected, denied, error) {
    navigator.getUserMedia = navigator.mediaDevices.getUserMedia || navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

    error = error || function (err) {
        console.error(err);
    };

    var isSupported = !!navigator.getUserMedia;
    var api = {};
    var stream = null;

    function onConnect(micStream) {
        stream = micStream;
        connected(stream);
    }

    function onError(e) {
        if (denied && e.name === 'PermissionDeniedError' || e === 'PERMISSION_DENIED') {
            denied();
        } else {
            error(e.message || e);
        }
    }

    function connect() {
        if (!isSupported) {
            return api;
        }

        if (navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({
                audio: true
            }).then(onConnect).catch(onError);
        } else {
            navigator.getUserMedia({
                audio: true
            }, onConnect, onError);
        }
        return api;
    }

    function disconnect() {
        if (stream.stop) {
            stream.stop();
        } else {
            stream.getAudioTracks()[0].stop();
        }
        stream = null;
        return api;
    }

    return Object.assign(api, {
        connect: connect,
        disconnect: disconnect,
        isSupported: isSupported,
        get stream() {
            return stream;
        }
    });
}

exports.default = _sono2.default.register('microphone', microphone, _sono2.default.utils);