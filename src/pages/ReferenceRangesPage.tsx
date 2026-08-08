import React, { useState } from 'react';
import {
  Activity,
  Search,
  BookOpen,
  Info,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Heart,
  Droplet,
  ShieldCheck,
  Filter
} from 'lucide-react';
import { DisclaimerBanner } from '../components/DisclaimerBanner.js';

interface MedicalRangeItem {
  id: string;
  category: string;
  testName: string;
  standardUnit: string;
  normalRange: string;
  optimalRange?: string;
  highThreshold?: string;
  lowThreshold?: string;
  description: string;
  clinicalNote: string;
  color: string;
}

const REFERENCE_DATA: MedicalRangeItem[] = [
  // GLYCEMIC / DIABETES
  {
    id: 'fbs',
    category: 'Blood Sugar / Glycemic',
    testName: 'Fasting Blood Sugar (FBS)',
    standardUnit: 'mg/dL',
    normalRange: '70 - 99 mg/dL',
    optimalRange: '70 - 89 mg/dL',
    highThreshold: '≥ 126 mg/dL (Diabetes)',
    lowThreshold: '< 70 mg/dL (Hypoglycemia)',
    description: 'Measures blood glucose levels after fasting for at least 8 hours.',
    clinicalNote: '100-125 mg/dL indicates Prediabetes. FBS ≥126 mg/dL on two separate tests confirms Diabetes.',
    color: 'emerald'
  },
  {
    id: 'ppbs',
    category: 'Blood Sugar / Glycemic',
    testName: 'Postprandial Blood Sugar (PPBS 2-hr)',
    standardUnit: 'mg/dL',
    normalRange: '< 140 mg/dL',
    optimalRange: '< 120 mg/dL',
    highThreshold: '≥ 200 mg/dL (Diabetes)',
    lowThreshold: '< 70 mg/dL',
    description: 'Measures blood glucose exactly 2 hours after starting a standard meal.',
    clinicalNote: '140-199 mg/dL indicates Impaired Glucose Tolerance (Prediabetes).',
    color: 'emerald'
  },
  {
    id: 'hba1c',
    category: 'Blood Sugar / Glycemic',
    testName: 'HbA1c (Glycated Hemoglobin)',
    standardUnit: '%',
    normalRange: '< 5.7%',
    optimalRange: '4.0% - 5.4%',
    highThreshold: '≥ 6.5% (Diabetes)',
    lowThreshold: '< 4.0%',
    description: 'Reflects average blood sugar levels over the past 2 to 3 months.',
    clinicalNote: '5.7% to 6.4% indicates Prediabetes. Diabetic target is generally < 7.0%.',
    color: 'emerald'
  },

  // LIPID PROFILE
  {
    id: 'cholesterol_total',
    category: 'Lipid Profile (Cholesterol)',
    testName: 'Total Cholesterol',
    standardUnit: 'mg/dL',
    normalRange: '< 200 mg/dL (Desirable)',
    optimalRange: '125 - 199 mg/dL',
    highThreshold: '≥ 240 mg/dL (High)',
    description: 'Combined measure of LDL, HDL, and VLDL cholesterol in the bloodstream.',
    clinicalNote: '200-239 mg/dL is Borderline High. High levels increase risk of plaque buildup in arteries.',
    color: 'amber'
  },
  {
    id: 'ldl',
    category: 'Lipid Profile (Cholesterol)',
    testName: 'LDL Cholesterol ("Bad" Cholesterol)',
    standardUnit: 'mg/dL',
    normalRange: '< 100 mg/dL (Optimal)',
    optimalRange: '< 70 mg/dL (For heart disease patients)',
    highThreshold: '≥ 160 mg/dL (High)',
    description: 'Low-Density Lipoprotein that can build up on artery walls.',
    clinicalNote: '100-129 mg/dL is Near Optimal. Lower LDL values significantly reduce cardiovascular risk.',
    color: 'amber'
  },
  {
    id: 'hdl',
    category: 'Lipid Profile (Cholesterol)',
    testName: 'HDL Cholesterol ("Good" Cholesterol)',
    standardUnit: 'mg/dL',
    normalRange: 'Men: > 40 mg/dL | Women: > 50 mg/dL',
    optimalRange: '≥ 60 mg/dL (Protective)',
    lowThreshold: '< 40 mg/dL (Major risk factor)',
    description: 'High-Density Lipoprotein that helps carry excess cholesterol back to the liver.',
    clinicalNote: 'Higher HDL levels protect against heart attacks and stroke.',
    color: 'amber'
  },
  {
    id: 'triglycerides',
    category: 'Lipid Profile (Cholesterol)',
    testName: 'Triglycerides',
    standardUnit: 'mg/dL',
    normalRange: '< 150 mg/dL',
    optimalRange: '< 100 mg/dL',
    highThreshold: '≥ 200 mg/dL (High)',
    description: 'Type of fat found in blood converted from unused calories.',
    clinicalNote: '150-199 mg/dL is Borderline High. Very high levels (≥500 mg/dL) risk acute pancreatitis.',
    color: 'amber'
  },

  // COMPLETE BLOOD COUNT
  {
    id: 'hemoglobin',
    category: 'Complete Blood Count (CBC)',
    testName: 'Hemoglobin (Hb)',
    standardUnit: 'g/dL',
    normalRange: 'Male: 13.8 - 17.2 g/dL | Female: 12.1 - 15.1 g/dL',
    optimalRange: '13.5 - 16.5 g/dL',
    lowThreshold: '< 12.0 g/dL (Anemia)',
    description: 'Iron-containing protein in red blood cells that carries oxygen throughout the body.',
    clinicalNote: 'Low Hb indicates anemia (iron, B12 deficiency or blood loss). High Hb occurs in dehydration or smoking.',
    color: 'sky'
  },
  {
    id: 'wbc',
    category: 'Complete Blood Count (CBC)',
    testName: 'White Blood Cell Count (WBC / Leukocytes)',
    standardUnit: 'cells/µL',
    normalRange: '4,500 - 11,000 /µL',
    optimalRange: '5,000 - 9,000 /µL',
    highThreshold: '> 11,000 /µL (Infection/Inflammation)',
    lowThreshold: '< 4,000 /µL (Leukopenia)',
    description: 'Immune cells responsible for fighting bacterial, viral, and parasitic infections.',
    clinicalNote: 'Elevated WBC suggests active bacterial infection, physical stress, or inflammation.',
    color: 'sky'
  },
  {
    id: 'platelets',
    category: 'Complete Blood Count (CBC)',
    testName: 'Platelet Count',
    standardUnit: '/µL',
    normalRange: '150,000 - 450,000 /µL',
    optimalRange: '200,000 - 350,000 /µL',
    lowThreshold: '< 150,000 /µL (Thrombocytopenia)',
    highThreshold: '> 450,000 /µL (Thrombocytosis)',
    description: 'Blood cell fragments involved in clot formation to stop bleeding.',
    clinicalNote: 'Low platelets increase bleeding tendency. High platelets increase clotting risk.',
    color: 'sky'
  },

  // KIDNEY FUNCTION
  {
    id: 'creatinine',
    category: 'Kidney Function (Renal Panel)',
    testName: 'Serum Creatinine',
    standardUnit: 'mg/dL',
    normalRange: 'Male: 0.74 - 1.35 mg/dL | Female: 0.59 - 1.04 mg/dL',
    optimalRange: '0.8 - 1.1 mg/dL',
    highThreshold: '> 1.4 mg/dL (Impaired Filtration)',
    description: 'Waste product from normal muscle breakdown filtered entirely by the kidneys.',
    clinicalNote: 'Elevated serum creatinine indicates reduced kidney filtration function.',
    color: 'purple'
  },
  {
    id: 'bun',
    category: 'Kidney Function (Renal Panel)',
    testName: 'Blood Urea Nitrogen (BUN)',
    standardUnit: 'mg/dL',
    normalRange: '7 - 20 mg/dL',
    optimalRange: '10 - 18 mg/dL',
    highThreshold: '> 20 mg/dL',
    description: 'Measures amount of nitrogen in blood coming from the waste product urea.',
    clinicalNote: 'High BUN indicates kidney dysfunction, dehydration, or high protein intake.',
    color: 'purple'
  },
  {
    id: 'egfr',
    category: 'Kidney Function (Renal Panel)',
    testName: 'eGFR (Estimated Glomerular Filtration Rate)',
    standardUnit: 'mL/min/1.73m²',
    normalRange: '≥ 90 mL/min/1.73m²',
    lowThreshold: '< 60 mL/min/1.73m² (Chronic Kidney Disease)',
    description: 'Best overall index of kidney filtering capacity calculated from creatinine, age, and sex.',
    clinicalNote: 'eGFR < 60 for > 3 months indicates chronic kidney disease (CKD).',
    color: 'purple'
  },

  // LIVER FUNCTION
  {
    id: 'alt',
    category: 'Liver Function Tests (LFT)',
    testName: 'ALT (SGPT - Alanine Aminotransferase)',
    standardUnit: 'U/L',
    normalRange: '7 - 56 U/L',
    optimalRange: '10 - 40 U/L',
    highThreshold: '> 56 U/L (Liver cell irritation)',
    description: 'Enzyme found mostly inside liver cells; released into blood when liver cells are damaged.',
    clinicalNote: 'Specific marker for hepatocellular injury or fatty liver disease.',
    color: 'rose'
  },
  {
    id: 'ast',
    category: 'Liver Function Tests (LFT)',
    testName: 'AST (SGOT - Aspartate Aminotransferase)',
    standardUnit: 'U/L',
    normalRange: '8 - 48 U/L',
    optimalRange: '10 - 35 U/L',
    highThreshold: '> 48 U/L',
    description: 'Enzyme found in liver, heart, muscle, and tissue.',
    clinicalNote: 'Elevated along with ALT indicates liver inflammation, alcoholic liver disease, or muscle injury.',
    color: 'rose'
  },
  {
    id: 'bilirubin_total',
    category: 'Liver Function Tests (LFT)',
    testName: 'Total Bilirubin',
    standardUnit: 'mg/dL',
    normalRange: '0.1 - 1.2 mg/dL',
    optimalRange: '0.2 - 0.9 mg/dL',
    highThreshold: '> 1.2 mg/dL (Jaundice risk)',
    description: 'Yellow pigment produced during normal breakdown of red blood cells.',
    clinicalNote: 'Elevated bilirubin causing yellowing of eyes/skin (Jaundice) may reflect liver or gallbladder duct blockage.',
    color: 'rose'
  },

  // THYROID
  {
    id: 'tsh',
    category: 'Thyroid Panel',
    testName: 'TSH (Thyroid Stimulating Hormone)',
    standardUnit: 'mIU/L',
    normalRange: '0.4 - 4.0 mIU/L',
    optimalRange: '1.0 - 2.5 mIU/L',
    highThreshold: '> 4.5 mIU/L (Hypothyroidism)',
    lowThreshold: '< 0.4 mIU/L (Hyperthyroidism)',
    description: 'Pituitary gland hormone that controls thyroid gland production of T3 and T4.',
    clinicalNote: 'High TSH indicates underactive thyroid (hypothyroidism). Low TSH indicates overactive thyroid.',
    color: 'indigo'
  },

  // VITAMINS
  {
    id: 'vitamin_d',
    category: 'Vitamins & Essential Minerals',
    testName: 'Vitamin D (25-Hydroxyvitamin D)',
    standardUnit: 'ng/mL',
    normalRange: '30 - 100 ng/mL (Sufficient)',
    optimalRange: '40 - 70 ng/mL',
    lowThreshold: '< 20 ng/mL (Deficient)',
    description: 'Fat-soluble vitamin essential for bone density, immune health, and calcium absorption.',
    clinicalNote: '< 20 ng/mL requires Vitamin D3 supplementation under medical supervision.',
    color: 'yellow'
  },
  {
    id: 'vitamin_b12',
    category: 'Vitamins & Essential Minerals',
    testName: 'Vitamin B12 (Cobalamin)',
    standardUnit: 'pg/mL',
    normalRange: '200 - 900 pg/mL',
    optimalRange: '400 - 800 pg/mL',
    lowThreshold: '< 200 pg/mL (Deficiency)',
    description: 'Essential nutrient for nerve function, DNA synthesis, and red blood cell production.',
    clinicalNote: 'Deficiency causes tingling in hands/feet, memory issues, and megaloblastic anemia.',
    color: 'yellow'
  },

  // BLOOD PRESSURE
  {
    id: 'bp',
    category: 'Blood Pressure & Vitals',
    testName: 'Blood Pressure (Systolic / Diastolic)',
    standardUnit: 'mmHg',
    normalRange: '< 120 / < 80 mmHg',
    optimalRange: '110 / 70 mmHg',
    highThreshold: '≥ 130 / 80 mmHg (Stage 1 Hypertension)',
    description: 'Pressure exerted by circulating blood against arterial walls.',
    clinicalNote: '120-129 / < 80 is Elevated. ≥ 140/90 mmHg is Stage 2 Hypertension needing lifestyle or drug therapy.',
    color: 'red'
  }
];

export const ReferenceRangesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [language, setLanguage] = useState<'en' | 'ml' | 'hi'>('en');

  const categories = ['All', ...Array.from(new Set(REFERENCE_DATA.map(item => item.category)))];

  const filteredData = REFERENCE_DATA.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getLabel = (key: string) => {
    const labels: Record<string, { en: string; ml: string; hi: string }> = {
      title: {
        en: 'Medical Laboratory Normal Ranges',
        ml: 'മെഡിക്കൽ ലബോറട്ടറി സാധാരണ അളവുകൾ',
        hi: 'मेडिकल लैब सामान्य स्तर निर्देशिका'
      },
      subtitle: {
        en: 'Explore standard reference values for common pathology tests, blood panels, metabolic markers, and vital signs in English, Malayalam, or Hindi.',
        ml: 'സാധാരണ രക്തപരിശോധനകൾ, പ്രമേഹം, കൊളസ്ട്രോൾ, തൈറോയ്ഡ്, കിഡ്നി തുടങ്ങിയ പരിശോധനകളുടെ സാധാരണ അളവുകൾ മലയാളത്തിലും കാണുക.',
        hi: 'सामान्य पैथोलॉजी परीक्षणों, रक्त शर्करा, कोलेस्ट्रॉल, थायराइड आदि के सामान्य संदर्भ स्तरों की जानकारी प्राप्त करें।'
      },
      normalRange: {
        en: 'Normal Range:',
        ml: 'സാധാരണ നില (Normal):',
        hi: 'सामान्य स्तर (Normal):'
      },
      optimalTarget: {
        en: 'Optimal Target:',
        ml: 'ഉത്തമമായ നില (Optimal):',
        hi: 'उत्कृष्ट स्तर:'
      },
      highThreshold: {
        en: 'Elevated / High:',
        ml: 'ഉയർന്ന അളവ് (High):',
        hi: 'बढ़ा हुआ स्तर (High):'
      },
      lowThreshold: {
        en: 'Low / Deficiency:',
        ml: 'കുറഞ്ഞ അളവ് (Low):',
        hi: 'कम स्तर (Low):'
      },
      significance: {
        en: 'Clinical Significance:',
        ml: 'വൈദ്യശാസ്ത്രപരമായ പ്രാധാന്യം:',
        hi: 'चिकित्सकीय महत्व:'
      }
    };
    return labels[key]?.[language] || labels[key]?.en || '';
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Medical Advisory Disclaimer */}
      <DisclaimerBanner />

      {/* Page Header */}
      <div className="bg-[#0f1422] border border-amber-500/20 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-500/10 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>CLINICAL REFERENCE GUIDE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {getLabel('title')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
              {getLabel('subtitle')}
            </p>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            {/* Language Selector Pills */}
            <div className="flex items-center gap-1 bg-[#070a11] p-1 rounded-xl border border-amber-500/30">
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-mono'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('ml')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  language === 'ml'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-mono'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                മലയാളം
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  language === 'hi'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-mono'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                हिंदी
              </button>
            </div>

            <div className="flex items-center gap-2 bg-[#070a11] border border-amber-500/30 rounded-xl px-3 py-1.5 shrink-0">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <div className="text-left">
                <div className="text-[9px] text-slate-400 font-mono">STANDARD DATASET</div>
                <div className="text-[11px] font-bold text-white">2026 Clinical Benchmarks</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search test name (e.g. Fasting Glucose, Hemoglobin, Creatinine, TSH)..."
              className="w-full bg-[#070a11] border border-slate-800 focus:border-amber-500/60 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
            />
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <Filter className="w-4 h-4 text-slate-500 shrink-0 hidden sm:block" />
            <div className="flex items-center gap-1.5 flex-nowrap">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-amber-500 text-slate-950 shadow-md font-mono'
                      : 'bg-[#070a11] text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {cat === 'All' ? 'All Biomarkers' : cat.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Grid of Medical Reference Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredData.map(item => (
          <div
            key={item.id}
            className="bg-[#0f1422] border border-slate-800 hover:border-amber-500/50 rounded-2xl p-5 shadow-xl transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20">
                  {item.category}
                </span>
                <span className="text-[11px] font-mono text-slate-500">Unit: {item.standardUnit}</span>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-white">{item.testName}</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.description}</p>
              </div>

              {/* Standard Ranges Box */}
              <div className="bg-[#070a11] border border-slate-800 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{getLabel('normalRange')}</span>
                  </span>
                  <strong className="text-xs font-mono font-bold text-emerald-400">{item.normalRange}</strong>
                </div>

                {item.optimalRange && (
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">{getLabel('optimalTarget')}</span>
                    <span className="font-mono text-emerald-300 font-semibold">{item.optimalRange}</span>
                  </div>
                )}

                {item.highThreshold && (
                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800/60">
                    <span className="text-slate-500 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                      <span>{getLabel('highThreshold')}</span>
                    </span>
                    <span className="font-mono text-amber-300 font-medium">{item.highThreshold}</span>
                  </div>
                )}

                {item.lowThreshold && (
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">{getLabel('lowThreshold')}</span>
                    <span className="font-mono text-sky-300 font-medium">{item.lowThreshold}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Clinical Note Footer */}
            <div className="pt-2 border-t border-slate-800/80 flex items-start gap-2 text-[11px] text-slate-400">
              <Info className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <p><strong className="text-slate-300">{getLabel('significance')}</strong> {item.clinicalNote}</p>
            </div>
          </div>
        ))}
      </div>

      {filteredData.length === 0 && (
        <div className="py-12 text-center bg-[#0f1422] border border-dashed border-amber-500/20 rounded-2xl p-8">
          <HelpCircle className="w-10 h-10 text-slate-600 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-300">No medical test found</h3>
          <p className="text-xs text-slate-500 mt-1">
            Try searching for another keyword like "sugar", "lipid", "CBC", or "TSH".
          </p>
        </div>
      )}

    </div>
  );
};
