import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const projectsRaw = fs.readFileSync(path.resolve("src/data/projects.json"), "utf-8");
const profilePtRaw = fs.readFileSync(path.resolve("src/data/profile.pt.json"), "utf-8");
const profileEnRaw = fs.readFileSync(path.resolve("src/data/profile.en.json"), "utf-8");
const homeSectionRaw = fs.readFileSync(path.resolve("src/sections/home.js"), "utf-8");

const projectsData = JSON.parse(projectsRaw);
const profilePt = JSON.parse(profilePtRaw);
const profileEn = JSON.parse(profileEnRaw);

assert.equal(profilePt.contacts.email, "victoreduardo.alm@gmail.com");
assert.equal(profileEn.contacts.email, "victoreduardo.alm@gmail.com");
assert.equal(profilePt.profileImage, "./public/images/profile.webp");
assert.equal(profilePt.resume.available, true);
assert.equal(fs.existsSync(path.resolve("public/images/profile.webp")), true);
assert.equal(fs.existsSync(path.resolve("public/documents/resume.pdf")), true);

assert.equal(homeSectionRaw.includes("88%"), false);
assert.equal(homeSectionRaw.includes("84%"), false);
assert.equal(homeSectionRaw.includes("80%"), false);

const validStatuses = new Set(Object.keys(projectsData.statusLabels["pt-BR"]));
assert.equal(projectsData.projects.length, 5);

const systemRpg = projectsData.projects.find((p) => p.id === "systemrpg");
assert.equal(systemRpg.demo, null);
assert.equal(systemRpg.repository, "https://github.com/VictorEduardo-coder/SystemRPG");

const guardiao = projectsData.projects.find((p) => p.id === "guardiao-mobile");
assert.equal(guardiao.repository, "https://github.com/VictorEduardo-coder/GuardiaoMobile");

for (const project of projectsData.projects) {
  assert.ok(project.id);
  assert.ok(project.repository && project.repository.startsWith("https://github.com/VictorEduardo-coder/"));
  assert.ok(validStatuses.has(project.status));
  assert.notEqual(project.status, "completed");
}

console.log("All project, repository, email-only privacy, and schema tests passed.");
