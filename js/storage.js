/* ==============================================
   FOODCONNECT - STORAGE MODULE
   All localStorage interactions go here.
============================================== */

/* --- Keys --- */
const KEYS = {
  foods:       'foodConnectFoods',
  trusts:      'foodConnectTrusts',
  requests:    'foodConnectRequests',  /* standalone requests (request page) */
  funds:       'foodConnectFunds',
  users:       'foodConnectUsers',
  demo:        'foodConnectDemoSeeded'
};

/* --- Generic Helpers --- */
function loadData(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch(e) {
    return [];
  }
}

function saveData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch(e) {
    console.warn('Storage write failed:', e);
  }
}

function loadSingle(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || null;
  } catch(e) {
    return null;
  }
}


/* --- Foods --- */
function getFoods()       { return loadData(KEYS.foods); }
function saveFoods(data)  { saveData(KEYS.foods, data); }

function addFood(food) {
  const foods = getFoods();
  foods.push(food);
  saveFoods(foods);
}

function updateFood(updatedFood) {
  let foods = getFoods();
  foods = foods.map(f => String(f.id) === String(updatedFood.id) ? updatedFood : f);
  saveFoods(foods);
}

function getFoodById(id) {
  return getFoods().find(f => String(f.id) === String(id)) || null;
}


/* --- Trusts / Organizations --- */
function getTrusts()            { return loadData(KEYS.trusts); }
function saveTrusts(data)       { saveData(KEYS.trusts, data); }
function getApprovedTrusts()    { return getTrusts().filter(t => t.status === 'Approved'); }

function addTrust(trust) {
  const trusts = getTrusts();
  trusts.push(trust);
  saveTrusts(trusts);
}

function updateTrustStatus(trustId, status, extra = {}) {
  let trusts = getTrusts();
  trusts = trusts.map(t => {
    if (t.id === trustId) return { ...t, status, ...extra };
    return t;
  });
  saveTrusts(trusts);
}

function getTrustById(id) {
  return getTrusts().find(t => t.id === id) || null;
}


/* --- Standalone Food Requests --- */
function getRequests()       { return loadData(KEYS.requests); }
function saveRequests(data)  { saveData(KEYS.requests, data); }

function addRequest(req) {
  const requests = getRequests();
  requests.push(req);
  saveRequests(requests);
}

function updateRequest(updated) {
  let requests = getRequests();
  requests = requests.map(r => r.id === updated.id ? updated : r);
  saveRequests(requests);
}

function updateRequestStatus(reqId, status) {
  let requests = getRequests();
  requests = requests.map(r => r.id === reqId ? { ...r, status } : r);
  saveRequests(requests);
}


/* --- Fund Contributions --- */
function getFunds()       { return loadData(KEYS.funds); }
function saveFunds(data)  { saveData(KEYS.funds, data); }

function addFund(fund) {
  const funds = getFunds();
  funds.push(fund);
  saveFunds(funds);
}




/* --- Organization document storage (IndexedDB) --- */
const DOC_DB_NAME = 'FoodConnectDocumentsDB';
const DOC_STORE_NAME = 'documents';

function openDocumentDB() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) { reject(new Error('IndexedDB is not supported in this browser.')); return; }
    const request = indexedDB.open(DOC_DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(DOC_STORE_NAME)) {
        db.createObjectStore(DOC_STORE_NAME, { keyPath: 'key' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveOrganizationDocument(key, file) {
  const db = await openDocumentDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DOC_STORE_NAME, 'readwrite');
    tx.objectStore(DOC_STORE_NAME).put({
      key, name: file.name, type: file.type, size: file.size, blob: file
    });
    tx.oncomplete = () => { db.close(); resolve(true); };
    tx.onerror = () => { db.close(); reject(tx.error); };
  });
}

async function getOrganizationDocument(key) {
  const db = await openDocumentDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DOC_STORE_NAME, 'readonly');
    const req = tx.objectStore(DOC_STORE_NAME).get(key);
    req.onsuccess = () => { const value = req.result; db.close(); resolve(value || null); };
    req.onerror = () => { db.close(); reject(req.error); };
  });
}

async function deleteOrganizationDocument(key) {
  try {
    const db = await openDocumentDB();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(DOC_STORE_NAME, 'readwrite');
      tx.objectStore(DOC_STORE_NAME).delete(key);
      tx.oncomplete = () => { db.close(); resolve(true); };
      tx.onerror = () => { db.close(); reject(tx.error); };
    });
  } catch (e) { return false; }
}

function migrateFoodRecords() {
  const foods = getFoods();
  const defaults = {
    1700000001: ['Veg Meals', 'Vegetarian'],
    1700000002: ['Non-Veg Meals', 'Non-Vegetarian'],
    1700000003: ['Biryani', 'Non-Vegetarian'],
    1700000004: ['Lemon Rice', 'Vegetarian']
  };
  let changed = false;
  foods.forEach(f => {
    if (!f.foodName) {
      const d = defaults[f.id] || ['Community Meals', 'Vegetarian'];
      f.foodName = d[0];
      f.foodType = d[1];
      changed = true;
    }
    if (!f.foodType) { f.foodType = 'Vegetarian'; changed = true; }
    if (!Array.isArray(f.requests)) { f.requests = []; changed = true; }
    if (typeof f.remainingQuantity !== 'number') { f.remainingQuantity = Number(f.quantity) || 0; changed = true; }
  });
  if (changed) saveFoods(foods);
}


/* --- Leaderboard Computation --- */
function computeLeaderboard() {
  const foods = getFoods();
  const map   = {};

  foods.forEach(food => {
    const key = food.donorName.trim().toLowerCase();
    if (!map[key]) {
      map[key] = {
        name:       food.donorName.trim(),
        location:   food.location || '',
        donations:  0,
        people:     0,
        points:     0
      };
    }
    map[key].donations += 1;
    map[key].people    += food.quantity || 0;
    map[key].points    += (food.quantity || 0) * 10;
  });

  const list = Object.values(map);
  list.sort((a, b) => b.points - a.points);
  return list;
}


/* --- Stats (for homepage impact section) --- */
function getSiteStats() {
  const foods    = getFoods();
  const trusts   = getTrusts();
  const requests = getRequests();
  const funds    = getFunds();

  let totalMeals   = 0;
  let totalDonors  = new Set();
  let totalPeople  = 0;

  foods.forEach(f => {
    totalMeals += f.quantity || 0;
    totalDonors.add((f.donorName || '').trim().toLowerCase());
  });

  requests.forEach(r => {
    totalPeople += r.portions || 0;
  });

  const totalFunds = funds.reduce((sum, f) => sum + (Number(f.amount) || 0), 0);

  return {
    donations:     foods.length,
    meals:         totalMeals,
    donors:        totalDonors.size,
    orgs:          trusts.filter(t => t.status === 'Approved').length,
    funds:         totalFunds,
    requests:      requests.length
  };
}


/* ==============================================
   DEMO DATA SEEDING
   Runs once on first load.
============================================== */

function seedDemoData() {
  if (localStorage.getItem(KEYS.demo)) return;

  /* Seed verified demo organizations */
  const demoTrusts = [
    {
      id: 'DEMO-TRUST-001',
      name: 'Madurai Food Bank',
      type: 'NGO',
      orgType: 'NGO',
      registrationNumber: 'TN/NGO/1442/2018',
      year: '2018',
      address: '14, Palanganatham Main Road, Madurai - 625003',
      area: 'Palanganatham',
      pincode: '625003',
      contactPerson: 'Murugesan Krishnan',
      contact: '9876501234',
      email: 'info@maduraifoodbank.org',
      support: 'Families in Need',
      status: 'Approved',
      isDemo: true,
      lat: 9.9195,
      lng: 78.1230,
      submittedAt: '15/01/2026, 10:00:00 AM',
      verifiedAt: '16/01/2026, 09:00:00 AM',
      documents: {
        registrationCertificate: { name: 'registration.pdf', type: 'application/pdf', data: null },
        trustIdProof:            { name: 'id_proof.pdf',     type: 'application/pdf', data: null },
        addressProof:            { name: 'address.pdf',      type: 'application/pdf', data: null }
      }
    },
    {
      id: 'DEMO-TRUST-002',
      name: 'Sneha Illam Charitable Trust',
      type: 'Trust',
      orgType: 'Trust',
      registrationNumber: 'TN/TRUST/0887/2015',
      year: '2015',
      address: '7, Anna Nagar 2nd Street, Madurai - 625020',
      area: 'Anna Nagar',
      pincode: '625020',
      contactPerson: 'Karpagam Subramaniam',
      contact: '9876502345',
      email: 'snehaillam@gmail.com',
      support: 'Children',
      status: 'Approved',
      isDemo: true,
      lat: 9.9350,
      lng: 78.1195,
      submittedAt: '10/02/2026, 10:00:00 AM',
      verifiedAt: '11/02/2026, 09:00:00 AM',
      documents: {
        registrationCertificate: { name: 'registration.pdf', type: 'application/pdf', data: null },
        trustIdProof:            { name: 'id_proof.pdf',     type: 'application/pdf', data: null },
        addressProof:            { name: 'address.pdf',      type: 'application/pdf', data: null }
      }
    },
    {
      id: 'DEMO-TRUST-003',
      name: 'KK Nagar Community Kitchen',
      type: 'Community Organization',
      orgType: 'Community Organization',
      registrationNumber: 'TN/CO/2211/2020',
      year: '2020',
      address: '3, KK Nagar Main Street, Madurai - 625020',
      area: 'KK Nagar',
      pincode: '625020',
      contactPerson: 'Senthilkumar Rajan',
      contact: '9876503456',
      email: 'kknagar.kitchen@gmail.com',
      support: 'Homeless People',
      status: 'Approved',
      isDemo: true,
      lat: 9.9420,
      lng: 78.1160,
      submittedAt: '05/03/2026, 10:00:00 AM',
      verifiedAt: '06/03/2026, 09:00:00 AM',
      documents: {
        registrationCertificate: { name: 'registration.pdf', type: 'application/pdf', data: null },
        trustIdProof:            { name: 'id_proof.pdf',     type: 'application/pdf', data: null },
        addressProof:            { name: 'address.pdf',      type: 'application/pdf', data: null }
      }
    },
    {
      id: 'DEMO-TRUST-004',
      name: 'Madurai Elders Care Foundation',
      type: 'Old Age Home',
      orgType: 'Old Age Home',
      registrationNumber: 'TN/OAH/0336/2012',
      year: '2012',
      address: '22, Tallakulam East Road, Madurai - 625009',
      area: 'Tallakulam',
      pincode: '625009',
      contactPerson: 'Vijayalakshmi Natarajan',
      contact: '9876504567',
      email: 'elderscaremdu@gmail.com',
      support: 'Elderly People',
      status: 'Approved',
      isDemo: true,
      lat: 9.9270,
      lng: 78.1310,
      submittedAt: '20/03/2026, 10:00:00 AM',
      verifiedAt: '21/03/2026, 09:00:00 AM',
      documents: {
        registrationCertificate: { name: 'registration.pdf', type: 'application/pdf', data: null },
        trustIdProof:            { name: 'id_proof.pdf',     type: 'application/pdf', data: null },
        addressProof:            { name: 'address.pdf',      type: 'application/pdf', data: null }
      }
    }
  ];

  /* Seed demo food donations */
  const demoFoods = [
    {
      id: 1700000001,
      donorName: 'Harini Suresh',
      quantity: 30,
      remainingQuantity: 15,
      location: 'Anna Nagar, Madurai',
      donorContact: '+91 9876500001',
      isDemo: true,
      submittedAt: '01/09/2026, 12:00:00 PM',
      requests: []
    },
    {
      id: 1700000002,
      donorName: 'Ramesh Babu',
      quantity: 20,
      remainingQuantity: 20,
      location: 'KK Nagar, Madurai',
      donorContact: '+91 9876500002',
      isDemo: true,
      submittedAt: '05/09/2026, 03:00:00 PM',
      requests: []
    },
    {
      id: 1700000003,
      donorName: 'Priya Devi',
      quantity: 50,
      remainingQuantity: 0,
      location: 'Mattuthavani, Madurai',
      donorContact: '+91 9876500003',
      isDemo: true,
      submittedAt: '10/09/2026, 11:00:00 AM',
      requests: []
    },
    {
      id: 1700000004,
      donorName: 'Harini Suresh',
      quantity: 25,
      remainingQuantity: 10,
      location: 'Anna Nagar, Madurai',
      donorContact: '+91 9876500001',
      isDemo: true,
      submittedAt: '12/09/2026, 02:00:00 PM',
      requests: []
    }
  ];

  /* Seed demo requests */
  const demoRequests = [
    {
      id: 'REQ-' + Date.now() + '-1',
      requesterName: 'Lakshmi Priya',
      contact: '+91 9876500010',
      location: 'Thirunagar, Madurai',
      portions: 15,
      trustId: 'DEMO-TRUST-001',
      trustName: 'Madurai Food Bank',
      status: 'Pending',
      isDemo: true,
      submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleString()
    }
  ];

  /* Merge with existing data (don't overwrite) */
  const existingTrusts = getTrusts();
  const existingFoods  = getFoods();
  const existingReqs   = getRequests();

  /* Only add demo trusts if they don't exist */
  demoTrusts.forEach(dt => {
    if (!existingTrusts.find(t => t.id === dt.id)) {
      existingTrusts.push(dt);
    }
  });
  saveTrusts(existingTrusts);

  demoFoods.forEach(df => {
    if (!existingFoods.find(f => f.id === df.id)) {
      existingFoods.push(df);
    }
  });
  saveFoods(existingFoods);

  demoRequests.forEach(dr => {
    if (!existingReqs.find(r => r.id === dr.id)) {
      existingReqs.push(dr);
    }
  });
  saveRequests(existingReqs);

  localStorage.setItem(KEYS.demo, '1');
}

/* Run seed on load */
seedDemoData();
migrateFoodRecords();
