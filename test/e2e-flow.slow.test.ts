import fsExtra from "fs-extra";
import execa from "execa";
import path from "path";
import * as testHelpers from "./test-helpers";

let emptyFolderForATest: string;

beforeEach(async () => {
  emptyFolderForATest = await testHelpers.createUniqueFolder(__dirname);
});

afterEach(async () => {
  await fsExtra.remove(emptyFolderForATest);
});

describe("Non-interactive", () => {
  test("When passing no parameters, the generated app sanity tests pass", async () => {
    // Arrange
    console.time("build-link");
    await execa("npm", ["run", "build"]);
    await execa("npm", ["link", "--force"], {
      cwd: path.join(__dirname, "../.dist"),
    });
    console.timeEnd("build-link");

    // Act
    console.time("generate");
    const a = await execa("practica", ["generate", "--install-dependencies"], {
      cwd: emptyFolderForATest,
    });
    console.timeEnd("generate");

    // Assert
    console.time("test");
    const testResult = await execa("npm", ["test"], {
      cwd: path.join(
        emptyFolderForATest,
        "default-app-name",
        "services",
        "order-service"
      ),
    });
    console.timeEnd("test");
    expect(testResult.exitCode).toBe(0);
  }, 100000);
});
