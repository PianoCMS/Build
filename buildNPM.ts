import { build, emptyDir } from "https://deno.land/x/dnt@0.20.0/mod.ts";
let { mappings, shims, compilerOptions, packageData, entryPoints } = await import(`${Deno.cwd()}/pkg.ts`);

if (entryPoints === []) {
  entryPoints = ["./src/mod.ts"];
}

export async function buildNPM() {
  await emptyDir("./dist-node");

  await build({
    entryPoints: entryPoints,
    outDir: "./dist-node",
    mappings: { ...mappings },
    shims: { ...shims },
    test: true,
    compilerOptions: {
      importHelpers: true,
      target: "ES2021",
      ...compilerOptions
    },
    package: {
      devDependencies: {
        "@types/node": "^16",
      },
      ...packageData,
    },
  });

  await Deno.copyFile("LICENSE.md", "dist-node/LICENSE.md");
  await Deno.copyFile("README.md", "dist-node/README.md");
  await Deno.copyFile("install.json", "dist-node/install.json");
}