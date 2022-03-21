import { build, emptyDir } from "https://deno.land/x/dnt@0.20.0/mod.ts";

// deno-lint-ignore no-explicit-any
export async function buildNPM(options: {[key: string]: any}) {

  if (options.entryPoints === []) {
    options.entryPoints = ["./src/mod.ts"];
  }
  
  await emptyDir("./dist-node");

  await build({
    entryPoints: options.entryPoints,
    outDir: "./dist-node",
    mappings: { ...options.mappings },
    shims: { ...options.shims },
    test: true,
    compilerOptions: {
      importHelpers: true,
      target: "ES2021",
      ...options.compilerOptions
    },
    package: {
      devDependencies: {
        "@types/node": "^16",
      },
      ...options.packageData,
    },
  });

  await Deno.copyFile("LICENSE.md", "dist-node/LICENSE.md");
  await Deno.copyFile("README.md", "dist-node/README.md");
  await Deno.copyFile("pkg.ts", "dist-node/pkg.js");
}