// 根据配置开发功能
let baseConfig = {
  url: '',
  protocols: '',
  onclose: _ => {},
  onerror: _ => {},
  onmessage: _ => {},
  onopen: _ => {},
  // 包装功能
  // 重连
  reconnectConfig: {
    bool: true,
    time: Infinity,
    timeSpan: 10000, // 时间间隔
    onerror: _ => {}, // 重连失败
    onopen: _ => {}, // 重连成功
  },
  // 心跳
  heartBeat: {
    bool: true,
    timeSpan: 5000,
    contend: "hello socket",
  },

  _re: false, // 是否是重连态

  _reConnectTimerTime: 0,
  _reConnectTimer: null,
  _heartTimer: null,
}

try {
  module.exports = baseConfig;
} catch(err) {

}

