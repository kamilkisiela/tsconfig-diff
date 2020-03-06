#!/usr/bin/env node

/// @ts-check

const { resolve } = require("path");
const R = require("ramda");
const diff = require("jest-diff").default;
const format = require("pretty-format");

const cwd = process.cwd();

/**
 * @param {string} filepath
 */
function read(filepath) {
  const abspath = resolve(cwd, filepath);
  const pos = abspath.lastIndexOf("/");
  const config = require(abspath);

  const paths = {
    dir: abspath.substr(0, pos),
    file: abspath.substr(pos + 1)
  };

  if (config.extends) {
    const file = config.extends.toLowerCase().endsWith(".json")
      ? config.extends
      : config.extends + ".json";

    const obj = mergeLeft(config, read(resolve(cwd, resolve(paths.dir, file))));

    if (obj.extends) {
      delete obj.extends;
    }

    return obj;
  }

  return config;
}

/**
 * @param {any} a
 * @param {any} b
 * @returns {object}
 */
function mergeLeft(a, b) {
  return R.mergeDeepWith((left, right) => {
    if (Array.isArray(left) || Array.isArray(right)) {
      return left;
    }

    if (isObject(left) || isObject(right)) {
      return R.mergeLeft(a, b);
    }

    return left;
  })(a, b);
}

function isObject(val) {
  return !!val && typeof val === "object";
}

/**
 * @param {Record<string, any>} obj
 * @returns {Record<string, any>}
 */
function sortObj(obj) {
  const sortByFirstItem = R.sortBy(R.prop(0));
  const newObj = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const val = obj[key];

      if (Array.isArray(val)) {
        newObj[key] = R.sort((a, b) => a - b, val);
      } else if (isObject(val)) {
        newObj[key] = sortObj(val);
      } else {
        newObj[key] = val;
      }
    }
  }

  return R.fromPairs(sortByFirstItem(R.toPairs(newObj)));
}

const [, , pathA, pathB] = process.argv;

/**
 * @param {string} a
 * @param {string} b
 */
function compare(a, b) {
  const tsconfigA = read(resolve(cwd, a));
  const tsconfigB = read(resolve(cwd, b));

  const config = {
    a: format(sortObj(tsconfigA)),
    b: format(sortObj(tsconfigB))
  };

  return diff(config.b, config.a);
}

console.log(compare(pathA, pathB));
