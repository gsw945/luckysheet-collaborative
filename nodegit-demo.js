const Git = require("nodegit");
const path = require("path");
const fse = require("fs-extra");

const root = '/home/fishmint/projs/doc-store';
const repoName = 'demo-012';
let repoDir = path.join(root, repoName);

async function ensureRepo() {
    return await fse.ensureDir(repoDir)
        .then(() => {
            console.log('ensureDir:', repoDir)
            return Git.Repository.open(repoDir);
        })
        .catch((error) => {
            console.error('error:', (error != null && error instanceof Error) ? error.message : error);
            const is_bare = 0;
            return Git.Repository.init(repoDir, is_bare);
        });
}

async function main() {
    let gitRepo = await ensureRepo();
    console.log('gitRepo:', gitRepo);
}

main();