/**
 * Copyright (c) 2016, John Hewson
 * All rights reserved.
 */
"use strict";
function moduleToElm(name, expose, imports, decls) {
    var warn = '{-\n    This file is automatically generated by elm-graphql. Do not modify!\n-}\n';
    return warn + 'module ' + name + ' (' + expose.join(', ') + ') where\n' +
        imports.map(function (str) { return '\nimport ' + str; }).join('') + '\n\n' +
        decls.map(declToElm).join('\n\n');
}
exports.moduleToElm = moduleToElm;
function declToElm(decl) {
    if (decl.constructors) {
        return typeToElm(decl);
    }
    else if (decl.returnType) {
        return functionToElm(decl);
    }
    else {
        return aliasToElm(decl);
    }
}
exports.declToElm = declToElm;
function typeToElm(type) {
    return 'type ' + type.name + '\n' +
        '    = ' + type.constructors.join('\n    | ') + '\n';
}
exports.typeToElm = typeToElm;
function aliasToElm(type) {
    return 'type alias ' + type.name + ' =\n' +
        '    { ' + type.fields.map(function (f) { return fieldToElm(f, 1); }).join('\n    , ') + '    }\n';
}
exports.aliasToElm = aliasToElm;
function functionToElm(func) {
    var paramTypes = func.parameters.map(function (p) { return p.type; }).join(' -> ');
    var paramNames = func.parameters.map(function (p) { return p.name; }).join(' ');
    var arrow = paramTypes.length > 0 ? ' -> ' : '';
    var space = paramTypes.length > 0 ? ' ' : '';
    return func.name + ' : ' + paramTypes + arrow + func.returnType + '\n' +
        func.name + space + paramNames + ' =\n    ' + exprToElm(func.body, 0) + '\n';
}
exports.functionToElm = functionToElm;
function fieldToElm(field, level) {
    if (field.type) {
        return leafToElm(field);
    }
    else {
        return recordToElm(field, level + 1);
    }
}
function recordToElm(record, level) {
    var indent = makeIndent(level);
    var list = record.list ? 'List ' : '';
    var type = ("" + indent + list + "{ ") +
        record.fields.map(function (f) { return fieldToElm(f, level); }).join(indent + ", ") +
        (indent + "}");
    return record.name + ' :\n' + type + '\n';
}
function leafToElm(field) {
    return field.name + ' : ' + field.type + '\n';
}
function makeIndent(level) {
    var str = '';
    for (var i = 0; i < level; i++) {
        str += '    ';
    }
    return str;
}
function exprToElm(expr, level) {
    return expr.expr; // todo: expression trees
}
exports.exprToElm = exprToElm;