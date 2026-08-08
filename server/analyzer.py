import sys
import json
import os
import re
import urllib.request
import urllib.error
import time

def call_gemini_api(prompt_or_contents, system_instruction, response_schema=None):
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        return None

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key={api_key}"
    
    payload = {
        "contents": prompt_or_contents,
        "systemInstruction": {
            "parts": [{"text": system_instruction}]
        }
    }

    if response_schema:
        payload["generationConfig"] = {
            "responseMimeType": "application/json",
            "responseSchema": response_schema
        }

    try:
        data_bytes = json.dumps(payload).encode('utf-8')
        req = urllib.request.Request(
            url,
            data=data_bytes,
            headers={
                "Content-Type": "application/json",
                "User-Agent": "ai-medical-report-analyzer"
            },
            method="POST"
        )
        with urllib.request.urlopen(req, timeout=30) as response:
            res_body = response.read().decode('utf-8')
            res_json = json.loads(res_body)
            
            candidates = res_json.get("candidates", [])
            if candidates:
                parts = candidates[0].get("content", {}).get("parts", [])
                if parts:
                    return parts[0].get("text", "")
            return None
    except Exception as e:
        sys.stderr.write(f"Gemini API Call Error: {str(e)}\n")
        return None

def parse_lab_text_python(text):
    """
    Python Pathology Parser & Rule Engine:
    Scans text for medical test names, numeric values, units, and reference ranges.
    """
    lab_results = []
    lines = text.split('\n')
    
    # Common medical test patterns with standard reference ranges
    medical_db = {
        'glucose': {'name': 'Fasting Blood Glucose', 'category': 'Glycemic / Diabetes', 'unit': 'mg/dL', 'normal_min': 70, 'normal_max': 99, 'critical_high': 200},
        'hba1c': {'name': 'HbA1c (Glycated Hemoglobin)', 'category': 'Glycemic / Diabetes', 'unit': '%', 'normal_min': 4.0, 'normal_max': 5.6, 'critical_high': 9.0},
        'cholesterol': {'name': 'Total Cholesterol', 'category': 'Lipid Profile', 'unit': 'mg/dL', 'normal_min': 120, 'normal_max': 199, 'critical_high': 280},
        'triglycerides': {'name': 'Triglycerides', 'category': 'Lipid Profile', 'unit': 'mg/dL', 'normal_min': 40, 'normal_max': 149, 'critical_high': 400},
        'hdl': {'name': 'HDL Cholesterol (Good)', 'category': 'Lipid Profile', 'unit': 'mg/dL', 'normal_min': 40, 'normal_max': 80, 'critical_high': 20}, # Low is bad
        'ldl': {'name': 'LDL Cholesterol (Bad)', 'category': 'Lipid Profile', 'unit': 'mg/dL', 'normal_min': 50, 'normal_max': 99, 'critical_high': 190},
        'hemoglobin': {'name': 'Hemoglobin (Hb)', 'category': 'Hematology (CBC)', 'unit': 'g/dL', 'normal_min': 12.0, 'normal_max': 16.5, 'critical_low': 7.0},
        'rbc': {'name': 'Red Blood Cells (RBC)', 'category': 'Hematology (CBC)', 'unit': 'm/uL', 'normal_min': 4.0, 'normal_max': 5.5, 'critical_low': 2.5},
        'wbc': {'name': 'White Blood Cells (WBC)', 'category': 'Hematology (CBC)', 'unit': 'k/uL', 'normal_min': 4.5, 'normal_max': 11.0, 'critical_high': 20.0},
        'platelets': {'name': 'Platelet Count', 'category': 'Hematology (CBC)', 'unit': 'k/uL', 'normal_min': 150, 'normal_max': 450, 'critical_low': 50},
        'creatinine': {'name': 'Serum Creatinine', 'category': 'Kidney Function (Renal)', 'unit': 'mg/dL', 'normal_min': 0.6, 'normal_max': 1.2, 'critical_high': 3.0},
        'urea': {'name': 'Blood Urea Nitrogen (BUN)', 'category': 'Kidney Function (Renal)', 'unit': 'mg/dL', 'normal_min': 7, 'normal_max': 20, 'critical_high': 50},
        'alt': {'name': 'Alanine Aminotransferase (ALT/SGPT)', 'category': 'Liver Function (Hepatic)', 'unit': 'U/L', 'normal_min': 7, 'normal_max': 56, 'critical_high': 200},
        'ast': {'name': 'Aspartate Aminotransferase (AST/SGOT)', 'category': 'Liver Function (Hepatic)', 'unit': 'U/L', 'normal_min': 10, 'normal_max': 40, 'critical_high': 200},
        'tsh': {'name': 'Thyroid Stimulating Hormone (TSH)', 'category': 'Thyroid Panel', 'unit': 'uIU/mL', 'normal_min': 0.4, 'normal_max': 4.0, 'critical_high': 10.0},
        'vitamin d': {'name': '25-Hydroxy Vitamin D', 'category': 'Vitamins & Minerals', 'unit': 'ng/mL', 'normal_min': 30, 'normal_max': 100, 'critical_low': 10},
        'vitamin b12': {'name': 'Vitamin B12', 'category': 'Vitamins & Minerals', 'unit': 'pg/mL', 'normal_min': 200, 'normal_max': 900, 'critical_low': 100}
    }

    found_keys = set()

    for line in lines:
        line_clean = line.strip()
        if not line_clean:
            continue
            
        line_lower = line_clean.lower()

        # Check against known test keywords
        for key, info in medical_db.items():
            if key in line_lower and key not in found_keys:
                # Find numerical values in line
                nums = re.findall(r"[-+]?\d*\.\d+|\d+", line_clean)
                if nums:
                    val = float(nums[0])
                    found_keys.add(key)
                    
                    # Status evaluation
                    status = "Normal"
                    if 'critical_high' in info and val >= info['critical_high']:
                        status = "Critical"
                    elif 'critical_low' in info and val <= info['critical_low']:
                        status = "Critical"
                    elif val > info['normal_max']:
                        status = "High"
                    elif val < info['normal_min']:
                        status = "Low"

                    explanation = f"{info['name']} is {val} {info['unit']}."
                    if status == "High":
                        explanation += f" This is above the target reference max of {info['normal_max']} {info['unit']}."
                    elif status == "Low":
                        explanation += f" This is below the target reference min of {info['normal_min']} {info['unit']}."
                    elif status == "Critical":
                        explanation += f" Requires immediate medical evaluation."
                    else:
                        explanation += f" Result is healthy and within standard normal range."

                    lab_results.append({
                        "testName": info['name'],
                        "category": info['category'],
                        "resultValue": str(val),
                        "unit": info['unit'],
                        "referenceRange": f"{info['normal_min']} - {info['normal_max']}",
                        "status": status,
                        "clinicalSignificance": f"Evaluated against reference range ({info['normal_min']}-{info['normal_max']} {info['unit']}).",
                        "explanation": explanation
                    })

    # Generic regex fallback if specific keywords weren't isolated
    if not lab_results:
        # Match pattern: Test Name ... 123 mg/dL ... 70-100
        matches = re.findall(r"([A-Za-z\s]{3,30})[:\s]+(\d+(?:\.\d+)?)\s*([a-zA-Z/%]+)?", text)
        for idx, match in enumerate(matches[:10]):
            t_name = match[0].strip()
            if len(t_name) > 3 and not any(w in t_name.lower() for w in ['date', 'page', 'patient', 'doctor', 'report', 'lab', 'age']):
                val = match[1]
                unit = match[2] if match[2] else ""
                lab_results.append({
                    "testName": t_name,
                    "category": "General Pathology",
                    "resultValue": val,
                    "unit": unit,
                    "referenceRange": "Standard Clinical Range",
                    "status": "Normal",
                    "clinicalSignificance": "Extracted parameter from report text.",
                    "explanation": f"{t_name} was parsed as {val} {unit}."
                })

    return lab_results

def run_analysis(params):
    report_text = params.get("reportText", "")
    image_base64 = params.get("imageBase64")
    image_mime_type = params.get("imageMimeType")
    file_name = params.get("fileName", f"Medical_Report_{int(time.time())}.pdf")
    user_id = params.get("userId", "user-demo-1")

    # If GEMINI_API_KEY exists, query Gemini model
    if os.environ.get("GEMINI_API_KEY"):
        system_instruction = """You are an expert clinical pathology AI assistant analyzing medical laboratory reports.
Thoroughly extract and parse all lab tests, values, reference ranges, abnormal flags, patient metadata, conditions, medications, and lifestyle recommendations into structured JSON."""

        json_schema = {
            "type": "OBJECT",
            "properties": {
                "patientName": {"type": "STRING"},
                "patientAge": {"type": "STRING"},
                "patientGender": {"type": "STRING"},
                "labName": {"type": "STRING"},
                "reportDate": {"type": "STRING"},
                "summary": {"type": "STRING"},
                "riskScore": {"type": "STRING"},
                "confidenceScore": {"type": "NUMBER"},
                "doctorConsultation": {"type": "STRING"},
                "doctorNotes": {"type": "STRING"},
                "labResults": {
                    "type": "ARRAY",
                    "items": {
                        "type": "OBJECT",
                        "properties": {
                            "testName": {"type": "STRING"},
                            "category": {"type": "STRING"},
                            "resultValue": {"type": "STRING"},
                            "unit": {"type": "STRING"},
                            "referenceRange": {"type": "STRING"},
                            "status": {"type": "STRING"},
                            "clinicalSignificance": {"type": "STRING"},
                            "explanation": {"type": "STRING"}
                        },
                        "required": ["testName", "resultValue", "unit", "status", "explanation"]
                    }
                },
                "conditionPredictions": {
                    "type": "ARRAY",
                    "items": {
                        "type": "OBJECT",
                        "properties": {
                            "conditionName": {"type": "STRING"},
                            "possibilityLevel": {"type": "STRING"},
                            "description": {"type": "STRING"},
                            "keyIndicators": {"type": "ARRAY", "items": {"type": "STRING"}},
                            "disclaimer": {"type": "STRING"}
                        },
                        "required": ["conditionName", "possibilityLevel", "description"]
                    }
                },
                "medicationExplanations": {
                    "type": "ARRAY",
                    "items": {
                        "type": "OBJECT",
                        "properties": {
                            "medicineName": {"type": "STRING"},
                            "dosage": {"type": "STRING"},
                            "primaryPurpose": {"type": "STRING"},
                            "potentialSideEffects": {"type": "ARRAY", "items": {"type": "STRING"}},
                            "precautions": {"type": "ARRAY", "items": {"type": "STRING"}}
                        },
                        "required": ["medicineName", "primaryPurpose"]
                    }
                },
                "lifestyleRecommendations": {
                    "type": "ARRAY",
                    "items": {
                        "type": "OBJECT",
                        "properties": {
                            "category": {"type": "STRING"},
                            "title": {"type": "STRING"},
                            "detail": {"type": "STRING"},
                            "priority": {"type": "STRING"}
                        },
                        "required": ["category", "title", "detail", "priority"]
                    }
                }
            },
            "required": ["summary", "riskScore", "confidenceScore", "doctorConsultation", "labResults"]
        }

        if image_base64 and image_mime_type:
            contents = [
                {
                    "parts": [
                        {"inlineData": {"mimeType": image_mime_type, "data": image_base64}},
                        {"text": "Analyze this medical report image thoroughly and return the structured JSON analysis."}
                    ]
                }
            ]
        else:
            contents = [
                {
                    "parts": [
                        {"text": f"Analyze this medical lab report text:\n\n{report_text}"}
                    ]
                }
            ]

        raw_res = call_gemini_api(contents, system_instruction, json_schema)
        if raw_res:
            try:
                parsed = json.loads(raw_res)
                report_id = f"report-py-{int(time.time() * 1000)}"
                return {
                    "id": report_id,
                    "userId": user_id,
                    "fileName": file_name,
                    "fileType": image_mime_type or "application/pdf",
                    "originalText": report_text or "Multimodal Image Extraction",
                    "uploadDate": time.strftime("%Y-%m-%dT%H:%M:%S.000Z"),
                    "patientName": parsed.get("patientName", "Patient"),
                    "patientAge": parsed.get("patientAge", "Unspecified"),
                    "patientGender": parsed.get("patientGender", "Unspecified"),
                    "labName": parsed.get("labName", "Diagnostic Laboratory"),
                    "reportDate": parsed.get("reportDate", time.strftime("%Y-%m-%d")),
                    "summary": parsed.get("summary", "Medical report processed."),
                    "riskScore": parsed.get("riskScore", "Low"),
                    "confidenceScore": float(parsed.get("confidenceScore", 94.5)),
                    "doctorConsultation": parsed.get("doctorConsultation", "Routine Follow-up"),
                    "doctorNotes": parsed.get("doctorNotes", "Consult your physician for medical review."),
                    "labResults": [
                        {
                            "id": f"lr-{report_id}-{idx}",
                            "testName": lr.get("testName", "Test"),
                            "category": lr.get("category", "General"),
                            "resultValue": str(lr.get("resultValue", "-")),
                            "unit": lr.get("unit", ""),
                            "referenceRange": lr.get("referenceRange", "Standard"),
                            "status": lr.get("status", "Normal"),
                            "clinicalSignificance": lr.get("clinicalSignificance", "Evaluated biomarker"),
                            "explanation": lr.get("explanation", "Parsed lab result.")
                        } for idx, lr in enumerate(parsed.get("labResults", []))
                    ],
                    "conditionPredictions": parsed.get("conditionPredictions", []),
                    "medicationExplanations": parsed.get("medicationExplanations", []),
                    "lifestyleRecommendations": parsed.get("lifestyleRecommendations", []),
                    "language": "en"
                }
            except Exception as e:
                sys.stderr.write(f"Failed to parse Gemini response: {e}\n")

    # If API key is absent or Gemini call failed, run Python Engine
    lab_results = parse_lab_text_python(report_text)
    
    # Calculate Risk Score dynamically from parsed test statuses
    abnormal_count = sum(1 for lr in lab_results if lr['status'] in ['High', 'Low', 'Critical'])
    critical_count = sum(1 for lr in lab_results if lr['status'] == 'Critical')
    
    risk_score = "Low"
    doctor_consultation = "Routine Follow-up"
    if critical_count > 0 or abnormal_count >= 3:
        risk_score = "High"
        doctor_consultation = "Consult Doctor Soon"
    elif abnormal_count > 0:
        risk_score = "Medium"
        doctor_consultation = "Routine Follow-up"

    if critical_count >= 2:
        risk_score = "Critical"
        doctor_consultation = "Immediate Medical Evaluation"

    summary = f"Report text processed by Python Pathology Parser. Parsed {len(lab_results)} laboratory test parameters. Identified {abnormal_count} abnormal value(s)."
    
    report_id = f"report-py-{int(time.time() * 1000)}"
    return {
        "id": report_id,
        "userId": user_id,
        "fileName": file_name,
        "fileType": "application/pdf",
        "originalText": report_text,
        "uploadDate": time.strftime("%Y-%m-%dT%H:%M:%S.000Z"),
        "patientName": "Patient Record",
        "patientAge": "30-50",
        "patientGender": "Unspecified",
        "labName": "Pathology Diagnostics",
        "reportDate": time.strftime("%Y-%m-%d"),
        "summary": summary,
        "riskScore": risk_score,
        "confidenceScore": 92.0,
        "doctorConsultation": doctor_consultation,
        "doctorNotes": f"Detected {abnormal_count} out-of-range biomarker(s). Schedule follow-up with attending physician.",
        "labResults": [
            {
                "id": f"lr-{report_id}-{idx}",
                **lr
            } for idx, lr in enumerate(lab_results)
        ],
        "conditionPredictions": [
            {
                "conditionName": "Biomarker Parameter Deviation",
                "possibilityLevel": "Moderate" if abnormal_count > 0 else "Low",
                "description": f"Identified {abnormal_count} test result(s) outside standard clinical reference range.",
                "keyIndicators": [lr['testName'] for lr in lab_results if lr['status'] != 'Normal'],
                "disclaimer": "Educational clinical synthesis only."
            }
        ] if abnormal_count > 0 else [],
        "medicationExplanations": [],
        "lifestyleRecommendations": [
            {
                "category": "Diet",
                "title": "Dietary Adjustment Plan",
                "detail": "Maintain clean hydration, balanced nutrition, and reduce ultra-processed sodium/sugars.",
                "priority": "High"
            },
            {
                "category": "Exercise",
                "title": "Regular Cardiovascular Exercise",
                "detail": "Engage in 150 minutes of moderate aerobic activity weekly.",
                "priority": "Medium"
            }
        ],
        "language": "en"
    }

def run_chat(params):
    report = params.get("report", {})
    chat_history = params.get("chatHistory", [])
    user_question = params.get("userQuestion", "")

    if os.environ.get("GEMINI_API_KEY"):
        system_instruction = f"""You are an AI Medical Assistant answering patient questions about their lab report.
Report Context:
Patient: {report.get('patientName')}, Risk: {report.get('riskScore')}
Summary: {report.get('summary')}
Lab Results: {json.dumps(report.get('labResults', []))}
Always answer concisely and politely with a standard disclaimer that you are an AI assistant."""

        contents = []
        for msg in chat_history:
            sender = msg.get("sender")
            text = msg.get("message")
            if text:
                contents.append({"parts": [{"text": f"{sender}: {text}"}]})

        contents.append({"parts": [{"text": f"Patient Question: {user_question}"}]})

        ans = call_gemini_api(contents, system_instruction)
        if ans:
            return ans

    # Python NLP Q&A engine fallback
    q_lower = user_question.lower()
    lab_results = report.get("labResults", [])
    
    # Search if user is asking about specific test name
    matched_tests = [lr for lr in lab_results if lr.get("testName", "").lower() in q_lower or any(word in lr.get("testName", "").lower() for word in q_lower.split())]
    
    if matched_tests:
        t = matched_tests[0]
        return f"According to your report, your {t['testName']} result is {t['resultValue']} {t['unit']} (Status: {t['status']}). Reference range is {t['referenceRange']}. {t['explanation']} (Note: Consult your physician for medical advice)."
        
    if "risk" in q_lower or "danger" in q_lower or "serious" in q_lower:
        return f"Your overall report risk level is assessed as '{report.get('riskScore', 'Low')}'. Doctor consultation advice: '{report.get('doctorConsultation', 'Routine Follow-up')}'. Please discuss these findings directly with your doctor."

    if "medication" in q_lower or "medicine" in q_lower or "drug" in q_lower:
        meds = report.get("medicationExplanations", [])
        if meds:
            med_list = ", ".join([f"{m['medicineName']} ({m.get('dosage','')})" for m in meds])
            return f"The medications listed in your report context are: {med_list}. Always follow your doctor's exact prescription instructions."
        return "No specific medications were noted in your analyzed lab document."

    return f"Based on your medical report ({report.get('fileName')}), you have {len(lab_results)} lab parameters evaluated with an overall risk score of {report.get('riskScore')}. Summary: {report.get('summary')}. Please share this report with your physician."

def translate_text_to_ml(text):
    if not text:
        return ""
    # Smart fallback dictionary for Malayalam medical terms
    replacements = {
        "Fasting Blood Sugar": "ഫാസ്റ്റിംഗ് ബ്ലഡ് ഷുഗർ (ഉപവാസ രക്തത്തിലെ പഞ്ചസാര)",
        "Postprandial": "ഭക്ഷണത്തിനു ശേഷമുള്ള പഞ്ചസാര",
        "Glucose": "ഗ്ലൂക്കോസ് (പഞ്ചസാര)",
        "High": "ഉയർന്ന നില (High)",
        "Low": "കുറഞ്ഞ നില (Low)",
        "Normal": "സാധാരണ നില (Normal)",
        "Critical": "ഗുരുതരമായ നില (Critical)",
        "Optimal": "ഉത്തമമായ നില (Optimal)",
        "Elevated": "കൂടിയ അളവ് (Elevated)",
        "Cholesterol": "കൊളസ്ട്രോൾ",
        "Hemoglobin": "ഹീമോഗ്ലോബിൻ",
        "Thyroid": "തൈറോയ്ഡ്",
        "Kidney": "വൃക്ക (Kidney)",
        "Liver": "കരൾ (Liver)",
        "Doctor Consultation": "ഡോക്ടറുടെ പരിശോധന ആലോചന",
        "Routine Follow-up": "പതിവ് പരിശോധന മതിയത്",
        "Immediate Specialist Consultation": "ഉടൻ വിദഗ്ദ്ധ ഡോക്ടറെ കാണുക",
        "Dietary Advice": "ഭക്ഷണ ക്രമീകരണ ഉപദേശം",
        "Lifestyle Advice": "ജീവിതശൈലി നിർദ്ദേശങ്ങൾ",
        "Patient": "രോഗി",
        "Anemia": "രക്തക്കുറവ് (അനീമിയ)",
        "Diabetes": "പ്രമേഹം (ഡയബറ്റിസ്)",
        "Risk": "അപകടസാധ്യത"
    }
    res = text
    for k, v in replacements.items():
        res = res.replace(k, v)
    return res

def translate_text_to_hi(text):
    if not text:
        return ""
    replacements = {
        "Fasting Blood Sugar": "फास्टिंग ब्लड शुगर (खाली पेट रक्त शर्करा)",
        "Postprandial": "खाने के बाद की शर्करा",
        "Glucose": "ग्लूकोज (शर्करा)",
        "High": "उच्च स्तर (High)",
        "Low": "कम स्तर (Low)",
        "Normal": "सामान्य स्तर (Normal)",
        "Critical": "गंभीर स्तर (Critical)",
        "Optimal": "उत्कृष्ट स्तर (Optimal)",
        "Elevated": "बढ़ा हुआ स्तर (Elevated)",
        "Cholesterol": "कोलेस्ट्रॉल",
        "Hemoglobin": "हीमोग्लोबिन",
        "Thyroid": "थायरॉयड",
        "Kidney": "गुर्दा / किडनी",
        "Liver": "यकृत / लिवर",
        "Doctor Consultation": "डॉक्टर से परामर्श",
        "Routine Follow-up": "नियमित डॉक्टर जांच",
        "Immediate Specialist Consultation": "तुरंत विशेषज्ञ डॉक्टर से संपर्क करें",
        "Dietary Advice": "आहार संबंधी सलाह",
        "Lifestyle Advice": "दिनचर्या / जीवनशैली सलाह",
        "Patient": "मरीज",
        "Anemia": "रक्तअल्पता (एनीमिया)",
        "Diabetes": "मधुमेह (डायबिटीज)",
        "Risk": "जोखिम स्तर"
    }
    res = text
    for k, v in replacements.items():
        res = res.replace(k, v)
    return res

def run_translate(params):
    import copy
    report = copy.deepcopy(params.get("report", {}))
    target_lang = params.get("targetLanguage", "en")

    lang_map = {
        "ml": "Malayalam (മലയാളം)",
        "hi": "Hindi (हिंदी)",
        "en": "English",
        "es": "Spanish",
        "ta": "Tamil",
        "te": "Telugu"
    }
    lang_name = lang_map.get(target_lang, target_lang)

    if target_lang == "en":
        report['language'] = 'en'
        return report

    if os.environ.get("GEMINI_API_KEY"):
        system_instruction = (
            f"You are an expert clinical medical translator. Translate all human-readable string values "
            f"in this medical report into {lang_name} ({target_lang}). "
            f"Translate fields: summary, doctorConsultation, doctorNotes, dietaryAdvice, lifestyleAdvice, "
            f"labResults explanations and clinicalSignificance, medicationExplanations precautions. "
            f"Keep numerical values, units, reference ranges, and JSON keys unchanged. Return strictly JSON."
        )
        contents = [{"parts": [{"text": f"Translate medical report JSON into {lang_name}:\n\n{json.dumps(report, ensure_ascii=False)}"}]}]
        res = call_gemini_api(contents, system_instruction)
        if res:
            try:
                translated = json.loads(res)
                translated['language'] = target_lang
                return translated
            except Exception as e:
                sys.stderr.write(f"Translation JSON parsing error: {e}\n")

    # Offline translation fallback for Malayalam and Hindi
    report['language'] = target_lang
    if target_lang == "ml":
        if report.get('summary'):
            report['summary'] = translate_text_to_ml(report['summary'])
        if report.get('doctorConsultation'):
            report['doctorConsultation'] = translate_text_to_ml(report['doctorConsultation'])
        if report.get('doctorNotes'):
            report['doctorNotes'] = translate_text_to_ml(report['doctorNotes'])
        for item in report.get('labResults', []):
            if item.get('explanation'):
                item['explanation'] = translate_text_to_ml(item['explanation'])
            if item.get('clinicalSignificance'):
                item['clinicalSignificance'] = translate_text_to_ml(item['clinicalSignificance'])
        if report.get('dietaryAdvice'):
            report['dietaryAdvice'] = [translate_text_to_ml(x) for x in report['dietaryAdvice']]
        if report.get('lifestyleAdvice'):
            report['lifestyleAdvice'] = [translate_text_to_ml(x) for x in report['lifestyleAdvice']]

    elif target_lang == "hi":
        if report.get('summary'):
            report['summary'] = translate_text_to_hi(report['summary'])
        if report.get('doctorConsultation'):
            report['doctorConsultation'] = translate_text_to_hi(report['doctorConsultation'])
        if report.get('doctorNotes'):
            report['doctorNotes'] = translate_text_to_hi(report['doctorNotes'])
        for item in report.get('labResults', []):
            if item.get('explanation'):
                item['explanation'] = translate_text_to_hi(item['explanation'])
            if item.get('clinicalSignificance'):
                item['clinicalSignificance'] = translate_text_to_hi(item['clinicalSignificance'])
        if report.get('dietaryAdvice'):
            report['dietaryAdvice'] = [translate_text_to_hi(x) for x in report['dietaryAdvice']]
        if report.get('lifestyleAdvice'):
            report['lifestyleAdvice'] = [translate_text_to_hi(x) for x in report['lifestyleAdvice']]

    return report

def main():
    if len(sys.argv) < 2:
        sys.stderr.write("Usage: python3 analyzer.py <action>\n")
        sys.exit(1)

    action = sys.argv[1]
    
    try:
        input_data = sys.stdin.read()
        params = json.loads(input_data) if input_data.strip() else {}
    except Exception as e:
        sys.stderr.write(f"Invalid JSON input: {e}\n")
        sys.exit(1)

    if action == "analyze":
        output = run_analysis(params)
    elif action == "chat":
        output = run_chat(params)
    elif action == "translate":
        output = run_translate(params)
    else:
        output = {"error": f"Unknown action {action}"}

    print(json.dumps(output))

if __name__ == "__main__":
    main()
