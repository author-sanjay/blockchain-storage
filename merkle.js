const crypto = require('crypto');

class MerkleTree {
    constructor(chunks) {
        this.tree = this.buildTree(chunks);
        this.root = this.tree[this.tree.length - 1][0]; 
    }

    buildTree(chunks) {
        let level = chunks.map(hash => crypto.createHash('sha256').update(hash).digest('hex'));

        const tree = [level];
        while (level.length > 1) {
            level = level.reduce((acc, _, i, arr) => {
                if (i % 2 === 0) {
                    const left = arr[i];
                    const right = arr[i + 1] || arr[i];
                    acc.push(crypto.createHash('sha256').update(left + right).digest('hex'));
                }
                return acc;
            }, []);
            tree.push(level);
        }
        return tree;
    }
}

module.exports = MerkleTree;
