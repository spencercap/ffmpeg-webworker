import WebworkerClient from "./FFMPEGWebWorkerClient";
import Webworker from "./FFMPEGWebWorker";

export const FFMPEGWebworker = Webworker;
export const FFMPEGWebworkerClient = WebworkerClient;
let workerClient = { on() { }, emit() { } };
// const _window = global || window;
var _window = window;
if (_window && _window.Blob) {
  workerClient = new WebworkerClient();
}
export default workerClient;
