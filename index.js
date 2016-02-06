var postcss = require('postcss');
var reduceFunctionCall = require('reduce-function-call');
var d3 = require('d3-color');

function justFloat(n) {
    return parseFloat(n);
}

function objectToArray(o) {
    return Object.keys(o).map(function (key) {
        return o[key];
    });
}

function colorValuesDefined(hcl) {
    return !objectToArray(hcl).some(isNaN);
}

function transformDecl(decl) {
    var value = decl.value;

    function reduceHcl(body) {
        var hclaValues = body.split(',').map(justFloat);
        var hclColor = d3.hcl.apply(null, hclaValues);
        if (!colorValuesDefined(hclColor)) {
            throw decl.error('Unable to parse color: "' + value + '"');
        }
        if (!hclColor.displayable()) {
            throw decl.error('HCL color out of range: "' + value + '"');
        }
        return hclColor.toString();
    }

    decl.value = reduceFunctionCall(value, 'hcl', reduceHcl);
}

function colorHcl(css) {
    css.walkDecls(transformDecl);
}

module.exports = postcss.plugin('postcss-color-hcl', function colorHclPlugin() {
    return colorHcl;
});
