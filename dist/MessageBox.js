'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _deepExtend = require('deep-extend');

var _deepExtend2 = _interopRequireDefault(_deepExtend);

var _lodash = require('lodash.template');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// import template from 'lodash.template';

var MessageBox = function () {
  function MessageBox() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        initialLanguage = _ref.initialLanguage,
        messages = _ref.messages,
        tracker = _ref.tracker,
        interpolate = _ref.interpolate;

    _classCallCheck(this, MessageBox);

    this.language = initialLanguage || MessageBox.language || 'en';
    this.messageList = messages || {};
    this.interpolate = interpolate || MessageBox.interpolate || /{{{?([\s\S]+?)}?}}/g;
    if (tracker) this.trackerDep = new tracker.Dependency();
  }

  _createClass(MessageBox, [{
    key: 'messages',
    value: function messages(_messages) {
      (0, _deepExtend2.default)(this.messageList, _messages);
    }
  }, {
    key: 'getMessages',
    value: function getMessages(language) {
      if (!language) {
        language = this.language;
        if (this.trackerDep) this.trackerDep.depend();
      }

      var globalMessages = MessageBox.messages[language];

      var messages = this.messageList[language];
      if (messages) {
        if (globalMessages) messages = (0, _deepExtend2.default)({}, globalMessages, messages);
      } else {
        messages = globalMessages;
      }

      if (!messages) throw new Error('No messages found for language "' + language + '"');

      return {
        messages: messages,
        language: language
      };
    }
  }, {
    key: 'message',
    value: function message(errorInfo) {
      var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          language = _ref2.language,
          context = _ref2.context;

      // Error objects can optionally include a preformatted message,
      // in which case we use that.
      if (errorInfo.message) return errorInfo.message;

      var fieldName = errorInfo.name;
      var genericName = MessageBox.makeNameGeneric(fieldName);

      var _getMessages = this.getMessages(language),
          messages = _getMessages.messages;

      var message = messages[errorInfo.type];

      var fullContext = _extends({
        genericName: genericName
      }, context, errorInfo);

      if (message && (typeof message === 'undefined' ? 'undefined' : _typeof(message)) === 'object') message = message[genericName] || message._default; // eslint-disable-line no-underscore-dangle

      if (typeof message === 'string') message = (0, _lodash2.default)(message, { interpolate: this.interpolate });

      if (typeof message !== 'function') return fieldName + ' is invalid';

      return message(fullContext);
    }
  }, {
    key: 'setLanguage',
    value: function setLanguage(language) {
      this.language = language;
      if (this.trackerDep) this.trackerDep.changed();
    }
  }], [{
    key: 'makeNameGeneric',
    value: function makeNameGeneric(name) {
      if (typeof name !== 'string') return null;
      return name.replace(/\.[0-9]+(?=\.|$)/g, '.$');
    }
  }, {
    key: 'defaults',
    value: function defaults() {
      var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          initialLanguage = _ref3.initialLanguage,
          messages = _ref3.messages,
          interpolate = _ref3.interpolate;

      if (typeof initialLanguage === 'string') MessageBox.language = initialLanguage;
      if (interpolate instanceof RegExp) MessageBox.interpolate = interpolate;

      if (messages) {
        if (!MessageBox.messages) MessageBox.messages = {};
        (0, _deepExtend2.default)(MessageBox.messages, messages);
      }
    }
  }]);

  return MessageBox;
}();

MessageBox.messages = {};
exports.default = MessageBox;