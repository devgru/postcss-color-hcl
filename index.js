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
    return objectToArray(hcl).every(function (v) {
        return !isNaN(v);
    });
}

function colorValuesInRange(hcl) {
    var rgb = hcl.rgb();
    return objectToArray(rgb).every(function (v) {
        return v >= 0 && v <= 255;
    });
}

function transformDecl(decl) {
    var value = decl.value;

    function reduceHcl(body) {
        var hclValues = body.split(',').map(justFloat);
        var hclColor = d3.hcl.apply(null, hclValues);
        if (!colorValuesDefined(hclColor))
            throw decl.error('Unable to parse color: "' + value + '"');
        if (!colorValuesInRange(hclColor))
            throw decl.error('HCL color out of range: "' + value + '"');
        var hex = hclColor.toString();
        if (hclValues.length == 4) {
            var α = hclValues[3];
            var rgb = d3.rgb(hex);
            return ['rgba(', rgb.r, ', ', rgb.g, ', ', rgb.b, ', ', α, ')'].join('');
        }

        return hex;
    }

    decl.value = reduceFunctionCall(value, 'hcl', reduceHcl);
}

function colorHcl(css) {
    css.eachDecl(transformDecl);
}

module.exports = postcss.plugin('postcss-color-hcl', function colorHclPlugin() {
    return colorHcl;
});
