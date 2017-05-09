'use strict';

exports.__esModule = true;

var _sono = require('../core/sono');

var _sono2 = _interopRequireDefault(_sono);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function recorder() {
    var passThrough = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    var bufferLength = 4096;
    var buffersL = [];
    var buffersR = [];
    var startedAt = 0;
    var stoppedAt = 0;
    var script = null;
    var isRecording = false;
    var soundOb = null;

    var input = _sono2.default.context.createGain();
    var output = _sono2.default.context.createGain();
    output.gain.value = passThrough ? 1 : 0;

    var node = {
        _in: input,
        _out: output,
        connect: function connect(n) {
            output.connect(n._in || n);
        },
        disconnect: function disconnect() {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            output.disconnect(args);
        }
    };

    function mergeBuffers(buffers, length) {
        var buffer = new Float32Array(length);
        var offset = 0;
        for (var i = 0; i < buffers.length; i++) {
            buffer.set(buffers[i], offset);
            offset += buffers[i].length;
        }
        return buffer;
    }

    function getBuffer() {
        if (!buffersL.length) {
            return _sono2.default.context.createBuffer(2, bufferLength, _sono2.default.context.sampleRate);
        }
        var recordingLength = buffersL.length * bufferLength;
        var buffer = _sono2.default.context.createBuffer(2, recordingLength, _sono2.default.context.sampleRate);
        buffer.getChannelData(0).set(mergeBuffers(buffersL, recordingLength));
        buffer.getChannelData(1).set(mergeBuffers(buffersR, recordingLength));
        return buffer;
    }

    function destroyScriptProcessor() {
        if (script) {
            script.onaudioprocess = null;
            input.disconnect();
            script.disconnect();
        }
    }

    function createScriptProcessor() {
        destroyScriptProcessor();

        script = _sono2.default.context.createScriptProcessor(bufferLength, 2, 2);
        input.connect(script);
        script.connect(output);
        script.connect(_sono2.default.context.destination);
        // output.connect(sono.context.destination);


        script.onaudioprocess = function (event) {
            var inputL = event.inputBuffer.getChannelData(0);
            var inputR = event.inputBuffer.getChannelData(1);

            if (passThrough) {
                var outputL = event.outputBuffer.getChannelData(0);
                var outputR = event.outputBuffer.getChannelData(1);
                outputL.set(inputL);
                outputR.set(inputR);
            }

            if (isRecording) {
                buffersL.push(new Float32Array(inputL));
                buffersR.push(new Float32Array(inputR));
            }
        };
    }

    return {
        start: function start(sound) {
            if (!sound) {
                return;
            }
            createScriptProcessor();
            buffersL.length = 0;
            buffersR.length = 0;
            startedAt = _sono2.default.context.currentTime;
            stoppedAt = 0;
            soundOb = sound;
            sound.effects.add(node);
            isRecording = true;
        },
        stop: function stop() {
            soundOb.effects.remove(node);
            soundOb = null;
            stoppedAt = _sono2.default.context.currentTime;
            isRecording = false;
            destroyScriptProcessor();
            return getBuffer();
        },
        getDuration: function getDuration() {
            if (!isRecording) {
                return stoppedAt - startedAt;
            }
            return _sono2.default.context.currentTime - startedAt;
        },

        get isRecording() {
            return isRecording;
        }
    };
}

exports.default = _sono2.default.register('recorder', recorder, _sono2.default.utils);