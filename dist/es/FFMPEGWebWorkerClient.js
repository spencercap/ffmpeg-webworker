function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import WorkerFile from "webworker-file";
import workerFile from "./FFMPEGWebWorker";
import { EventEmitter } from "events";

var FFMPEGWebworkerClient = /*#__PURE__*/function (_EventEmitter) {
  _inherits(FFMPEGWebworkerClient, _EventEmitter);

  var _super = _createSuper(FFMPEGWebworkerClient);

  /**
   * @type {Worker}
   */

  /**
   * @type {Blob}
   */

  /**
   * @type {Boolean}
   */
  function FFMPEGWebworkerClient() {
    var _this2;

    _classCallCheck(this, FFMPEGWebworkerClient);

    _this2 = _super.call(this);

    _defineProperty(_assertThisInitialized(_this2), "_worker", {});

    _defineProperty(_assertThisInitialized(_this2), "_inputFile", {});

    _defineProperty(_assertThisInitialized(_this2), "workerIsReady", false);

    _defineProperty(_assertThisInitialized(_this2), "readFileAsBufferArray", function (file) {
      return new Promise(function (resolve, reject) {
        var fileReader = new FileReader();

        fileReader.onload = function () {
          resolve(this.result);
        };

        fileReader.onerror = function () {
          reject(this.error);
        };

        fileReader.readAsArrayBuffer(file);
      });
    });

    _defineProperty(_assertThisInitialized(_this2), "runCommand", function (command) {
      var totalMemory = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 33554432;

      if (typeof command !== "string" || !command.length) {
        throw new Error("command should be string and not empty");
      }

      if (_this2.inputFile && _this2.inputFile.type) {
        _this2.convertInputFileToArrayBuffer().then(function (arrayBuffer) {
          while (!_this2.workerIsReady) {} // og
          // const filename = `video-${Date.now()}.webm`;
          // const inputCommand = `-i ${filename} ${command}`;
          // this.worker.postMessage({
          //   type: "command",
          //   arguments: inputCommand.split(" "),
          //   files: [
          //     {
          //       data: new Uint8Array(arrayBuffer),
          //       name: filename
          //     }
          //   ],
          //   totalMemory
          // });


          function _base64ToArrayBuffer(base64) {
            var binary_string = window.atob(base64);
            var len = binary_string.length;
            var bytes = new Uint8Array(len);

            for (var i = 0; i < len; i++) {
              bytes[i] = binary_string.charCodeAt(i);
            }

            return bytes.buffer;
          } // BAD 1x1px
          // const smallImgb64 = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==`;
          // 420x360px
          // const smallImgb64 = `iVBORw0KGgoAAAANSUhEUgAAAeAAAAFACAMAAABTFl9JAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAAZQTFRF////AAAAVcLTfgAAAAF0Uk5TAEDm2GYAAACvSURBVHja7MExAQAAAMKg9U9tDQ+gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+TYABAFleAAHIAZiHAAAAAElFTkSuQmCC`;
          // 4x3px
          // const smallImgb64 = `iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAMAAACDKl70AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAAZQTFRF////AAAAVcLTfgAAAAF0Uk5TAEDm2GYAAAAOSURBVHjaYmBAAQABBgAADwAB1KgyvAAAAABJRU5ErkJggg==`;
          // 2x1px png


          var smallImgb64 = "iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAMAAADD/I+4AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAAZQTFRF////AAAAVcLTfgAAAAF0Uk5TAEDm2GYAAAANSURBVHjaYmBgAAgwAAADAAHTY1G2AAAAAElFTkSuQmCC"; // BAD - 1x1px png doesnt work...
          // const smallImgb64 = `iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAMAAAAoyzS7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAAZQTFRF////AAAAVcLTfgAAAAF0Uk5TAEDm2GYAAAAMSURBVHjaYmAACDAAAAIAAU9tWeEAAAAASUVORK5CYII=`;

          var imgArrBuff = _base64ToArrayBuffer(smallImgb64);

          var custom = "-loop 1 -i img.png";
          command = custom + command; // var filename = "video-".concat(Date.now(), ".webm");

          var filename = "video-".concat(Date.now(), ".mp3");
          var inputCommand = "-i ".concat(filename, " ").concat(command);
          console.log('inputCommand', inputCommand);

          _this.worker.postMessage({
            type: "command",
            arguments: inputCommand.split(" "),
            files: [{
              data: new Uint8Array(arrayBuffer),
              name: filename
            }, {
              data: new Uint8Array(imgArrBuff),
              name: 'img.png'
            }],
            totalMemory: totalMemory
          });
        });
      } else {
        _this2.worker.postMessage({
          type: "command",
          arguments: command.split(" "),
          totalMemory: totalMemory
        });
      }
    });

    _defineProperty(_assertThisInitialized(_this2), "log", function (message) {
      return Array.isArray(message) ? console.log.call(null, message) : console.log(message);
    });

    _defineProperty(_assertThisInitialized(_this2), "isVideo", function (file) {
      var fileType = file.type;
      return file instanceof Blob && (fileType.includes("video") || fileType.includes("audio"));
    });

    _this2.initWebWorker();

    return _this2;
  }

  _createClass(FFMPEGWebworkerClient, [{
    key: "initWebWorker",
    value: function initWebWorker() {
      var _this3 = this;

      this.worker = new WorkerFile(workerFile);
      this.log;

      var log = this.worker.onmessage = function (event) {
        var message = event.data;

        if (event && event.type) {
          if (message.type == "ready") {
            _this3.emit("onReady", "ffmpeg-asm.js file has been loaded.");

            _this3.workerIsReady = true;
          } else if (message.type == "stdout") {
            _this3.emit("onStdout", message.data);
          } else if (message.type == "start") {
            _this3.emit("onFileReceived", "File Received");

            log("file received ffmpeg command.");
          } else if (message.type == "done") {
            _this3.emit("onDone", message.data);
          }
        }
      };
    }
  }, {
    key: "worker",
    get: function get() {
      return this._worker;
    },
    set: function set(worker) {
      this._worker = worker;
    }
  }, {
    key: "inputFile",
    get: function get() {
      return this._inputFile;
    }
    /**
     * use worker to encode audio
     * @param {Blob} file
     * @return {Promise<ArrayBuffer>}
     */
    ,
    set: function set(inputFile) {
      if (!this.isVideo(inputFile)) {
        throw new Error("Input file is expected to be an audio or a video");
      }

      this._inputFile = inputFile;
    }
  }, {
    key: "inputFileExists",
    value: function inputFileExists() {
      var inputFile = this.inputFile;
      return !!(inputFile && inputFile instanceof Blob && inputFile.size && inputFile.type);
    }
    /**
     * use worker to encode audio
     * @param {Blob} inputFile
     * @return {Promise<ArrayBuffer>}
     */

  }, {
    key: "convertInputFileToArrayBuffer",
    value: function convertInputFileToArrayBuffer() {
      if (!this.inputFileExists()) {
        throw new Error("Input File has not been set");
      }

      return this.readFileAsBufferArray(this.inputFile);
    }
    /**
     * @param {String} command
     */

  }]);

  return FFMPEGWebworkerClient;
}(EventEmitter);

export { FFMPEGWebworkerClient as default };