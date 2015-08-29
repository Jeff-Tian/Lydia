var lydia = {
    padLeft: function (s, pad) {
        s = "" + s;
        return pad.substring(0, pad.length - s.length) + s;
    },

    createFullDecisionMatrix: function (n) {
        var min = 0;
        var max = this.getMaxBinaryValueByBits(n);

        var res = new Array(max + 1);

        for (var i = min; i <= max; i++) {
            res[i] = this.padLeft(Number(i).toString(2), '000').split('').map(function (s) {
                return Number(s);
            });
        }

        return res;
    },

    getMaxBinaryValueByBits: function (n) {
        return Math.pow(2, n) - 1;
    },

    sumProduct: function (a1, a2) {
        var res = 0;
        for (var i = 0; i < a1.length; i++) {
            res += a1[i] * a2[i];
        }

        return res;
    },

    mines: [],
    slaves: 0,

    setupProblem: function (mines, slaves) {
        this.mines = mines;
        this.slaves = slaves;
        this.solution = {
            decisions: [],
            output: 0,
            levels: 0
        };
        this.decisionTree = {
            output: 0,
            index: 0,
            ifIDontMine: null,
            ifIDoMine: null,
            link: null,
            mine: false
        };
    },

    reduceDecisionMatrix: function () {
        var m = this.createFullDecisionMatrix(this.mines.length);
        var res = [];

        for (var i = 0; i < m.length; i++) {
            if (this.sumProduct(m[i], this.mines.map(function (mine) {
                    return mine.slaves;
                })) <= this.slaves) {
                res.push(m[i]);
            }
        }

        return res;
    },

    findBestDecisions: function () {
        var m = this.reduceDecisionMatrix();
        var res = {
            decisions: [],
            output: 0
        };

        var maxOutput = 0;
        for (var i = 0; i < m.length; i++) {
            var output = this.sumProduct(m[i], this.mines.map(function (mine) {
                return mine.potential;
            }));

            if (output > maxOutput) {
                maxOutput = output;

                res.decisions = [m[i]];
                res.output = maxOutput;
            } else if (output == maxOutput) {
                res.decisions.push(m[i]);
            }
        }

        return res;
    },

    findMostOutput: function (numberOfMines, slavesIHave, level, node) {
        if (typeof numberOfMines === 'undefined') {
            numberOfMines = this.mines.length;
            this.solution.decisions = new Array(numberOfMines);
        }

        if (typeof slavesIHave === 'undefined') {
            slavesIHave = this.slaves;
        }

        if (typeof  level === 'undefined') {
            level = 0;
        }

        if (level > this.solution.levels) {
            this.solution.levels = level;
        }

        if (typeof node === 'undefined') {
            node = this.decisionTree;
        }

        if (numberOfMines <= 0) {
            return 0;
        }

        if (slavesIHave === 0) {
            return 0;
        }

        if (slavesIHave < 0) {
            return -Infinity;
        }

        if (slavesIHave < this.mines[numberOfMines - 1].slaves) {
            return 0;
        }

        node.ifIDontMine = {
            output: 0,
            index: 0,
            ifIDontMine: null,
            ifIDoMine: null,
            mine: false
        };

        node.ifIDoMine = {
            output: 0,
            index: 0,
            ifIDontMine: null,
            ifIDoMine: null,
            mine: false
        };

        var outputIfIDontMineThis = this.findMostOutput(numberOfMines - 1, slavesIHave, level + 1, node.ifIDontMine);
        var outputIfIDoMineThis = this.findMostOutput(numberOfMines - 1, slavesIHave - this.mines[numberOfMines - 1].slaves, level + 1, node.ifIDoMine) + this.mines[numberOfMines - 1].potential;

        node.index = numberOfMines - 1;

        if (outputIfIDoMineThis > outputIfIDontMineThis) {
            node.output = outputIfIDoMineThis;
            node.link = node.ifIDoMine;
            node.mine = true;
            return outputIfIDoMineThis;
        } else {
            node.output = outputIfIDontMineThis;
            node.link = node.ifIDontMine;
            node.mine = false;
            return outputIfIDontMineThis;
        }
    },

    getSolutionPath: function () {
        var p = [];

        var node = this.decisionTree;
        p.push(node.mine);

        while (node = node.link) {
            p.push(node.mine);
        }

        var thePath = p.reverse();

        this.solution.decisions = [thePath.map(function (p) {
            return p ? 1 : 0;
        })];

        this.solution.output = this.decisionTree.output;

        return thePath;
    }
};

module.exports = lydia;