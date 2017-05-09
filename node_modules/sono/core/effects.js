'use strict';

exports.__esModule = true;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Effects = function () {
    function Effects(context) {
        var _this = this;

        (0, _classCallCheck3.default)(this, Effects);

        this.context = context;
        this._destination = null;
        this._source = null;

        this._nodes = [];
        this._nodes.has = function (node) {
            return _this.has(node);
        };
        this._nodes.add = function (node) {
            return _this.add(node);
        };
        this._nodes.remove = function (node) {
            return _this.remove(node);
        };
        this._nodes.toggle = function (node, force) {
            return _this.toggle(node, force);
        };
        this._nodes.removeAll = function () {
            return _this.removeAll();
        };

        Object.keys(Effects.prototype).forEach(function (key) {
            if (!_this._nodes.hasOwnProperty(key) && typeof Effects.prototype[key] === 'function') {
                _this._nodes[key] = _this[key].bind(_this);
            }
        });
    }

    Effects.prototype.setSource = function setSource(node) {
        this._source = node;
        this._updateConnections();
        return node;
    };

    Effects.prototype.setDestination = function setDestination(node) {
        this._connectToDestination(node);
        return node;
    };

    Effects.prototype.has = function has(node) {
        if (!node) {
            return false;
        }
        return this._nodes.indexOf(node) > -1;
    };

    Effects.prototype.add = function add(node) {
        if (!node) {
            return null;
        }
        if (this.has(node)) {
            return node;
        }
        if (Array.isArray(node)) {
            var n = void 0;
            for (var i = 0; i < node.length; i++) {
                n = this.add(node[i]);
            }
            return n;
        }
        this._nodes.push(node);
        this._updateConnections();
        return node;
    };

    Effects.prototype.remove = function remove(node) {
        if (!node) {
            return null;
        }
        if (!this.has(node)) {
            return node;
        }
        var l = this._nodes.length;
        for (var i = 0; i < l; i++) {
            if (node === this._nodes[i]) {
                this._nodes.splice(i, 1);
                break;
            }
        }
        node.disconnect();
        this._updateConnections();
        return node;
    };

    Effects.prototype.toggle = function toggle(node, force) {
        force = !!force;
        var hasNode = this.has(node);
        if (arguments.length > 1 && hasNode === force) {
            return this;
        }
        if (hasNode) {
            this.remove(node);
        } else {
            this.add(node);
        }
        return this;
    };

    Effects.prototype.removeAll = function removeAll() {
        while (this._nodes.length) {
            var node = this._nodes.pop();
            node.disconnect();
        }
        this._updateConnections();
        return this;
    };

    Effects.prototype.destroy = function destroy() {
        this.removeAll();
        this.context = null;
        this._destination = null;
        if (this._source) {
            this._source.disconnect();
        }
        this._source = null;
    };

    Effects.prototype._connect = function _connect(a, b) {
        a.disconnect();
        // console.log('> connect output', (a.name || a.constructor.name), 'to input', (b.name || b.constructor.name));
        a.connect(b._in || b);
    };

    Effects.prototype._connectToDestination = function _connectToDestination(node) {
        var lastNode = this._nodes[this._nodes.length - 1] || this._source;

        if (lastNode) {
            this._connect(lastNode, node);
        }

        this._destination = node;
    };

    Effects.prototype._updateConnections = function _updateConnections() {
        if (!this._source) {
            return;
        }

        // console.log('updateConnections');

        var node = void 0,
            prev = void 0;

        for (var i = 0; i < this._nodes.length; i++) {
            node = this._nodes[i];
            prev = i === 0 ? this._source : this._nodes[i - 1];
            this._connect(prev, node);
        }

        if (this._destination) {
            this._connectToDestination(this._destination);
        }
    };

    return Effects;
}();

exports.default = Effects;