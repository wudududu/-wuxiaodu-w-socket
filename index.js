try {
  let baseConfig = require('./config');
} catch(err) {

}
class WSocket {
  constructor(config) {
    let reconnectConfig = Object.assign(baseConfig.reconnectConfig, config.reconnectConfig || {});
    let heartBeat = Object.assign(baseConfig.heartBeat, config.heartBeat || {});
    config = Object.assign(baseConfig, config, {reconnectConfig, heartBeat});
    
    this.config = config;
    this.logConfig = {
      func: console.log,
      prefix: 'WSocket Log:',
    }
    this._log = this._initLog(); 
  }
  _initLog() {
    return this.logConfig.func.bind(null, this.logConfig.prefix);
  }
  _simulateClose() {
    this.socket.close();
  }
  start() {
    const { url, protocols } = this.config;
    if (!url) {
      this._log("config.url is nesscary");
      return false;
    };
    const socket = protocols ? new WebSocket(url, protocols) : new WebSocket(url);
    this.socket = socket;
    this._initEvent();
  }
  _initEvent() {
    const { heartBeat, reconnectConfig, _re } = this.config;
    let listeners = ['close', 'error', 'open', 'message'];
    listeners.forEach(type => {
      let _processFunc;
      if (type === 'open') {
        this._log("connect success");
        if (this._reConnectTimer) clearInterval(this._reConnectTimer);
        // 在open注入心跳
        let _open = this.config[`on${type}`];
        _processFunc = () => {
          if (heartBeat.bool) {
            this._heartTimer = setInterval(() => {
              this.socket.send(heartBeat.contend);
            }, heartBeat.timeSpan);
          }
          if (_re) {
            reconnectConfig[`on${open}`];
          }
          _open();
        }
      }
      if (type === 'close') {
        let _close = this.config[`on${type}`];
        _processFunc = _ => {
          if (reconnectConfig.bool) {
            this._reConnectTimer = setInterval(() => {
              this._log("reconnecting")
              if (this._reConnectTimerTime === reconnectConfig.time) {
                clearInterval(this._reConnectTimer);
                this._reConnectTimerTime = 0;
                return true;
              }
              // 重连
              this.config._re = true;
              this.start();
              this._reConnectTimerTime += 1;
            }, reconnectConfig.timeSpan);
          }
          if (this._heartTimer) clearInterval(this._heartTimer);

          _close();
        }
      }
      this.socket.addEventListener(type, _processFunc || this.config[`on${type}`]);
    });
  }
}

try {
  module.exports = WSocket
} catch(err) {

}
