"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BinanceFuturesCoinmPrivateClient = void 0;
const BinancePrivateBase_1 = require("./BinancePrivateBase");
class BinanceFuturesCoinmPrivateClient extends BinancePrivateBase_1.BinancePrivateBase {
    constructor({ useAggTrades = true, requestSnapshot = true, socketBatchSize = 200, socketThrottleMs = 1000, restThrottleMs = 1000, testNet = false, wssPath = "wss://dstream.binance.com/stream", restL2SnapshotPath = "https://dapi.binance.com/dapi/v1/depth", watcherMs, l2updateSpeed, l2snapshotSpeed, batchTickers, apiKey = "", apiSecret = "", } = {}) {
        if (testNet) {
            wssPath = "wss://dstream.binancefuture.com/stream";
            restL2SnapshotPath = "https://testnet.binancefuture.com/api/v1/depth";
        }
        super({
            name: "binancecoinm",
            restL2SnapshotPath,
            wssPath,
            useAggTrades,
            requestSnapshot,
            socketBatchSize,
            socketThrottleMs,
            restThrottleMs,
            watcherMs,
            l2updateSpeed,
            l2snapshotSpeed,
            batchTickers,
            apiKey,
            apiSecret,
        });
    }
    /**
     * Set webscoket token from REST api before subscribing to private feeds
     * https://binance-docs.github.io/apidocs/spot/en/#user-data-streams
     * TODO: SEE HOW KUOCOIN DOES IT!!!
     */
    _connect() {
        this.ccxt
            .dapiPrivatePostListenKey()
            .then(d => {
            if (d.listenKey) {
                this.apiToken = d.listenKey;
                this.dynamicWssPath = `${this.wssPath}?streams=${this.apiToken}`;
                const that = this;
                setTimeout(function userDataKeepAlive() {
                    // keepalive
                    try {
                        that.ccxt
                            .dapiPrivatePutListenKey({ listenKey: that.apiToken })
                            .then(d => setTimeout(userDataKeepAlive, 60 * 30 * 1000))
                            .catch(err => setTimeout(userDataKeepAlive, 60000));
                    }
                    catch (error) {
                        setTimeout(userDataKeepAlive, 60000); // retry in 1 minute
                    }
                }, 60 * 30 * 1000); // 30 minute keepalive
            }
            super._connect();
        })
            .catch(err => {
            this.emit("error", err);
        });
    }
}
exports.BinanceFuturesCoinmPrivateClient = BinanceFuturesCoinmPrivateClient;
//# sourceMappingURL=BinanceFuturesCoinmPrivateClient.js.map