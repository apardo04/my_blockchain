/*  Blockchain is meant to add blocks, but never delete them */

const SHA256 = require('crypto-js/sha256');
class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty) {
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Block mined: " + this.hash);
    }
}
class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 5;
    }

    createGenesisBlock() {
        return new Block(0, "01/01/2017", "Genesis Block Data", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1]
    }

    addBlock(newBlock) {
        newBlock.previousHash =  this.getLatestBlock().hash;
        //newBlock.hash = newBlock.calculateHash();
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }
}

let globalCoin = new Blockchain();
console.log("Mining block 1...");
globalCoin.addBlock(new Block(1, "10/17/2017", { amount: 4}));

console.log("Mining block 2...");
globalCoin.addBlock(new Block(2, "12/17/2017", { amount: 7}));

/*  Tamporing with a block.
 Changing amount, and recalculating hash.
 This does not work because the blocks relationship
 with the previous block gets broken.
 */
//globalCoin.chain[1].data = { amount: 100 };
//globalCoin.chain[1].hash = globalCoin.chain[1].calculateHash();


console.log("Is blockchain valid? " + globalCoin.isChainValid());

console.log(JSON.stringify(globalCoin, null, 4));
