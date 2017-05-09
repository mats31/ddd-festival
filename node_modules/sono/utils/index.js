'use strict';

exports.__esModule = true;
exports.waveformer = exports.waveform = exports.recorder = exports.microphone = undefined;

var _microphone = require('./microphone');

var _microphone2 = _interopRequireDefault(_microphone);

var _recorder = require('./recorder');

var _recorder2 = _interopRequireDefault(_recorder);

var _waveform = require('./waveform');

var _waveform2 = _interopRequireDefault(_waveform);

var _waveformer = require('./waveformer');

var _waveformer2 = _interopRequireDefault(_waveformer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.microphone = _microphone2.default;
exports.recorder = _recorder2.default;
exports.waveform = _waveform2.default;
exports.waveformer = _waveformer2.default;
exports.default = {
    microphone: _microphone2.default,
    recorder: _recorder2.default,
    waveform: _waveform2.default,
    waveformer: _waveformer2.default
};