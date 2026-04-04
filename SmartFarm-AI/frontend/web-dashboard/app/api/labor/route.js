export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'labor.json');

function initializeDataFile() {
  if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
    fs.mkdirSync(path.join(process.cwd(), 'data'));
  }
  if (!fs.existsSync(dataFilePath)) {
    const initialWorkers = [
      { id:1, name:'Suresh Yadav', phone:'919999999991', skills:['Harvesting','Sowing','Irrigation'], rating:4.9, reviews: 42, exp:'8 yrs', dist:'1.2 km', rate:650, available:true, lang:'Hindi', reliability: 98, aiMatch: 95, verified: true, avatar: 'SY', lastJob: 'Harvested Wheat' },
      { id:2, name:'Ramkali Devi', phone:'919999999992', skills:['Weeding','Transplanting'], rating:4.7, reviews: 31, exp:'5 yrs', dist:'3.1 km', rate:550, available:true, lang:'Hindi, Bhojpuri', reliability: 94, aiMatch: 88, verified: true, avatar: 'RD', lastJob: 'Paddy Transplanting' },
      { id:3, name:'Arjun Patil', phone:'919999999993', skills:['Tractor Operator','Spraying'], rating:4.8, reviews: 55, exp:'10 yrs', dist:'5.5 km', rate:850, available:false, lang:'Marathi, Hindi', reliability: 99, aiMatch: 92, verified: true, avatar: 'AP', lastJob: 'Pesticide Application' },
      { id:4, name:'Krishnamma S.', phone:'919999999994', skills:['Harvesting','Grading','Packing'], rating:4.6, reviews: 18, exp:'6 yrs', dist:'2.8 km', rate:600, available:true, lang:'Telugu, Kannada', reliability: 89, aiMatch: 85, verified: false, avatar: 'KS', lastJob: 'Tomato Grading' },
      { id:5, name:'Mohan Gawli', phone:'919999999995', skills:['Drone Operator','Spraying','Tech Equip'], rating:5.0, reviews: 12, exp:'3 yrs', dist:'8.2 km', rate:1200, available:true, lang:'Marathi, English', reliability: 100, aiMatch: 97, verified: true, avatar: 'MG', lastJob: 'Drone Spraying' },
      { id:6, name:'Fatima Shaikh', phone:'919999999996', skills:['Weeding','Sowing','Fertilization'], rating:4.5, reviews: 24, exp:'4 yrs', dist:'4.0 km', rate:500, available:true, lang:'Urdu, Hindi', reliability: 91, aiMatch: 81, verified: true, avatar: 'FS', lastJob: 'Fertilizer Spread' },
      { id:7, name:'Vijay Kumar', phone:'919999999997', skills:['Irrigation','Hard Labor','Tractor'], rating:4.9, reviews: 88, exp:'15 yrs', dist:'2.0 km', rate:700, available:true, lang:'Hindi, Punjabi', reliability: 96, aiMatch: 90, verified: true, avatar: 'VK', lastJob: 'Pipe Laying' },
      { id:8, name:'Sunita Meena', phone:'919999999998', skills:['Harvesting','Weeding'], rating:4.4, reviews: 9, exp:'2 yrs', dist:'6.0 km', rate:450, available:true, lang:'Hindi', reliability: 85, aiMatch: 75, verified: false, avatar: 'SM', lastJob: 'Cotton Picking' }
    ];
    fs.writeFileSync(dataFilePath, JSON.stringify(initialWorkers, null, 2));
  }
}

export async function GET() {
  initializeDataFile();
  const fileContents = fs.readFileSync(dataFilePath, 'utf8');
  return NextResponse.json(JSON.parse(fileContents));
}

export async function POST(req) {
  initializeDataFile();
  const newWorker = await req.json();
  const fileContents = fs.readFileSync(dataFilePath, 'utf8');
  const workers = JSON.parse(fileContents);
  workers.unshift(newWorker);
  fs.writeFileSync(dataFilePath, JSON.stringify(workers, null, 2));
  return NextResponse.json({ success: true, worker: newWorker });
}
