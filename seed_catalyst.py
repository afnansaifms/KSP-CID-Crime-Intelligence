import requests
import json
import random
import time
from datetime import datetime, timedelta
from faker import Faker

fake = Faker('en_IN')
random.seed(42)

# ── CONFIG ────────────────────────────────────────────────────────────────
PROJECT_ID = '50036000000013048'
CATALYST_TOKEN = "w_1000.xxxxxxxxx.xxxxxxcx"  # get from Catalyst Console → Settings → API Token

BASE_URL = f'https://api.catalyst.zoho.in/baas/v1/project/{PROJECT_ID}/table'

HEADERS = {
    'Authorization': f'Zoho-oauthtoken {CATALYST_TOKEN}',
    'Content-Type': 'application/json',
}

# ── DATA ──────────────────────────────────────────────────────────────────
DISTRICTS = {
    'Bengaluru Urban':    (12.9716, 77.5946),
    'Bengaluru Rural':    (13.0072, 77.5970),
    'Mysuru':             (12.2958, 76.6394),
    'Mangaluru':          (12.9141, 74.8560),
    'Hubballi-Dharwad':   (15.3647, 75.1240),
    'Belagavi':           (15.8497, 74.4977),
    'Kalaburagi':         (17.3297, 76.8343),
    'Shivamogga':         (13.9299, 75.5681),
    'Vijayapura':         (16.8302, 75.7100),
    'Tumakuru':           (13.3409, 77.1010),
    'Dakshina Kannada':   (12.8438, 75.2479),
    'Hassan':             (13.0043, 76.1003),
    'Udupi':              (13.3409, 74.7421),
    'Chitradurga':        (14.2293, 76.3985),
    'Raichur':            (16.2120, 77.3566),
}

POLICE_STATIONS = {
    'Bengaluru Urban': ['Koramangala', 'HSR Layout', 'Whitefield', 'Indiranagar', 'Shivajinagar', 'MG Road', 'Hebbal', 'Yelahanka', 'JP Nagar', 'Electronic City'],
    'Mysuru':          ['Vijayanagar', 'N.R. Mohalla', 'Jayalakshmipuram', 'Nazarbad', 'Kuvempunagar'],
    'Mangaluru':       ['Pandeshwar', 'Urva', 'Bajpe', 'Surathkal', 'Ullal'],
    'Hubballi-Dharwad':['Keshwapur', 'Gokul Road', 'Navanagar', 'Dharwad Town'],
    'Belagavi':        ['Belgaum Town', 'Hindwadi', 'Angol', 'Shahapur'],
}
for d in DISTRICTS:
    if d not in POLICE_STATIONS:
        POLICE_STATIONS[d] = [f'{d.split()[0]} Town', f'{d.split()[0]} Rural']

CRIMES = [
    ('ROBBERY',          'IPC 392/397',    'HIGH',   0.10),
    ('THEFT',            'IPC 379',         'LOW',    0.18),
    ('ASSAULT',          'IPC 324/307',     'HIGH',   0.10),
    ('MURDER',           'IPC 302',         'HIGH',   0.04),
    ('DRUG_TRAFFICKING', 'NDPS 20(b)(ii)',  'HIGH',   0.08),
    ('FRAUD',            'IPC 420/406',     'MEDIUM', 0.10),
    ('CYBERCRIME',       'IT Act 66C',      'MEDIUM', 0.12),
    ('EXTORTION',        'IPC 384/506',     'HIGH',   0.05),
    ('KIDNAPPING',       'IPC 363/365',     'HIGH',   0.03),
    ('BURGLARY',         'IPC 457/380',     'MEDIUM', 0.07),
    ('CHEATING',         'IPC 420',         'MEDIUM', 0.05),
    ('GAMBLING',         'KPA 87',          'LOW',    0.04),
    ('SEXUAL_OFFENCE',   'IPC 354/376',     'HIGH',   0.04),
]

STATUSES    = ['Open', 'Under Investigation', 'Under Investigation', 'Charge Sheeted', 'Closed']
OFFICERS    = ['SI Venkatesh Kumar', 'SI Rekha Nair', 'PI Shashidhar B.N.', 'DSP Arjun Reddy', 'ACP Nagendra Rao', 'SI Harish Shetty', 'PI Basavraj Patil', 'SI Anita Sharma', 'SI Priya Menon', 'HC Mahesh Gowda']
OCCUPATIONS = ['Auto Driver', 'Mechanic', 'Farmer', 'Unemployed', 'Business', 'Labourer', 'Vegetable vendor', 'Contractor', 'Lorry driver', 'Student']
EDUCATIONS  = ['Class 7', 'Class 8', 'SSLC', 'PUC', 'ITI', 'Diploma', 'Graduate']
MOS         = ['ATM robbery at night', 'Two-wheeler chain snatching', 'House breaking at dawn', 'CCTV disabling before theft', 'Online UPI fraud', 'WhatsApp investment scam', 'SIM swap fraud', 'Drug courier inter-city', 'Hawala money transfer', 'Gang assault', 'Knife attack', 'Vehicle theft from parking']

KN_FIRST = ['Ravi', 'Suresh', 'Mahesh', 'Rajesh', 'Ganesh', 'Ramesh', 'Prakash', 'Santosh', 'Girish', 'Harish', 'Rakesh', 'Pradeep', 'Kiran', 'Arun', 'Vinod', 'Manjunath', 'Basavaraj', 'Shivaraj', 'Mohammad', 'Abdul', 'Farhan', 'Imran', 'Salim', 'Ashok', 'Deepak', 'Naveen', 'Lokesh']
KN_LAST  = ['Kumar', 'Gowda', 'Reddy', 'Naik', 'Shetty', 'Patil', 'Rao', 'Sharma', 'Hegde', 'Kamath', 'Bhat', 'Hiremath', 'Sheikh', 'Khan', 'Patel']
KN_SUFF  = ['G.', 'B.N.', 'K.', 'S.', 'R.', 'M.', 'T.', 'P.']

def kn_name():
    return f"{random.choice(KN_FIRST)} {random.choice(KN_SUFF)} {random.choice(KN_LAST)}"

# ── API HELPERS ────────────────────────────────────────────────────────────
def get_table_id(table_name):
    r = requests.get(f'{BASE_URL}', headers=HEADERS)
    tables = r.json().get('data', [])
    for t in tables:
        if t['table_name'] == table_name:
            return t['table_id']
    return None

def insert_rows(table_id, rows, batch_size=10):
    url = f'{BASE_URL}/{table_id}/row'
    success = 0
    for i in range(0, len(rows), batch_size):
        batch = rows[i:i+batch_size]
        payload = {'data': batch}
        r = requests.post(url, headers=HEADERS, json=payload)
        if r.status_code == 200:
            success += len(batch)
        else:
            print(f'  Error batch {i//batch_size}: {r.text[:200]}')
        time.sleep(0.3)  # rate limit
    return success

# ── GENERATE DATA ──────────────────────────────────────────────────────────
print('Generating accused records...')
accused_rows = []
accused_ids  = []

for i in range(100):
    did = random.choice(list(DISTRICTS.keys()))
    risk = random.randint(30, 98)
    crimes = random.sample([c[0] for c in CRIMES], k=random.randint(1, 4))
    mo     = random.sample(MOS, k=random.randint(1, 3))
    prior  = random.randint(0, 12)
    warrant   = risk > 75 and prior > 3 and random.random() > 0.3
    fin_links = risk > 70 and random.random() > 0.4
    last_loc  = random.choice(['Absconding', 'Last traced Hyderabad', 'Suspected Dubai', 'Unknown', f'{did} area']) if warrant and random.random() > 0.4 else ''
    acc_id    = f'ACC{i+1:03d}'
    accused_ids.append(acc_id)

    accused_rows.append({
        'CaseMasterID':      '',
        'AccusedName':       kn_name(),
        'Alias':             random.choice(KN_FIRST) if random.random() > 0.6 else '',
        'AgeYear':           str(random.randint(19, 58)),
        'GenderID':          'M' if random.random() > 0.12 else 'F',
        'Address':           f'{random.randint(1,200)}, {random.randint(1,20)}th Cross, {did}',
        'District':          did,
        'Occupation':        random.choice(OCCUPATIONS),
        'Education':         random.choice(EDUCATIONS),
        'RiskScore':         str(risk),
        'PriorOffences':     str(prior),
        'CrimeHistory':      ','.join(crimes),
        'ModusOperandi':     '|'.join(mo),
        'AssociateIds':      ','.join(random.sample(accused_ids[:-1], min(random.randint(0,3), len(accused_ids)-1))) if len(accused_ids) > 1 else '',
        'FinancialLinks':    'Yes' if fin_links else 'No',
        'ActiveWarrant':     'Yes' if warrant else 'No',
        'LastKnownLocation': last_loc,
    })

print('Generating FIR records...')
fir_rows = []
base_date = datetime(2023, 1, 1)
dist_list = list(DISTRICTS.keys())
dist_weights = [25,5,8,7,6,5,4,4,3,4,4,3,3,3,3]

for i in range(500):
    did  = random.choices(dist_list, weights=dist_weights)[0]
    lat, lon = DISTRICTS[did]
    ps   = random.choice(POLICE_STATIONS.get(did, [f'{did.split()[0]} Town']))
    cat, ipc, sev, _ = random.choices(CRIMES, weights=[c[3] for c in CRIMES])[0]
    days = random.randint(0, 540)
    crime_date = base_date + timedelta(days=days)
    year = crime_date.year
    dist_code = did[:3].upper().replace(' ', '')
    ps_code   = ps[:3].upper().replace(' ', '')
    num       = random.randint(1000, 9999)

    # KSP official CrimeNo format
    cat_code  = '1'  # FIR
    dist_id   = f'{random.randint(4400,4499)}'
    ps_id     = f'{random.randint(1,99):03d}'
    serial    = f'{i+1:05d}'
    crime_no  = f'{cat_code}{dist_id}{ps_id}{year}{serial}'

    acc_pool = [a for a in accused_ids if True]
    acc_ids  = ','.join(random.sample(acc_pool, min(random.randint(0,3), len(acc_pool))))

    fir_rows.append({
        'CrimeNo':             crime_no,
        'CrimeRegisteredDate': crime_date.strftime('%Y-%m-%d'),
        'PoliceStation':       ps,
        'District':            did,
        'CaseStatus':          random.choice(STATUSES),
        'CrimeCategory':       cat,
        'GravityOffence':      'Heinous' if sev == 'HIGH' else 'Non-Heinous',
        'IpcSection':          ipc,
        'Latitude':            str(round(lat + random.uniform(-0.15, 0.15), 4)),
        'Longitude':           str(round(lon + random.uniform(-0.15, 0.15), 4)),
        'BriefFacts':          f'{cat.replace("_"," ").title()} case at {ps} police station, {did} district.',
        'OfficerInCharge':     random.choice(OFFICERS),
        'Severity':            sev,
    })

print('Generating victim records...')
victim_rows = []
for i in range(60):
    did = random.choice(dist_list)
    victim_rows.append({
        'CaseMasterID': f'FIR{random.randint(1,500):03d}',
        'VictimName':   kn_name(),
        'AgeYear':      str(random.randint(16, 75)),
        'GenderID':     'M' if random.random() > 0.45 else 'F',
        'District':     did,
        'Occupation':   random.choice(OCCUPATIONS + ['Teacher', 'Engineer', 'Shopkeeper', 'Retired']),
        'VictimPolice': '0',
    })

# ── SEED TO CATALYST ────────────────────────────────────────────────────────
print('\nFetching table IDs...')
tables = {}
r = requests.get(BASE_URL, headers=HEADERS)
if r.status_code != 200:
    print(f'Error fetching tables: {r.text}')
    print('Make sure CATALYST_TOKEN is correct')
    exit(1)

for t in r.json().get('data', []):
    tables[t['table_name']] = t['table_id']
    print(f'  Found table: {t["table_name"]} → {t["table_id"]}')

print(f'\nSeeding CaseMaster ({len(fir_rows)} records)...')
if 'CaseMaster' in tables:
    n = insert_rows(tables['CaseMaster'], fir_rows)
    print(f'  Inserted {n} FIR records')
else:
    print('  Table CaseMaster not found — create it in Catalyst Console first')

print(f'\nSeeding Accused ({len(accused_rows)} records)...')
if 'Accused' in tables:
    n = insert_rows(tables['Accused'], accused_rows)
    print(f'  Inserted {n} accused records')
else:
    print('  Table Accused not found')

print(f'\nSeeding Victim ({len(victim_rows)} records)...')
if 'Victim' in tables:
    n = insert_rows(tables['Victim'], victim_rows)
    print(f'  Inserted {n} victim records')
else:
    print('  Table Victim not found')

print('\nDone! Data seeded to Catalyst DataStore.')
