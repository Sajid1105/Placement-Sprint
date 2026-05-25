import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { TimelineDay } from '../models/TimelineDay.js';
import { Resource } from '../models/Resource.js';
import { DsaProblem } from '../models/DsaProblem.js';
import timelineDays from './seed/timelineData.js';
import { resources } from './seed/resourcesData.js';
import { dsaProblems } from './seed/dsaProblemsData.js';

async function seed() {
  await connectDB();
  console.log('Seeding Placement Sprint database...');

  await TimelineDay.deleteMany({});
  await Resource.deleteMany({});
  await DsaProblem.deleteMany({});

  const timeline = timelineDays.map((d) => ({ ...d, unlockDay: d.dayNumber }));
  await TimelineDay.insertMany(timeline);
  console.log(`Timeline: ${timeline.length} days`);

  await Resource.insertMany(resources);
  console.log(`Resources: ${resources.length} topics`);

  await DsaProblem.insertMany(dsaProblems);
  console.log(`DSA problems: ${dsaProblems.length}`);

  console.log('Seed complete.');
  await mongoose.disconnect();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
