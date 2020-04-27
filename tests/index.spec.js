const fs = require("fs");
const path = require("path");

const reporter = require("../src/reporter");

describe("Tests", () => {
  it("Test1?", () => {
    const dir = "fixtures/01-basic";
    const cwd = path.resolve(__dirname, dir);

    const config = require(path.join(cwd, "metrics.config"));

    const result = reporter(config.tasks, { cwd });
    const expected = fs.readFileSync(path.join(cwd, "expected.txt"), "utf8");

    expect(result).toEqual(expected);
  });

  // it("should correctly report 2 different types", () => {
  //   const dir = "fixtures/02-js-and-css";
  //   const cwd = path.resolve(__dirname, dir);

  //   const config = require(path.join(cwd, "metrics.config"));

  //   const result = reporter(config.tasks, { cwd });
  //   const expected = fs.readFileSync(path.join(cwd, "expected.txt"), "utf8");

  //   expect(result).toEqual(expected);
  // });

  it("should throw if task has no type", () => {
    // TODO
  });

  it("should use default metric name", () => {
    // TODO
  });

  it("should use default metric help", () => {
    // TODO
  });

  it("should use gzip compression by default", () => {
    // TODO
  });
});
