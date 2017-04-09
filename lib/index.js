'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ReactDomLayout = function (_Component) {
    _inherits(ReactDomLayout, _Component);

    function ReactDomLayout() {
        _classCallCheck(this, ReactDomLayout);

        return _possibleConstructorReturn(this, (ReactDomLayout.__proto__ || Object.getPrototypeOf(ReactDomLayout)).apply(this, arguments));
    }

    _createClass(ReactDomLayout, [{
        key: 'fire',
        value: function fire(type) {
            var _this2 = this;

            for (var _len = arguments.length, props = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                props[_key - 1] = arguments[_key];
            }

            var types = this.listens[type];
            if (types) {
                if (this.isFunction(types)) {
                    types.apply(this, props);
                } else if (this.isArray(types)) {
                    types.forEach(function (item) {
                        if (item && _this2.isFunction(item)) {
                            item.apply(_this2, props);
                        }
                    });
                }
            } else {
                console.log('fire: ' + type + ' not found,please add Engine listens');
            }
        }
    }, {
        key: 'extend',
        value: function extend() {
            var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            var target2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            for (var i in target2) {
                target[i] = target2[i];
            }
            return target;
        }
    }, {
        key: 'isFunction',
        value: function isFunction(fn) {
            return typeof fn === 'function';
        }
    }, {
        key: 'isArray',
        value: function isArray(obj) {
            return Object.prototype.toString.call(obj) === '[object Array]';
        }
    }, {
        key: 'render',
        value: function render() {
            this.share = this.extend({ fire: this.props.fire || this.fire.bind(this) }, this.props.props);
            return this.renderItem(this.props.rootId, this.props.rootId);
        }
    }, {
        key: 'getItemProps',
        value: function getItemProps() {
            var _this3 = this;

            var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            var isCom = arguments[1];

            if (this.props.getItemProps) return this.props.getItemProps(obj, isCom);
            var props = {
                key: obj['data-id']
            };
            var share = this.share || {};
            for (var key in obj) {
                if (key && key !== 'type' && key !== 'children') {
                    (function () {
                        var type = obj[key];
                        if (type && /^on[A-Z]/g.test(key)) {
                            //使用fire模式
                            if (typeof type === 'string') {
                                props[key] = function () {
                                    for (var _len2 = arguments.length, env = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                                        env[_key2] = arguments[_key2];
                                    }

                                    share.fire && share.fire.apply(share, [type].concat(env));
                                };
                            } else {
                                props[key] = type;
                            }
                        } else if (!_this3.props.regPropsIgnore || !_this3.props.regPropsIgnore.test(key)) {
                            props[key] = obj[key];
                        }
                    })();
                }
            }
            return props;
        }
    }, {
        key: 'renderItem',
        value: function renderItem(id, pid) {
            var _this4 = this;

            var state = this.propsState || {};
            var obj = state[id];
            if (!obj) {
                console.log('id:' + id + '  not found in', state);
                return null;
            }
            var args = [];
            var type = obj.type;
            obj['data-id'] = id;
            obj['data-pid'] = pid;
            if (type) {
                var typeItem = this.components[type];
                var props = this.getItemProps(obj, typeItem);
                if (typeItem) {
                    var share = this.extend({}, this.share);
                    args.push(typeItem, this.extend(share, props));
                } else if (type === 'text') {
                    return obj.children;
                } else if (/^[a-z]+$/g) {
                    args.push(type, props);
                } else {
                    console.log('type: ' + obj.type + ' not found, please add Engine components', obj);
                    return null;
                }
                if (this.isArray(obj.children)) {
                    obj.children.forEach(function (item) {
                        var itemRender = _this4.renderItem(item, id);
                        itemRender !== null && args.push(itemRender);
                    });
                } else if (['string', 'number', 'boolean'].indexOf(_typeof(obj.children)) !== -1) {
                    args.push(obj.children);
                }
                return _react2.default.createElement.apply(_react2.default, args);
            } else {
                console.log('type not exist', obj);
                return null;
            }
        }
    }, {
        key: 'propsState',
        get: function get() {
            return this.props.state || {};
        }
    }, {
        key: 'listens',
        get: function get() {
            return this.props.listens || {};
        }
    }, {
        key: 'components',
        get: function get() {
            return this.props.components || {};
        }
    }]);

    return ReactDomLayout;
}(_react.Component);

ReactDomLayout.defaultProps = {
    components: {}, //{type: xxx}
    state: {}, //// {id: {children: [cid,cid],props: {},type: 'text'}
    props: {}, //定义添加组件共享数据或方法
    rootId: 'Root',
    listens: {}
};
exports.default = ReactDomLayout;