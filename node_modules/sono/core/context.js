'use strict';

exports.__esModule = true;

var _dummy = require('./utils/dummy');

var _dummy2 = _interopRequireDefault(_dummy);

var _fakeContext = require('./utils/fake-context');

var _fakeContext2 = _interopRequireDefault(_fakeContext);

var _iOS = require('./utils/iOS');

var _iOS2 = _interopRequireDefault(_iOS);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var desiredSampleRate = 44100;

var Ctx = window.AudioContext || window.webkitAudioContext || _fakeContext2.default;

var context = new Ctx();

if (!context) {
    context = new _fakeContext2.default();
}

// Check if hack is necessary. Only occurs in iOS6+ devices
// and only when you first boot the iPhone, or play a audio/video
// with a different sample rate
// https://github.com/Jam3/ios-safe-audio-context/blob/master/index.js
if (_iOS2.default && context.sampleRate !== desiredSampleRate) {
    (0, _dummy2.default)(context);
    context.close(); // dispose old context
    context = new Ctx();
}

// Handles bug in Safari 9 OSX where AudioContext instance starts in 'suspended' state
if (context.state === 'suspended' && typeof context.resume === 'function') {
    window.setTimeout(function () {
        return context.resume();
    }, 1000);
}

exports.default = context;