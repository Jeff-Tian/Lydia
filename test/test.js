var should = require('should');
var lydia = require('../');

describe("Test Lydia", function () {
    it('can left pad a string', function () {
        lydia.padLeft(1, '000').should.eql('001');
    });

    it('can create decision matrix', function () {
        lydia.createFullDecisionMatrix(3).length.should.eql(8);
        lydia.createFullDecisionMatrix(3)[0].length.should.eql(3);
        lydia.createFullDecisionMatrix(3).should.eql([
            [0, 0, 0],
            [0, 0, 1],
            [0, 1, 0],
            [0, 1, 1],
            [1, 0, 0],
            [1, 0, 1],
            [1, 1, 0],
            [1, 1, 1]
        ]);

        lydia.getMaxBinaryValueByBits(2).should.eql(3);
        lydia.getMaxBinaryValueByBits(3).should.eql(7);
    });

    it('can compute the sum of product of 2 arrays', function () {
        lydia.sumProduct([1, 2, 3], [1, 2, 3]).should.eql(14);
    });

    lydia.setupProblem([{
        potential: 10,
        slaves: 5
    }, {
        potential: 20,
        slaves: 6
    }, {
        potential: 25,
        slaves: 8
    }], 18);

    it('can reduce decision matrix with given restriction', function () {
        lydia.reduceDecisionMatrix().should.eql([
            [0, 0, 0],
            [0, 0, 1],
            [0, 1, 0],
            [0, 1, 1],
            [1, 0, 0],
            [1, 0, 1],
            [1, 1, 0]
        ]);
    });

    it('can find best decisions', function () {
        var res = lydia.findBestDecisions();

        res.decisions.should.eql([
            [0, 1, 1]
        ]);

        res.output.should.eql(45);
    });

    it('can find best decisions more smartly', function () {
        var res = lydia.findMostOutput();

        res.should.eql(45);

        lydia.solution.levels.should.eql(3);

        lydia.decisionTree.output.should.eql(45);

        var path = lydia.getSolutionPath();
        path.should.eql([false, true, true]);

        lydia.solution.decisions.should.eql([
            [0, 1, 1]
        ]);

        lydia.solution.output.should.eql(45);
    });
});
