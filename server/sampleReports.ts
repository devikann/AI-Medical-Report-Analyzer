import { MedicalReport, SampleReportOption } from '../src/types.js';

export const SAMPLE_REPORTS_LIST: SampleReportOption[] = [
  {
    id: 'sample-diabetic-lipid',
    title: 'Lipid & Blood Glucose Metabolic Panel',
    category: 'Endocrinology / Metabolic',
    description: 'Elevated Fasting Glucose (142 mg/dL), HbA1c (7.2%), Total Cholesterol (245 mg/dL), and Triglycerides (210 mg/dL).',
    sampleFileName: 'Lipid_Glucose_Panel.pdf',
    sampleText: `
CITY HEALTH DIAGNOSTICS & PATHOLOGY LAB
Patient Name: Patient A | Age: 48 | Gender: Male | Ref Doctor: Dr. R. Sharma
Date of Collection: 12-May-2026 | Report Status: Final

FASTING BLOOD SUGAR (GLUCOSE)
Result: 142.0 mg/dL  (Reference Range: 70 - 99 mg/dL) [HIGH]

POST PRANDIAL BLOOD SUGAR (PPBS)
Result: 215.5 mg/dL  (Reference Range: < 140 mg/dL) [HIGH]

GLYCOSYLATED HEMOGLOBIN (HbA1c)
Result: 7.2 %  (Reference Range: 4.0 - 5.6 % Normal, 5.7 - 6.4 % Prediabetes, >= 6.5 % Diabetes) [HIGH]

LIPID PROFILE
Total Cholesterol: 245 mg/dL  (Reference Range: < 200 mg/dL Desirable) [HIGH]
Triglycerides: 210 mg/dL  (Reference Range: < 150 mg/dL Normal) [HIGH]
HDL Cholesterol (Good): 38 mg/dL  (Reference Range: > 40 mg/dL) [LOW]
LDL Cholesterol (Bad): 165 mg/dL  (Reference Range: < 100 mg/dL) [HIGH]
VLDL Cholesterol: 42 mg/dL  (Reference Range: 5 - 40 mg/dL) [HIGH]

KIDNEY FUNCTION TEST
Serum Creatinine: 0.95 mg/dL (Reference Range: 0.7 - 1.3 mg/dL) [NORMAL]
Blood Urea Nitrogen (BUN): 14 mg/dL (Reference Range: 7 - 20 mg/dL) [NORMAL]

LIVER FUNCTION TEST
Serum ALT (SGPT): 42 U/L (Reference Range: 7 - 56 U/L) [NORMAL]
Serum AST (SGOT): 35 U/L (Reference Range: 8 - 40 U/L) [NORMAL]

MEDICATIONS PRESCRIBED IN CHART:
- Metformin 500mg BD
- Atorvastatin 10mg HS
`
  },
  {
    id: 'sample-cbc-anemia',
    title: 'Complete Blood Count (CBC) & Iron Studies',
    category: 'Hematology',
    description: 'Low Hemoglobin (9.2 g/dL), Low RBC Count, and Low Serum Ferritin indicating Iron Deficiency Anemia.',
    sampleFileName: 'CBC_Iron_Panel.pdf',
    sampleText: `
APEX LABS & RESEARCH CENTER
Patient Name: Patient B | Age: 34 | Gender: Female | Date: 28-May-2026

COMPLETE BLOOD COUNT (CBC)
Hemoglobin (Hb): 9.2 g/dL  (Reference Range: 12.0 - 15.5 g/dL) [LOW]
RBC Count: 3.4 x10^6 /uL  (Reference Range: 3.8 - 5.1 x10^6 /uL) [LOW]
Packed Cell Volume (PCV/Hematocrit): 29.5 % (Reference Range: 36.0 - 46.0 %) [LOW]
MCV: 71 fl  (Reference Range: 80 - 100 fl) [LOW]
MCH: 22 pg  (Reference Range: 27 - 33 pg) [LOW]
MCHC: 29.2 g/dL (Reference Range: 32 - 36 g/dL) [LOW]
WBC Total Count: 6,800 /uL  (Reference Range: 4,500 - 11,000 /uL) [NORMAL]
Platelet Count: 285,000 /uL  (Reference Range: 150,000 - 450,000 /uL) [NORMAL]

IRON PROFILE
Serum Iron: 32 mcg/dL  (Reference Range: 60 - 170 mcg/dL) [LOW]
Serum Ferritin: 8.5 ng/mL  (Reference Range: 13 - 150 ng/mL) [LOW]
Total Iron Binding Capacity (TIBC): 430 mcg/dL  (Reference Range: 250 - 425 mcg/dL) [HIGH]

RECOMMENDATIONS IN CHART:
- Oral Iron Supplementation (Ferrous Sulfate 200mg OD)
- Vitamin C 500mg for iron absorption
`
  },
  {
    id: 'sample-thyroid-kidney',
    title: 'Thyroid Function & Renal Clearance Report',
    category: 'Endocrinology & Nephrology',
    description: 'Elevated TSH (8.4 mIU/L) with normal FT3/FT4, and mildly elevated Creatinine (1.45 mg/dL).',
    sampleFileName: 'Thyroid_Renal_Panel_Patient_Rao.pdf',
    sampleText: `
METRO DIAGNOSTICS LABORATORY
Patient Name: Suresh Rao | Age: 56 | Gender: Male | Date: 15-Jun-2026

THYROID PROFILE
TSH (Thyroid Stimulating Hormone): 8.40 mIU/L (Reference Range: 0.45 - 4.50 mIU/L) [HIGH]
Free T3: 3.1 pg/mL (Reference Range: 2.0 - 4.4 pg/mL) [NORMAL]
Free T4: 1.1 ng/dL (Reference Range: 0.8 - 1.8 ng/dL) [NORMAL]

RENAL / KIDNEY PANEL
Serum Creatinine: 1.45 mg/dL (Reference Range: 0.70 - 1.20 mg/dL) [HIGH]
Blood Urea: 48 mg/dL (Reference Range: 15 - 40 mg/dL) [HIGH]
eGFR (Estimated GFR): 54 mL/min/1.73m2 (Reference Range: > 90 mL/min/1.73m2) [LOW]
Serum Uric Acid: 7.8 mg/dL (Reference Range: 3.5 - 7.2 mg/dL) [HIGH]
Serum Sodium: 139 mEq/L (Reference Range: 136 - 145 mEq/L) [NORMAL]
Serum Potassium: 4.6 mEq/L (Reference Range: 3.5 - 5.1 mEq/L) [NORMAL]

CLINICAL IMPRESSION:
Subclinical Hypothyroidism and Stage 3a Chronic Kidney Dysfunction indicators.
`
  }
];

export const MOCK_SEED_REPORTS: MedicalReport[] = [
  {
    id: 'report-demo-1',
    userId: 'user-demo-1',
    fileName: 'Lipid_Glucose_Panel.pdf',
    fileType: 'application/pdf',
    originalText: SAMPLE_REPORTS_LIST[0].sampleText,
    uploadDate: '2026-05-12T10:30:00.000Z',
    patientName: 'Patient Record',
    patientAge: '48',
    patientGender: 'Male',
    labName: 'City Health Diagnostics & Pathology Lab',
    reportDate: '2026-05-12',
    summary: 'The report reveals significantly elevated Fasting Blood Glucose (142 mg/dL), Post Prandial Glucose (215.5 mg/dL), and HbA1c (7.2%), which indicates uncontrolled Type 2 Diabetes Mellitus. In addition, the lipid profile demonstrates hyperlipidemia with elevated Total Cholesterol (245 mg/dL), Triglycerides (210 mg/dL), and LDL (165 mg/dL), alongside lower HDL (38 mg/dL). Kidney and liver markers remain within normal parameters.',
    riskScore: 'High',
    confidenceScore: 94.8,
    doctorConsultation: 'Consult Doctor Soon',
    doctorNotes: 'Schedule a visit with your Endocrinologist or Primary Care Physician within 1-2 weeks for medication adjustment and dietary consultation.',
    labResults: [
      {
        id: 'lr-1',
        testName: 'Fasting Blood Sugar (Glucose)',
        category: 'Metabolic / Glycemic',
        resultValue: '142.0',
        unit: 'mg/dL',
        referenceRange: '70 - 99',
        status: 'High',
        clinicalSignificance: 'Elevated fasting glucose points to impaired insulin sensitivity or inadequate insulin production.',
        explanation: 'Your blood sugar after an overnight fast is higher than normal. Healthy fasting levels stay under 100 mg/dL.'
      },
      {
        id: 'lr-2',
        testName: 'Post Prandial Blood Sugar (PPBS)',
        category: 'Metabolic / Glycemic',
        resultValue: '215.5',
        unit: 'mg/dL',
        referenceRange: '< 140',
        status: 'High',
        clinicalSignificance: 'Post-meal blood glucose spikes above 200 mg/dL meet diagnostic thresholds for diabetes.',
        explanation: 'Blood sugar measured 2 hours after a meal is significantly elevated, showing difficulty processing carbohydrates.'
      },
      {
        id: 'lr-3',
        testName: 'HbA1c (Glycosylated Hemoglobin)',
        category: 'Metabolic / Glycemic',
        resultValue: '7.2',
        unit: '%',
        referenceRange: '4.0 - 5.6',
        status: 'High',
        clinicalSignificance: 'Reflects average blood sugar control over the preceding 2 to 3 months. Values >= 6.5% indicate diabetes.',
        explanation: 'An HbA1c of 7.2% means sugar has been consistently elevated over the past 3 months.'
      },
      {
        id: 'lr-4',
        testName: 'Total Cholesterol',
        category: 'Lipid Profile',
        resultValue: '245',
        unit: 'mg/dL',
        referenceRange: '< 200',
        status: 'High',
        clinicalSignificance: 'High total cholesterol increases long-term risk of arterial plaque build-up.',
        explanation: 'The total amount of fats in your bloodstream is above the recommended 200 mg/dL target.'
      },
      {
        id: 'lr-5',
        testName: 'Triglycerides',
        category: 'Lipid Profile',
        resultValue: '210',
        unit: 'mg/dL',
        referenceRange: '< 150',
        status: 'High',
        clinicalSignificance: 'Elevated triglycerides frequently correlate with metabolic syndrome and high simple-carbohydrate diets.',
        explanation: 'Triglycerides are blood fats derived from excess calorie intake. Reducing simple sugars helps lower this.'
      },
      {
        id: 'lr-6',
        testName: 'HDL Cholesterol (Good)',
        category: 'Lipid Profile',
        resultValue: '38',
        unit: 'mg/dL',
        referenceRange: '> 40',
        status: 'Low',
        clinicalSignificance: 'Low HDL reduces protective cardiovascular cholesterol clearance.',
        explanation: 'HDL acts as a cleaner removing bad fats. Increasing aerobic exercise and healthy fats can boost HDL.'
      },
      {
        id: 'lr-7',
        testName: 'LDL Cholesterol (Bad)',
        category: 'Lipid Profile',
        resultValue: '165',
        unit: 'mg/dL',
        referenceRange: '< 100',
        status: 'High',
        clinicalSignificance: 'High LDL causes fat deposits in blood vessel walls.',
        explanation: 'This is bad cholesterol that deposits in blood vessels. Target for diabetics is usually < 70-100 mg/dL.'
      },
      {
        id: 'lr-8',
        testName: 'Serum Creatinine',
        category: 'Renal Function',
        resultValue: '0.95',
        unit: 'mg/dL',
        referenceRange: '0.7 - 1.3',
        status: 'Normal',
        clinicalSignificance: 'Normal creatinine indicates healthy kidney filtration capability.',
        explanation: 'Your kidneys are filtering waste effectively.'
      }
    ],
    conditionPredictions: [
      {
        conditionName: 'Type 2 Diabetes Mellitus',
        possibilityLevel: 'High',
        description: 'HbA1c > 6.5% paired with elevated Fasting and Post-Prandial Glucose indicates type 2 diabetes.',
        keyIndicators: ['HbA1c 7.2%', 'Fasting Glucose 142 mg/dL', 'PPBS 215.5 mg/dL'],
        disclaimer: 'This is an algorithmic assessment based on standard clinical guidelines. Final diagnosis requires clinical evaluation by your physician.'
      },
      {
        conditionName: 'Mixed Dyslipidemia / Hypercholesterolemia',
        possibilityLevel: 'High',
        description: 'Concurrent elevation of LDL cholesterol and Triglycerides with lowered HDL.',
        keyIndicators: ['LDL 165 mg/dL', 'Triglycerides 210 mg/dL', 'HDL 38 mg/dL'],
        disclaimer: 'Lipid imbalances should be evaluated alongside blood pressure and cardiovascular history.'
      }
    ],
    medicationExplanations: [
      {
        medicineName: 'Metformin 500mg',
        dosage: 'Twice daily with meals (BD)',
        primaryPurpose: 'Lowers liver glucose production and improves insulin sensitivity in body cells.',
        potentialSideEffects: ['Mild nausea', 'Bloating', 'Loose stools initially'],
        precautions: ['Take with meals to reduce stomach discomfort', 'Maintain good hydration']
      },
      {
        medicineName: 'Atorvastatin 10mg',
        dosage: 'Once daily at bedtime (HS)',
        primaryPurpose: 'Inhibits liver cholesterol synthesis to dramatically lower LDL bad cholesterol.',
        potentialSideEffects: ['Muscle aches', 'Slight liver enzyme elevation'],
        precautions: ['Report unexplained muscle tenderness to your doctor', 'Avoid grapefruit juice']
      }
    ],
    lifestyleRecommendations: [
      {
        category: 'Diet',
        title: 'Low Glycemic Index & Low Saturated Fat Meal Plan',
        detail: 'Replace refined grains (white rice, white bread) with whole oats, quinoa, and green vegetables. Limit added sugars and saturated cooking oils.',
        priority: 'High'
      },
      {
        category: 'Exercise',
        title: 'Regular Aerobic & Resistance Training',
        detail: 'Engage in 30 minutes of brisk walking or cycling 5 days per week. Aerobic activity directly increases cellular glucose uptake.',
        priority: 'High'
      },
      {
        category: 'Hydration',
        title: 'Optimum Water Intake',
        detail: 'Drink 2.5 to 3 liters of water daily to aid renal excretion of blood glucose metabolites.',
        priority: 'Medium'
      },
      {
        category: 'Follow-up',
        title: 'Quarterly HbA1c & Lipid Monitoring',
        detail: 'Repeat HbA1c test in 90 days to evaluate treatment efficacy.',
        priority: 'Medium'
      }
    ],
    language: 'en'
  },
  {
    id: 'report-demo-2',
    userId: 'user-demo-1',
    fileName: 'CBC_Iron_Panel_Patient_Doe.pdf',
    fileType: 'application/pdf',
    originalText: SAMPLE_REPORTS_LIST[1].sampleText,
    uploadDate: '2026-05-28T14:15:00.000Z',
    patientName: 'Emily Doe',
    patientAge: '34',
    patientGender: 'Female',
    labName: 'Apex Labs & Research Center',
    reportDate: '2026-05-28',
    summary: 'The report demonstrates moderate Microcytic Hypochromic Anemia with low Hemoglobin (9.2 g/dL), low Hematocrit (29.5%), reduced MCV (71 fl) and MCH (22 pg). Iron studies confirm Iron Deficiency with Serum Iron (32 mcg/dL) and Serum Ferritin (8.5 ng/mL) significantly depleted alongside high TIBC.',
    riskScore: 'Medium',
    confidenceScore: 92.1,
    doctorConsultation: 'Consult Doctor Soon',
    doctorNotes: 'Consult your Gynecologist or Primary Care Physician to identify the root cause of iron depletion (e.g. heavy menses or nutritional intake) and manage oral iron dosing.',
    labResults: [
      {
        id: 'lr-101',
        testName: 'Hemoglobin (Hb)',
        category: 'Hematology',
        resultValue: '9.2',
        unit: 'g/dL',
        referenceRange: '12.0 - 15.5',
        status: 'Low',
        clinicalSignificance: 'Low hemoglobin reduces oxygen transport to tissues, causing fatigue and shortness of breath.',
        explanation: 'Your oxygen-carrying protein in red blood cells is lower than normal.'
      },
      {
        id: 'lr-102',
        testName: 'Serum Ferritin',
        category: 'Iron Profile',
        resultValue: '8.5',
        unit: 'ng/mL',
        referenceRange: '13 - 150',
        status: 'Low',
        clinicalSignificance: 'Ferritin measures body iron reserves. Values < 15 ng/mL confirm depleted iron stores.',
        explanation: 'Your iron storage tank is nearly empty and requires iron supplementation.'
      },
      {
        id: 'lr-103',
        testName: 'MCV (Mean Corpuscular Volume)',
        category: 'Hematology',
        resultValue: '71',
        unit: 'fl',
        referenceRange: '80 - 100',
        status: 'Low',
        clinicalSignificance: 'Microcytosis (small red blood cells) typical of iron deficiency or thalassemia trait.',
        explanation: 'Your red blood cells are smaller in size than normal due to lack of iron.'
      }
    ],
    conditionPredictions: [
      {
        conditionName: 'Iron Deficiency Anemia (Microcytic Hypochromic)',
        possibilityLevel: 'High',
        description: 'Low Hb, low MCV, and severely reduced Ferritin strongly confirm iron deficiency anemia.',
        keyIndicators: ['Hemoglobin 9.2 g/dL', 'Ferritin 8.5 ng/mL', 'MCV 71 fl'],
        disclaimer: 'Requires medical review to establish cause.'
      }
    ],
    medicationExplanations: [
      {
        medicineName: 'Ferrous Sulfate 200mg',
        dosage: 'Once daily on empty stomach or with Vitamin C',
        primaryPurpose: 'Replenishes systemic iron stores and hemoglobin synthesis.',
        potentialSideEffects: ['Dark stools', 'Mild constipation or stomach cramping'],
        precautions: ['Do not take with milk, tea, or coffee as they block iron absorption']
      }
    ],
    lifestyleRecommendations: [
      {
        category: 'Diet',
        title: 'Iron-Rich Foods & Vitamin C Enhancement',
        detail: 'Incorporate spinach, lentils, pomegranate, lean meats, and citrus fruits (oranges, lemons) which double iron absorption.',
        priority: 'High'
      }
    ],
    language: 'en'
  }
];
