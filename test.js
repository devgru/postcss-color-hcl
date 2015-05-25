'use strict';

var postcss = require('postcss');
var hcl = require('./');
var test = require('tape');

function useHcl() {
    return postcss().use(hcl());
}

test('filterDeclarations()', function(t) {
    t.plan(7);

    t.equal(
        useHcl().process('a { color: hcl(0, 0, 50); }').css,
        'a { color: #777777; }',
        'should convert hcl(H, C, L) to #RRGGBB.'
    );

    t.equal(
        useHcl().process('a { color: hcl(21, 70, 50, 0.5); }').css,
        'a { color: rgba(221, 52, 80, 0.5); }',
        'should convert hcl(H, C, L, α) to rgba(R, G, B, α).'
    );

    t.equal(
        useHcl().process('a { color: rgb(255, 0, 0); }').css,
        'a { color: rgb(255, 0, 0); }',
        'should not modify original CSS when hcl() is not used.'
    );

    t.throws(
        function () {
            useHcl().process('a { color: hcl(); }').css;
        },
        /Unable to parse color: "hcl\(\)"/,
        'should throw an error when hcl() doesn\'t take any arguments.'
    );

    t.throws(
        function() {
            useHcl().process('a { color: hcl(,foo); }').css;
        },
        /Unable to parse color: "hcl\(,foo\)"/,
        'should throw an error when hcl() takes invalid argument.'
    );

    t.throws(
        function() {
            useHcl().process('a {color: hcl(red); }', {from: 'fixture.css'}).css;
        },
        /fixture\.css:1:4: Unable to parse color: "hcl\(red\)"/,
        'should throw a detailed error when a source file is specified.'
    );

    t.throws(
        function() {
            useHcl().process('a {color: hcl(,)}', {map: true}).css;
        },
        /<css input>:1:4: Unable to parse color: "hcl\(,\)"/,
        'should throw a detailed error when source map is enabled but file isn\'t specified.'
    );
});