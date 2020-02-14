/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import test from 'tape';
let erc20 = require('../build/index.js');


test('test results erc20 wallet', (t) => {
    t.same(erc20.provider , 'https://ropsten.infura.io/' , 'El Provider es correcto.');
    t.end();
});