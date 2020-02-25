/* eslint-disable no-async-promise-executor */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

let lightwallet = require('eth-lightwallet');
let Web3 = require('web3');
let EthTx = require('ethereumjs-tx');
let HookedWeb3Provider = require("hooked-web3-provider");
var api = require('etherscan-api');
let txutils = lightwallet.txutils;
let signing = lightwallet.signing;
let encryption = lightwallet.encryption;



module.exports = {
    web3: new Web3(),
    EthTx: EthTx,
    etherscan: null,
    password: null,
    keystore: null,
    keystoreJson: null,
    provider: 'https://ropsten.infura.io/',
    minABI: [{ constant: !0, inputs: [{ name: "_owner", type: "address" }], name: "balanceOf", outputs: [{ name: "balance", type: "uint256" }], type: "function" }, { constant: !0, inputs: [], name: "decimals", outputs: [{ name: "", type: "uint8" }], type: "function" }, { constant: !0, inputs: [], name: "name", outputs: [{ name: "", type: "string" }], type: "function" }, { constant: !0, inputs: [], name: "symbol", outputs: [{ name: "", type: "string" }], type: "function" }, { constant: !1, inputs: [{ name: "_to", type: "address" }, { name: "_value", type: "uint256" }], name: "transfer", outputs: [{ name: "", type: "bool" }], type: "function" }],
    tokenAddr: null,
    tokenDecimals: 18,
    tokenSymbol: '',
    tokenName: '',
    numAddr: 1,
    address: [],
    mySeed: '',
    seed: '',
    hdPathString: 'm/44\'/60\'/0\'/0', //Red Ethereum,
    percentageGas: 5,
    apikeyEtherScan: 'YourApiKey',
    networkEtherScan: 'ropsten',
    timeoutScan: 3000,

    setWeb3Provider: async function () {
        let web3Provider = await new HookedWeb3Provider({
            host: this.provider,
            transaction_signer: this.keystore
        });
        await this.web3.setProvider(web3Provider);
    },




    getBalanceAddress: async function (addr) {
        return new Promise(async (resolve, reject) => {
            await this.setWeb3Provider();
            try {
                try {
                    await this.web3.eth.getBalance(addr, async (err, result) => {
                        if (err) {
                            reject(err);
                        } else {
                            try {
                                let ether = await this.web3.fromWei(result, 'ether') * 1;
                                resolve(ether);
                            } catch (e) {
                                reject(e.message);
                            }
                        }
                    });
                } catch (e) {
                    reject(e.message);
                }
            } catch (e) {
                reject(e.message);
            }
        }).then(function (data) {
            return data;
        });
    },



    getTokensAmountBalance: async function (contract, addr) {
        return new Promise(async (resolve, reject) => {
            await contract.balanceOf(addr, async (error, balance) => {
                if (!error) {
                    resolve(balance / (10 ** this.tokenDecimals));
                } else {
                    reject(error);
                }
            });
        }).then(function (data) {
            return data;
        });
    },


    getTokenAddress: async function (addr) {
        return new Promise(async (resolve, reject) => {
            await this.setWeb3Provider();
            try {
                (async () => {
                    try {
                        let contract = await this.web3.eth.contract(this.minABI).at(this.tokenAddr);
                        let saldo = await this.getTokensAmountBalance(contract, addr);
                        resolve(saldo);
                    } catch (e) {
                        reject(e.message);
                    }
                })();
            } catch (e) {
                reject(e.message);
            }
        })
    },



    randomIntFromInterval: async (min, max) => {
        return Math.floor(Math.random() * (max - min + 1) + min);
    },

    createSeed: async function () {
        return new Promise(async (resolve, reject) => {
            try {
                resolve(await lightwallet.keystore.generateRandomSeed(this.mySeed));
            } catch (e) {
                reject('Enter a valid word for the seed');
            }
        });
    },

    createdStored: async function () {
        return new Promise(async (resolve, reject) => {
            try {
                await lightwallet.keystore.createVault({
                    password: this.password,
                    seedPhrase: this.seed,
                    hdPathString: this.hdPathString
                }, async (err, ks) => {
                    if (!err) {
                        await ks.keyFromPassword(this.password, async (err, pwDerivedKey) => {
                            if (!err) {
                                await ks.generateNewAddress(pwDerivedKey, this.numAddr);
                                resolve(ks);
                            } else {
                                reject(err.message);
                            }
                        });
                    } else {
                        reject(err.message);
                    }
                });
            } catch (e) {
                reject('An error occurred while creating the keystore');
            }
        });
    },


    generateAddress: async function () {
        return new Promise(async (resolve, reject) => {
            try {
                let addrs = await this.keystore.getAddresses();
                let addrsess = [];
                addrs.forEach((e) => {
                    addrsess.push({
                        address: e,
                    });
                });
                resolve(addrsess);
            } catch (e) {
                reject('There was an error creating the addresses');
            }
        });
    },

    encodeJson: async function () {
        return new Promise(async (resolve, reject) => {
            try {
                resolve(JSON.stringify(await this.keystore.serialize()));
            } catch (e) {
                reject('An error occurred while creating the JSON');
            }
        });
    },

    decodeJson: async function () {
        return new Promise(async (resolve, reject) => {
            try {
                resolve(await lightwallet.keystore.deserialize(this.keystoreJson));
            } catch (e) {
                reject('There was an error decoding the JSON');
            }
        });
    },



    getDataToken: async function () {
        return new Promise(async (resolve, reject) => {
            await this.setWeb3Provider();
            let contract = await this.web3.eth.contract(this.minABI).at(this.tokenAddr);
            let response = { decimals: null, symbol: null, name: null };
            await contract.decimals(async (error, data) => {
                if (!error) {
                    response.decimals = data * 1;
                    await contract.symbol(async (error, data) => {
                        if (!error) {
                            response.symbol = data;
                            await contract.name(async (error, data) => {
                                if (!error) {
                                    response.name = data;
                                    resolve(response);
                                } else {
                                    reject('There was an error getting the name');
                                }
                            });
                        } else {
                            reject('There was an error getting the symbol');
                        }
                    });
                } else {
                    reject('There was an error getting the decimals');
                }
            });
        });
    },



    getBalance: async function () {
        return new Promise(async (resolve, reject) => {
            await this.setWeb3Provider();
            for (let k in this.address) {
                this.address[k].eth = await this.web3.fromWei(await this.web3.eth.getBalance(this.address[k].address), 'ether') * 1;
            }
            resolve(this.address);
        }).then(function (data) {
            return data;
        });
    },

    getTokensBalance: async function (contract, addr) {
        return new Promise(async (resolve, reject) => {
            await contract.balanceOf(addr, async (error, balance) => {
                if (!error) {
                    resolve(balance / (10 ** this.tokenDecimals));
                } else {
                    reject(error);
                }
            });
        }).then(function (data) {
            return data;
        });
    },

    getTokens: async function () {
        return new Promise(async (resolve, reject) => {
            (async () => {
                await this.setWeb3Provider();
                let contract = await this.web3.eth.contract(this.minABI).at(this.tokenAddr);
                for (let k in this.address) {
                    this.address[k].token = await this.getTokensBalance(contract, this.address[k].address);
                }
                resolve(this.address);
            })();
        })
    },


    getTransactionCount: async function (from) {
        return new Promise(async (resolve, reject) => {
            await this.web3.eth.getTransactionCount(from, async (err, response) => {
                if (!err) {
                    resolve(response);
                } else {
                    reject(err);
                }
            });
        })
    },

    calculateGasLimitEth: async function (from, to, value) {
        return new Promise(async (resolve, reject) => {
            await this.setWeb3Provider();
            value = value * 1.0e18;
            await this.getTransactionCount(from).then(async (response) => {
                let txOptions = {
                    to: to,
                    value: await this.web3.toHex(value),
                    nonce: await this.web3.toHex(response),
                    data: ''
                };
                let Result = { gasLimit: null, gasPrice: null };
                Result.gasLimit = await this.web3.eth.estimateGas(txOptions);
                await this.web3.eth.getGasPrice(async (error, result) => {
                    if (!error) {
                        Result.gasPrice = result * 1;
                        Result.gasPrice += ((Result.gasPrice * this.percentageGas) / 100) * 1;
                        Result.gasPrice = Math.round(Result.gasPrice);
                        resolve(Result);
                    } else {
                        reject('An error occurred while calculating the gas');
                    }
                });
            }).catch((error) => {
                reject(error);
            });
        })
    },


    calculateGasLimitToken: async function (from, to, value) {
        return new Promise(async (resolve, reject) => {
            await this.setWeb3Provider();
            let contract = await this.web3.eth.contract(this.minABI).at(this.tokenAddr);
            value = (value * (10 ** this.tokenDecimals)) * 1;
            let Result = { gasLimit: null, gasPrice: null };
            Result.gasLimit = await contract.transfer.estimateGas(to, value, { from: from });
            await this.web3.eth.getGasPrice(async (error, result) => {
                if (!error) {
                    Result.gasPrice = result * 1;
                    Result.gasPrice += ((Result.gasPrice * this.percentageGas) / 100) * 1;
                    Result.gasLimit += ((Result.gasLimit * this.percentageGas) / 100) * 1;
                    Result.gasPrice = Math.round(Result.gasPrice);
                    Result.gasLimit = Math.round(Result.gasLimit);
                    resolve(Result);
                } else {
                    reject('An error occurred while calculating the gas');
                }
            });
        });
    },

    sendETH: async function (password, from, to, value, gasPrice, gasLimit) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.keystore.keyFromPassword(password, async (err, pwDerivedKey) => {
                    if (!err) {
                        await this.setWeb3Provider();
                        value = value * 1.0e18;
                        await this.getTransactionCount(from).then(async (response) => {
                            let txOptions = {
                                to: to,
                                gasLimit: await this.web3.toHex(gasLimit),
                                gasPrice: await this.web3.toHex(gasPrice),
                                value: await this.web3.toHex(value),
                                nonce: response,
                                data: ''
                            };
                            let contractData = await txutils.createContractTx(from, txOptions);
                            try {
                                let signedTx = '0x' + await signing.signTx(this.keystore, pwDerivedKey, contractData.tx, from);
                                await this.web3.eth.sendRawTransaction(signedTx, async (err, result) => {
                                    if (!err) {
                                        resolve(result);
                                    } else {
                                        reject(err.message);
                                    }
                                });
                            } catch (e) {
                                reject(e.message);
                            }
                        }).catch((error) => {
                            reject(error);
                        });
                    } else {
                        reject('There was an error sending ethereum');
                    }
                });
            } catch (e) {
                reject(e.message);
            }
        });
    },


    sendTokens: async function (password, from, to, value, gasPrice, gasLimit) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.keystore.keyFromPassword(password, async (err, pwDerivedKey) => {
                    if (!err) {
                        await this.setWeb3Provider();
                        let contract = await this.web3.eth.contract(this.minABI).at(this.tokenAddr);
                        value = (value * (10 ** this.tokenDecimals)) * 1;
                        await this.getTransactionCount(from).then(async (response) => {
                            let txOptions = {
                                to: this.tokenAddr,
                                gasLimit: await this.web3.toHex(gasLimit),
                                gasPrice: await this.web3.toHex(gasPrice),
                                value: await this.web3.toHex(0),
                                nonce: response,
                                data: await contract.transfer.getData(to, value, { from: from }),
                            };
                            let contractData = await txutils.createContractTx(from, txOptions);
                            try {
                                let signedTx = '0x' + await signing.signTx(this.keystore, pwDerivedKey, contractData.tx, from);
                                await this.web3.eth.sendRawTransaction(signedTx, async (err, result) => {
                                    if (!err) {
                                        resolve(result);
                                    } else {
                                        reject(err.message);
                                    }
                                });
                            } catch (e) {
                                reject(e.message);
                            }
                        }).catch((error) => {
                            reject(error);
                        });
                    } else {
                        reject('There was an error sending tokens');
                    }
                });
            } catch (e) {
                reject(e.message);
            }
        });
    },





    initEtherScan: async function () {
        this.etherscan = await api.init(this.apikeyEtherScan, this.networkEtherScan, this.timeoutScan);
    },


    getTxtEth: async function (addr) {
        return new Promise(async (resolve, reject) => {
            await this.initEtherScan();
            try {
                await this.etherscan.account.txlist(addr, 1, 'latest', 1000, 'asc').then((response) => {
                    let txs = [];
                    for (let k in response.result) {
                        let d = response.result[k];
                        if (d.to == this.tokenAddr) {
                            continue;
                        }
                        let type = '';
                        if (d.from == addr) {
                            type = 'Sent';
                        } else {
                            type = 'Received';
                        }
                        let data = {
                            type: type,
                            blockNumber: d.blockNumber,
                            timeStamp: d.timeStamp,
                            hash: d.hash,
                            nonce: parseFloat(d.nonce),
                            from: d.from,
                            to: d.to,
                            value: (d.value * 1) / 1.0e18,
                            gas: parseFloat(d.gas),
                            gasPrice: (d.gasPrice * 1) / 1.0e18,
                            isError: parseFloat(d.isError),
                            confirmations: parseFloat(d.confirmations),
                        };
                        txs.push(data);
                    }
                    txs.reverse();
                    resolve(txs);
                }).catch((e) => {
                    reject(e);
                });
            } catch (e) {
                reject(e.message);
            }
        });
    },



    getTxtTokens: async function (addr) {
        return new Promise(async (resolve, reject) => {
            await this.initEtherScan();
            try {
                await this.etherscan.account.tokentx(addr, this.tokenAddr, 1, 'latest', 'asc').then((response) => {
                    let txs = [];
                    for (let k in response.result) {
                        let d = response.result[k];
                        let type = '';
                        if (d.from == addr) {
                            type = 'Sent';
                        } else {
                            type = 'Received';
                        }
                        let data = {
                            type: type,
                            blockNumber: d.blockNumber,
                            timeStamp: d.timeStamp,
                            hash: d.hash,
                            nonce: parseFloat(d.nonce),
                            from: d.from,
                            to: d.to,
                            value: (d.value * 1) / (10 ** d.tokenDecimal),
                            gas: parseFloat(d.gas),
                            gasPrice: (d.gasPrice * 1) / 1.0e18,
                            isError: 0,
                            confirmations: parseFloat(d.confirmations),
                        };
                        txs.push(data);
                    }
                    txs.reverse();
                    resolve(txs);
                }).catch((e) => {
                    reject(e.message);
                });
            } catch (e) {
                reject(e.message);
            }
        });
    },







}
