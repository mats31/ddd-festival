'use strict';

exports.__esModule = true;
exports.default = isSafeNumber;
function isSafeNumber(value) {
    return typeof value === 'number' && !isNaN(value) && isFinite(value);
}