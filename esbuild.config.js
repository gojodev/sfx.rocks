require("esbuild").build({
    // the entry point file described above
    entryPoints: ["./public//home.js"],
    // the build folder location described above
    outfile: "./public/bundle.js",
    bundle: true,
    // Replace with the browser versions you need to target
    target: ["chrome60", "firefox60", "safari11", "edge20"],
    // Optional and for development only. This provides the ability to
    // map the built code back to the original source format when debugging.
    sourcemap: "inline",
}).catch(() => process.exit(1));