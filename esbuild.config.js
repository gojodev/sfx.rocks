import { build } from "esbuild";

build({
    entryPoints: ["./public/home.js"],
    outfile: "./public/bundle.js",
    bundle: true,
    target: ["chrome60", "firefox60", "safari11", "edge20"],
    sourcemap: "inline",
}).catch(() => process.exit(1));
