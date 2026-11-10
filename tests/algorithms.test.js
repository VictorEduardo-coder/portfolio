import assert from "node:assert/strict";
import {
  runQuickSortSteps,
  runBinarySearchSteps,
  runLinearSearchSteps,
  runStackQueueSimulation,
  runKnapsackStudyPlanner
} from "../src/lab/algorithm-lab.js";
import { simulateApiRequest, resetApiSimulatorStore } from "../src/lab/api-simulator.js";
import { filterProjectsList } from "../src/sections/projects.js";

const sortResult = runQuickSortSteps([42, 15, 8, 99, 23, 4, 16]);
assert.deepEqual(sortResult.result, [4, 8, 15, 16, 23, 42, 99]);
assert.ok(sortResult.steps.length >= 2);

const searchFound = runBinarySearchSteps([4, 8, 15, 16, 23, 42, 99], 23);
assert.equal(searchFound.result, 4);

const searchMissing = runBinarySearchSteps([4, 8, 15, 16, 23, 42, 99], 50);
assert.equal(searchMissing.result, -1);

const linearFound = runLinearSearchSteps([42, 15, 8, 99, 23, 4, 16], 23);
assert.equal(linearFound.result, 4);

const sqResult = runStackQueueSimulation([10, 20, 30, 40]);
assert.equal(sqResult.popped, 40);
assert.equal(sqResult.dequeued, 10);
assert.deepEqual(sqResult.stackRemaining, [10, 20, 30]);
assert.deepEqual(sqResult.queueRemaining, [20, 30, 40]);

const knapsack = runKnapsackStudyPlanner(6);
assert.equal(knapsack.maxPriorityScore, 20);
assert.equal(
  knapsack.selectedTasks.reduce((acc, item) => acc + item.hours, 0) <= 6,
  true
);

resetApiSimulatorStore();
const getRes = simulateApiRequest("GET", "/api/v1/sheets", "");
assert.equal(getRes.status, 200);
assert.equal(getRes.responseBody.count, 2);

const rejectSecret = simulateApiRequest("POST", "/api/v1/sheets", '{"character":"Test","password":"123"}');
assert.equal(rejectSecret.status, 422);

const createValid = simulateApiRequest("POST", "/api/v1/sheets", '{"character":"Vex","chassis":"Titan","level":5}');
assert.equal(createValid.status, 201);
assert.equal(createValid.responseBody.created.character, "Vex");

const sampleProjects = [
  { id: "p1", category: "backend", status: "optimization", technologies: ["Java", "Spring Boot"] },
  { id: "p2", category: "mobile", status: "development", technologies: ["Kotlin"] }
];
assert.equal(filterProjectsList(sampleProjects, "backend", "all", "all").length, 1);
assert.equal(filterProjectsList(sampleProjects, "all", "Kotlin", "development").length, 1);
assert.equal(filterProjectsList(sampleProjects, "backend", "Kotlin", "all").length, 0);

console.log("All algorithm, API simulator, and project filter tests passed.");
