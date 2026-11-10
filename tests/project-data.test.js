import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const projectsRaw = fs.readFileSync(path.resolve("src/data/projects.json"), "utf-8");
const profilePtRaw = fs.readFileSync(path.resolve("src/data/profile.pt.json"), "utf-8");
const profileEnRaw = fs.readFileSync(path.resolve("src/data/profile.en.json"), "utf-8");

const projectsData = JSON.parse(projectsRaw);
const profilePt = JSON.parse(profilePtRaw);
const profileEn = JSON.parse(profileEnRaw);

assert.equal(profilePt.contacts.email, "victoreduardo.alm@gmail.com");
assert.equal(profileEn.contacts.email, "victoreduardo.alm@gmail.com");
assert.equal(profilePt.profileImage, "./public/images/profile.webp");
assert.equal(profilePt.resume.available, true);
assert.equal(fs.existsSync(path.resolve("public/images/profile.webp")), true);
assert.equal(fs.existsSync(path.resolve("public/documents/resume.pdf")), true);

const validStatuses = new Set(Object.keys(projectsData.statusLabels["pt-BR"]));
assert.equal(projectsData.projects.length, 5);

for (const project of projectsData.projects) {
  assert.ok(project.id);
  assert.ok(project.name);
  assert.ok(project.name_en);
  assert.ok(validStatuses.has(project.status), `Invalid status ${project.status}`);
  assert.ok(Array.isArray(project.technologies) && project.technologies.length > 0);
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

console.log("All project, gallery, resume, and profile schema validation tests passed.");
