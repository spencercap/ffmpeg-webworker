import WorkerFile from "webworker-file";
import workerFile from "./FFMPEGWebWorker";
import { EventEmitter } from "events";

export default class FFMPEGWebworkerClient extends EventEmitter {
  /**
   * @type {Worker}
   */
  _worker = {};
  /**
   * @type {Blob}
   */
  _inputFile = {};

  /**
   * @type {Boolean}
   */
  workerIsReady = false;
  constructor() {
    super();
    this.initWebWorker();
  }

  initWebWorker() {
    this.worker = new WorkerFile(workerFile);
    this.log;
    const log = (this.worker.onmessage = event => {
      let message = event.data;
      if (event && event.type) {
        if (message.type == "ready") {
          this.emit("onReady", "ffmpeg-asm.js file has been loaded.");
          this.workerIsReady = true;
        } else if (message.type == "stdout") {
          this.emit("onStdout", message.data);
        } else if (message.type == "start") {
          this.emit("onFileReceived", "File Received");
          log("file received ffmpeg command.");
        } else if (message.type == "done") {
          this.emit("onDone", message.data);
        }
      }
    });
  }

  set worker(worker) {
    this._worker = worker;
  }
  get worker() {
    return this._worker;
  }

  set inputFile(inputFile) {
    if (!this.isVideo(inputFile)) {
      throw new Error("Input file is expected to be an audio or a video");
    }
    this._inputFile = inputFile;
  }
  get inputFile() {
    return this._inputFile;
  }

  /**
   * use worker to encode audio
   * @param {Blob} file
   * @return {Promise<ArrayBuffer>}
   */
  readFileAsBufferArray = file => {
    return new Promise((resolve, reject) => {
      let fileReader = new FileReader();
      fileReader.onload = function () {
        resolve(this.result);
      };
      fileReader.onerror = function () {
        reject(this.error);
      };
      fileReader.readAsArrayBuffer(file);
    });
  };

  inputFileExists() {
    const inputFile = this.inputFile;
    return !!(
      inputFile &&
      inputFile instanceof Blob &&
      inputFile.size &&
      inputFile.type
    );
  }

  /**
   * use worker to encode audio
   * @param {Blob} inputFile
   * @return {Promise<ArrayBuffer>}
   */
  convertInputFileToArrayBuffer() {
    if (!this.inputFileExists()) {
      throw new Error("Input File has not been set");
    }
    return this.readFileAsBufferArray(this.inputFile);
  }

  /**
   * @param {String} command
   */
  runCommand = (command, totalMemory = 33554432) => {
    if (typeof command !== "string" || !command.length) {
      throw new Error("command should be string and not empty");
    }
    if (this.inputFile && this.inputFile.type) {
      this.convertInputFileToArrayBuffer().then(arrayBuffer => {
        while (!this.workerIsReady) { }

        // og
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
        }

        // BAD 1x1px
        // const smallImgb64 = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==`;

        // 420x360px
        // const smallImgb64 = `iVBORw0KGgoAAAANSUhEUgAAAeAAAAFACAMAAABTFl9JAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAAZQTFRF////AAAAVcLTfgAAAAF0Uk5TAEDm2GYAAACvSURBVHja7MExAQAAAMKg9U9tDQ+gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+TYABAFleAAHIAZiHAAAAAElFTkSuQmCC`;

        // 4x3px
        // const smallImgb64 = `iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAMAAACDKl70AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAAZQTFRF////AAAAVcLTfgAAAAF0Uk5TAEDm2GYAAAAOSURBVHjaYmBAAQABBgAADwAB1KgyvAAAAABJRU5ErkJggg==`;

        // 2x1px png
        const smallImgb64 = `iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAMAAADD/I+4AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAAZQTFRF////AAAAVcLTfgAAAAF0Uk5TAEDm2GYAAAANSURBVHjaYmBgAAgwAAADAAHTY1G2AAAAAElFTkSuQmCC`;

        // BAD - 1x1px png doesnt work...
        // const smallImgb64 = `iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAMAAAAoyzS7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAAZQTFRF////AAAAVcLTfgAAAAF0Uk5TAEDm2GYAAAAMSURBVHjaYmAACDAAAAIAAU9tWeEAAAAASUVORK5CYII=`;

        const imgArrBuff = _base64ToArrayBuffer(smallImgb64);

        const custom = `-loop 1 -i img.png`
        command = custom + command;
        // var filename = "video-".concat(Date.now(), ".webm");
        var filename = "video-".concat(Date.now(), ".mp3");
        var inputCommand = "-i ".concat(filename, " ").concat(command);

        console.log('inputCommand', inputCommand);

        _this.worker.postMessage({
          type: "command",
          arguments: inputCommand.split(" "),
          files: [
            {
              data: new Uint8Array(arrayBuffer),
              name: filename
            },
            {
              data: new Uint8Array(imgArrBuff),
              name: 'img.png'
            }
          ],
          totalMemory: totalMemory
        });
      });
    } else {
      this.worker.postMessage({
        type: "command",
        arguments: command.split(" "),
        totalMemory
      });
    }
  };

  /**
   * @param {String | Array<String>} message
   * @return {void}
   */
  log = message =>
    Array.isArray(message)
      ? console.log.call(null, message)
      : console.log(message);

  /**
   * @param {Blob} file
   * @return {Boolean}
   */
  isVideo = file => {
    const fileType = file.type;
    return (
      file instanceof Blob &&
      (fileType.includes("video") || fileType.includes("audio"))
    );
  };
}
