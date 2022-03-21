//Use sourcecode and dist-node files to build esm, cjs and deno zips.

import { emptyDir } from "https://deno.land/x/dnt@0.20.0/mod.ts";
import { copySync } from "https://deno.land/std@0.130.0/fs/copy.ts";
import { tar } from "https://deno.land/x/compress@v0.4.5/mod.ts";


async function createTar(dir: string, output: string) {
  const tar = await Deno.run({
    cmd: ["tar", "czf", output, "--directory", dir, "."],
    stdout: "piped",
  });
  await tar.status();
  await tar.close();
}

export async function pack(packageData: {[key:string]: any}, pkgRoot: string) {
    await emptyDir("./packages");
    const bundles = ['esm', 'cjs', 'deno'];
    for await(const bundle of bundles) {
        Deno.mkdirSync(`./packages/dist-${bundle}`);
        switch(bundle) {
            case 'esm':
                copySync(`./dist-node/esm`, `./packages/dist-esm/lib`);
                copySync(`./dist-node/types`, `./packages/dist-esm/types`);
                break;
            case 'cjs':
                copySync(`./dist-node/script`, `./packages/dist-cjs/lib`);
                copySync(`./dist-node/types`, `./packages/dist-cjs/types`);
                break;
            case 'deno':
                copySync(`./`, `./packages/dist-deno`);
                break;
        }

        await tar.compress(`./packages/dist-${bundle}`, `./packages/dist-${bundle}.tar`);
    }
}

