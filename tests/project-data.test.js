import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const projectsRaw = fs.readFileSync(path.resolve("src/data/projects.json"), "utf-8");
const profilePtRaw = fs.readFileSync(path.resolve("src/data/profile.pt.json"), "utf-8");
const profileEnRaw = fs.readFileSync(path.resolve("src/data/profile.en.json"), "utf-8");
const indexHtml = fs.readFileSync(path.resolve("index.html"), "utf-8");

const projectsData = JSON.parse(projectsRaw);
const profilePt = JSON.parse(profilePtRaw);
const profileEn = JSON.parse(profileEnRaw);

assert.equal(profilePt.contacts.email, "victoreduardo.alm@gmail.com");
assert.equal(profileEn.contacts.email, "victoreduardo.alm@gmail.com");
assert.equal(profilePt.profileImage, "./public/images/profile.webp");
assert.equal(profilePt.resume.available, true);
assert.equal(fs.existsSync(path.resolve("public/images/profile.webp")), true);
assert.equal(fs.existsSync(path.resolve("public/images/og-cover.png")), true);
assert.equal(fs.existsSync(path.resolve("public/documents/resume.pdf")), true);
assert.match(indexHtml, /https:\/\/victoreduardo-coder\.github\.io\/portfolio\/public\/images\/og-cover\.png/);

// Ensure no semester/period number leaks into profile or project texts
const semesterPattern = /\b(1º|2º|3º|4º|5º|6º|7º|8º|9º|10º|3rd|third)\s*(per[ií]odo|semester)/i;
assert.doesNotMatch(profilePtRaw, semesterPattern, "Semester mention found in profile.pt.json");
assert.doesNotMatch(profileEnRaw, semesterPattern, "Semester mention found in profile.en.json");
assert.doesNotMatch(projectsRaw, semesterPattern, "Semester mention found in projects.json");
assert.doesNotMatch(indexHtml, semesterPattern, "Semester mention found in index.html");

const validStatuses = new Set(Object.keys(projectsData.statusLabels["pt-BR"]));
assert.equal(projectsData.projects.length, 4);

for (const project of projectsData.projects) {
  assert.ok(project.id);
  assert.ok(project.name);
  assert.ok(project.name_en);
  assert.ok(validStatuses.has(project.status), `Invalid status ${project.status}`);
  assert.ok(Array.isArray(project.technologies) && project.technologies.length > 0);
  const mainImg = project.image.replace("./", "");
  assert.equal(fs.existsSync(path.resolve(mainImg)), true, `Missing main image ${mainImg}`);
  assert.ok(Array.isArray(project.gallery) && project.gallery.length > 0);
  for (const slide of project.gallery) {
    const relImg = slide.src.replace("./", "");
    assert.equal(fs.existsSync(path.resolve(relImg)), true, `Missing gallery image ${relImg}`);
  }
  assert.ok(Array.isArray(project.pt.implemented));
  assert.ok(Array.isArray(project.pt.inProgress));
  assert.ok(Array.isArray(project.pt.nextSteps));
  assert.ok(Array.isArray(project.en.implemented));
  assert.ok(Array.isArray(project.en.inProgress));
  assert.ok(Array.isArray(project.en.nextSteps));
  assert.notEqual(project.status, "completed");
}

console.log("All project, gallery, resume, OG metadata, and profile schema validation tests passed.");
