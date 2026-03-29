import pytesseract
import re
import easyocr
from difflib import SequenceMatcher
import math
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime, timedelta
import numpy as np
import cv2
import pandas as pd
import joblib
import random
import json
app=Flask(__name__)
CORS(app)

client = MongoClient("mongodb://localhost:27017/")
db = client["sma"]
collection = db["user"]
s=db["schedule"]
rt=db["alarm"]
p=db["problem"]
y=db["quizc"]
t=db["schedule1"]


api_key = os.getenv("GROQ_API_KEY")




pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def serialize_doc(doc):
    if doc and "_id" in doc:
        doc["_id"] = str(doc["_id"])
    return doc

def convert_objectid(obj):
    if isinstance(obj, list):
        return [convert_objectid(i) for i in obj]

    elif isinstance(obj, dict):
        new_obj = {}
        for k, v in obj.items():
            if k == "_id":
                new_obj[k] = str(v)
            else:
                new_obj[k] = convert_objectid(v)
        return new_obj

    else:
        return obj
    


# ------------------ HELPERS ------------------

def is_lab(subject):
    return "lab" in subject.lower() or "laboratory" in subject.lower()

def str_to_date(date_str):
    return datetime.strptime(date_str, "%d-%m-%Y")

def date_to_str(date_obj):
    return date_obj.strftime("%d-%m-%Y")

# ------------------ MAIN LOGIC ------------------

def generate_schedule(data):
    schedule = []
    subjects = data["data"]

    print("Incoming Data:", subjects)  # debug

    # ✅ NORMALIZE KEYS (IMPORTANT FIX)
    normalized_subjects = []
    for s in subjects:
        normalized_subjects.append({
            "subject": s.get("subject") or s.get("Subject"),
            "date": s.get("date") or s.get("Date")
        })

    subjects = normalized_subjects

    today = datetime.today()

    # ✅ GET LAST EXAM DATE
    valid_dates = [
        str_to_date(s["date"])
        for s in subjects
        if s["date"]
    ]

    if not valid_dates:
        raise Exception("No valid exam dates provided")

    last_exam_date = max(valid_dates)

    # ✅ TOTAL STUDY DAYS
    total_days = (last_exam_date - today).days
    if total_days <= 0:
        total_days = 1

    # ✅ SPLIT SUBJECTS
    theory_subjects = [
        s for s in subjects if not is_lab(s["subject"])
    ]

    lab_subjects = [
        s for s in subjects if is_lab(s["subject"])
    ]

    # ✅ DISTRIBUTE DAYS
    remaining_days = total_days - len(lab_subjects)

    if len(theory_subjects) > 0:
        days_per_theory = max(1, math.floor(remaining_days / len(theory_subjects)))
    else:
        days_per_theory = 0

    current_date = today

    # ---------------- THEORY ----------------
    for item in theory_subjects:
        start_date = current_date
        end_date = current_date + timedelta(days=days_per_theory - 1)

        schedule.append({
            "subject": item["subject"],
            "type": "theory",
            "start_date": date_to_str(start_date),
            "end_date": date_to_str(end_date)
        })

        current_date = end_date + timedelta(days=1)

    # ---------------- LAB ----------------
    for item in lab_subjects:
        start_date = current_date

        schedule.append({
            "subject": item["subject"],
            "type": "lab",
            "start_date": date_to_str(start_date),
            "end_date": date_to_str(start_date)
        })

        current_date += timedelta(days=1)

    return {
        "total_days": total_days,
        "last_exam_date": date_to_str(last_exam_date),
        "study_schedule": schedule
    }

# ------------------ ROUTES ------------------

# ✅ INSERT
@app.route("/semcrud", methods=["POST"])
def semcrud():
    try:
        vi = request.json.get("vi")
        username = request.json.get("id")

        if not vi or not username:
            return jsonify({
                "message": False,
                "error": "Missing data or user id"
            })
        def sort_key(item):
            if item.get('date') is None:
                return (0, datetime.min)  # None first
            return (1, datetime.strptime(item['date'], "%d-%m-%Y"))

        # ✅ SORT DATA
        vi = sorted(vi, key=sort_key)
        data = {"data": vi}
        
        result = generate_schedule(data)

        t.insert_one({
            "username": username,
            "data": result
        })

        return jsonify({
            "message": True,
            "data": result
        })

    except Exception as e:
        return jsonify({
            "message": False,
            "error": str(e)
        })


# ✅ GET
@app.route("/sem", methods=["GET"])
def sem():
    try:
        user_id = request.args.get("id")

        records = list(
            t.find({"username": user_id}, {"_id": 0})
        )

        return jsonify({
            "message": True,
            "data": records
        })

    except Exception as e:
        return jsonify({
            "message": False,
            "error": str(e)
        })


@app.route("/reg",methods=['POST','GET'])
def reg():
    name=request.json.get('a1')
    email=request.json.get('a2')
    de=request.json.get('a3')
    br=request.json.get('a4')
    yr=request.json.get('a5')
    sem=request.json.get('a6')
    tar=request.json.get('a7')
    if collection.find_one({"email": email}):
        return jsonify({"message": False})
    else:
        collection.insert_one({"username":name,"email":email,"degree":de,"branch":br,"year":yr,"semester":sem,"desc":tar})
        return jsonify({"message":True})


@app.route("/sdelete",methods=['POST','GET'])
def sdelete():
    id=request.json.get("id")
    t.delete_many({"username": id})
    return jsonify({"message":True})


@app.route("/carv", methods=['GET'])
def carv():
    name = request.args.get("id")

    # ✅ correct collection
    data = db.problem.find_one({"username": name})

    if data:
        data["_id"] = str(data["_id"])  # convert ObjectId

        quiz_correct = data.get("quizcorrect", 0)

        return jsonify({
            "username": name,
            "quizcorrect": quiz_correct
        })
    else:
        return jsonify({
            "username": name,
            "quizcorrect": 0
        })


@app.route("/pa1",methods=['POST','GET'])
def pa1():
    type=request.json.get('a1')
    title=request.json.get('a2')
    date=request.json.get('a3')
    desc=request.json.get('a4')
    name=request.json.get('id')
    s.insert_one({"type":type,"title":title,"date":date,"desc":desc,"username":name})
    return jsonify({"message":True})

@app.route("/aldb", methods=["GET"])
def aldb():
    name = request.args.get("id")
    print("Username received:", name)

    data = list(rt.find({"username": name}))   # ✅ FIXED HERE

    for doc in data:
        doc["_id"] = str(doc["_id"])

    print("Data sending:", data)
    return jsonify(data)


@app.route("/scdb", methods=["GET"])
def scdb():
    name = request.args.get("id")
    data = list(s.find({"username": name}))   # ✅ FIXED HERE
    for doc in data:
        doc["_id"] = str(doc["_id"])
    return jsonify(data)

@app.route("/al",methods=['POST','GET'])
def al():
    type=request.json.get('a1')
    ring=request.json.get('a2')
    date=request.json.get('a3')
    name=request.json.get('id')
    rt.insert_one({"type":type,"ring":ring,"date":date,"username":name})
    return jsonify({"message":True})

@app.route("/alde",methods=['POST','GET'])
def alde():
    w=request.json.get('v')
    rt.delete_one({"_id": ObjectId(w)})
    return jsonify({"message":True})



@app.route("/scde",methods=['POST','GET'])
def scde():
    w=request.json.get('r')
    rt.delete_one({"_id": ObjectId(w)})
    return jsonify({"message":True})

@app.route("/log", methods=['POST', 'GET'])
def login():
    name = request.json.get('b1')
    email = request.json.get('b2')

    user = collection.find_one({
        "username": name,
        "email": email
    })

    if user:
        # Get today's date (only date part)
        today = datetime.now().date()

        # Get stored date
        stored_date = user.get("date")

        if stored_date:
            stored_date = stored_date.date()  # remove time part

        # ✅ Compare dates
        if stored_date == today:
            # Same day → do nothing
            pass
        else:
            # New day → increase streak
            collection.update_one(
                {"username": name},
                {
                    "$inc": {"streak": 1},
                    "$set": {"date": datetime.now()}
                }
            )

        data = convert_objectid([user])  # keep your format

        return jsonify({
            "message": True,
            "msg1": name,
            "details": data
        })

    else:
        return jsonify({"message": False})


@app.route("/prclai", methods=['GET'])
def prclai():
    name = request.args.get("id")
    current_date = datetime.now().strftime("%Y-%m-%d")

    data = db.problem.find_one({"username": name})

    if not data:
        return jsonify({"error": "User not found"})

    ddate = data.get('date')
    topic = data.get('ctopic')

    if current_date != ddate:

        model = joblib.load("model.pkl")
        scaler = joblib.load("scaler.pkl")

        eg = data.get("eg", 0)
        mg = data.get("mg", 0)
        hg = data.get("hg", 0)

        es = data.get("es", 0)
        ms = data.get("ms", 0)
        hs = data.get("hs", 0)

        tg = eg + mg + hg
        ts = es + ms + hs

        sample = [[
            es/(eg+1), ms/(mg+1), hs/(hg+1), ts/(tg+1),
            es, ms, hs, eg, mg, hg, ts, tg
        ]]

        sample_scaled = scaler.transform(sample)
        pred = model.predict(sample_scaled)

        ne = max(1, round(pred[0][0]))
        nm = max(1, round(pred[0][1]))
        nh = max(1, round(pred[0][2]))

        a = list(db.problemset.find({"topic": topic, "level": "easy"}).limit(ne))
        b = list(db.problemset.find({"topic": topic, "level": "medium"}).limit(nm))
        c = list(db.problemset.find({"topic": topic, "level": "hard"}).limit(nh))

        # ✅ CONVERT ObjectId → string (IMPORTANT)
        a = convert_objectid(a)
        b = convert_objectid(b)
        c = convert_objectid(c)

        db.problem.update_one(
            {"username": name},
            {"$set": {
                "easy": a,
                "medium": b,
                "hard": c,
                "date": current_date
            }}
        )

        return jsonify({
            "easy": a,
            "medium": b,
            "hard": c
        })

    else:
        easy = convert_objectid(data.get("easy", []))
        medium = convert_objectid(data.get("medium", []))
        hard = convert_objectid(data.get("hard", []))

        return jsonify({
            "easy": easy,
            "medium": medium,
            "hard": hard
        })






@app.route("/prto", methods=['GET'])
def prto():
    name = request.args.get("id")

    data = list(p.find({"username": name}))

    # ✅ FIX HERE
    data = convert_objectid(data)

    return jsonify(data)




@app.route("/upload", methods=["POST"])
def upload():
    file = request.files.get("file")
    file_bytes = np.frombuffer(file.read(), np.uint8)
    img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

    if img is None:
        print("❌ Image not found")
        exit()

    img = cv2.resize(img, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)

    h, w = img.shape[:2]
    crop = img[int(h*0.2):int(h*0.75), int(w*0.05):int(w*0.95)]

    # ================================
    # 🔹 PREPROCESS
    # ================================
    gray = cv2.cvtColor(crop, cv2.COLOR_BGR2GRAY)
    gray = cv2.GaussianBlur(gray, (3, 3), 0)

    # ================================
    # 🔹 OCR
    # ================================
    config = r'--oem 3 --psm 6'
    tess_text = pytesseract.image_to_string(gray, config=config)

    reader = easyocr.Reader(['en'])
    easy_lines = [res[1] for res in reader.readtext(crop)]

    lines = tess_text.split("\n") + easy_lines
    lines = [l.strip() for l in lines if len(l.strip()) > 3]

    # ================================
    # 🔹 CLEAN FUNCTIONS
    # ================================
    def clean_text(text):
        text = re.sub(r'[©\[\]_{}()|$]', '', text)
        text = re.sub(r'^[-–—\s]+', '', text)

        # remove codes like CS2512
        text = re.sub(r'\b[A-Z]{2,}\d{2,}\b', '', text)

        # remove leading numbers
        text = re.sub(r'^\d+\s*', '', text)
        text = re.sub(r'^[0O]S\s*', '', text)

        text = re.sub(r'\s+', ' ', text).strip()
        return text


    def fix_date(date):
        try:
            d, m, y = map(int, date.split("-"))

            if d > 31: d = 30
            if m > 12: m = 12
            if y > 2030: y = 2025

            return f"{d:02d}-{m:02d}-{y}"
        except:
            return None


    # ================================
    # 🔥 SMART FILTER (NO KEYWORDS)
    # ================================
    def is_valid_subject(text):
        if not text or len(text) < 10:
            return False

        words = text.split()

        # ❌ remove single/weak words
        if len(words) < 2:
            return False

        # ❌ remove too many symbols
        bad = len(re.findall(r'[^a-zA-Z\s]', text))
        if bad / len(text) > 0.3:
            return False

        # ❌ remove lines with mostly uppercase noise
        if text.isupper():
            return False

        # ❌ remove non-academic lines
        ignore = [
            "register", "number", "name", "dob",
            "semester", "code", "branch", "hall"
        ]
        if any(w in text.lower() for w in ignore):
            return False

        return True


    # ================================
    # 🔹 SIMILARITY CHECK
    # ================================
    def is_similar(a, b):
        return SequenceMatcher(None, a, b).ratio() > 0.85


    def normalize(text):
        text = text.lower()
        text = re.sub(r'[^a-z\s]', '', text)
        return text.strip()


    # ================================
    # 🔹 EXTRACT SUBJECTS
    # ================================
    subjects = []

    i = 0
    while i < len(lines):

        line = lines[i]

        # CASE 1: subject + date same line
        match = re.search(r'(.+?)\s*\(?(\d{2}-\d{2}-\d{4})', line)

        if match:
            subject = clean_text(match.group(1))
            date = fix_date(match.group(2))

            if is_valid_subject(subject):
                subjects.append({"Subject": subject, "Date": date})

        else:
            # CASE 2: subject + date next line
            if i + 1 < len(lines):
                next_line = lines[i + 1]

                date_match = re.search(r'(\d{2}-\d{2}-\d{4})', next_line)

                if date_match:
                    subject = clean_text(line)
                    date = fix_date(date_match.group(1))

                    if is_valid_subject(subject):
                        subjects.append({"Subject": subject, "Date": date})

                    i += 1  # skip date line

                else:
                    # CASE 3: lab subject (no date)
                    subject = clean_text(line)

                    if "lab" in subject.lower() or "laboratory" in subject.lower():
                        if is_valid_subject(subject):
                            subjects.append({"Subject": subject, "Date": None})

        i += 1


    # ================================
    # 🔹 REMOVE DUPLICATES (STRONG)
    # ================================
    final = []
    seen = []

    for s in subjects:
        norm = normalize(s["Subject"])

        duplicate = False
        for existing in seen:
            if is_similar(norm, existing):
                duplicate = True
                break

        if not duplicate:
            seen.append(norm)
            final.append(s)


    # ================================
    # 🔹 SORT
    # ================================
    final = sorted(final, key=lambda x: (x["Date"] is None, x["Date"]))


    # ================================
    # 🔹 FINAL OUTPUT
    # ================================
    print("\n===== FINAL GENERIC OUTPUT =====\n")
    unique = {}

    for item in final:
        subject = item["Subject"]
        date = item["Date"]

        # If subject not seen OR new date is better
        if subject not in unique:
            unique[subject] = item
        else:
            # Compare dates (convert to proper format if needed)
            if date > unique[subject]["Date"]:
                unique[subject] = item

# Convert back to list
    final = list(unique.values())
    for s in final:
        print(s)
    return jsonify({
        "message": "File received",
        "data":final
    })



@app.route("/qude", methods=['POST'])
def qude():
    try:
        model = joblib.load("quiz_model.pkl")

        req = request.get_json()

        if not req:
            return jsonify({"error": "Invalid JSON"}), 400

        # ✅ Clean input
        type_ = req.get("type", "").strip().lower()
        user_id = req.get("id")

        if not type_ or not user_id:
            return jsonify({"error": "Missing type or id"}), 400

        # -------------------------
        # Fetch user data
        # -------------------------
        data = db.problem.find_one({"username": user_id})

        if not data:
            return jsonify({"error": "User not found"}), 404

        # -------------------------
        # ML input
        # -------------------------
        user_correct = int(data.get('quizcorrect', 0))
        user_wrong = max(0, 10 - user_correct)

        user_df = pd.DataFrame(
            [[user_correct, user_correct, user_wrong]],
            columns=['score', 'correct', 'wrong']
        )

        prediction = model.predict(user_df)

        # ✅ FIX numpy issue
        difficulty = int(prediction[0]) + 1

        print("✅ difficulty:", difficulty)
        print("✅ type:", type_)

        # -------------------------
        # Mongo query (FIXED)
        # -------------------------
        questions_cursor = y.find({
            "difficulty": difficulty,
            "type": type_
        })

        questions_list = list(questions_cursor)

        print("✅ found:", len(questions_list))

        # -------------------------
        # No data case
        # -------------------------
        if not questions_list:
            return jsonify({
                "difficulty": difficulty,
                "questions": [],
                "message": "No questions found"
            })

        # -------------------------
        # Random selection
        # -------------------------
        quiz_questions = random.sample(
            questions_list,
            min(10, len(questions_list))
        )

        # Convert ObjectId
        for q in quiz_questions:
            q["_id"] = str(q["_id"])
        return jsonify({
            "questions": quiz_questions
        })

    except Exception as e:
        print("❌ ERROR:", e)
        return jsonify({"error": str(e)}), 500

@app.route("/prtoai", methods=["POST"])
def prtoai():
    try:
        name = request.json.get("id")
        print("User:", name)

        data = p.find_one({"username": name})
        print("DB Data:", data)

        if not data:
            return jsonify({"error": "No data found"}), 404

        topic = data.get("ctopic")
        level = data.get("level")
        date_str = data.get("date")

        print("Date from DB:", date_str)

        item_date = datetime.strptime(str(date_str), "%Y-%m-%d")

        today = datetime.today()
        days = (today - item_date).days

        print("Days:", days)

        # Load model
        model = joblib.load("topic_model.pkl")
        topic_encoder = joblib.load("topic_encoder.pkl")
        level_encoder = joblib.load("level_encoder.pkl")
        output_encoder = joblib.load("output_encoder.pkl")

        topic_encoded = topic_encoder.transform([topic])[0]
        level_encoded = level_encoder.transform([level])[0]

        sample = [[topic_encoded, level_encoded, days]]

        prediction = model.predict(sample)
        next_topic = output_encoder.inverse_transform(prediction)[0]

        # Level logic
        if days <= 2:
            next_level = "easy"
        elif days <= 5:
            next_level = "medium"
        else:
            next_level = "hard"

        current_date = datetime.now().strftime("%Y-%m-%d")

        # Update DB
        p.update_one(
            {"_id": data["_id"]},
            {
                "$set": {
                    "ctopic": next_topic,
                    "level": next_level,
                    "date": current_date
                }
            }
        )

        return jsonify({
            "message": "success",
            "topic": next_topic,
            "level": next_level
        })

    except Exception as e:
        print("❌ ERROR:", e)
        return jsonify({"error": str(e)}), 500





@app.route("/pci",methods=['POST','GET'])
def pci():
    name = request.json.get("id")
    p=int(request.json.get('p'))
    result = collection.update_one(
            {"username": name},
            {"$inc": {"pcount": p}}
        )
    return jsonify({"message":"successfully"})



@app.route("/snbi", methods=["GET"])
def snbi():
    name = request.args.get("id")   # ✅ FIX

    print("name:", name)

    user = collection.find_one({"username": name})

    return jsonify({
        "pcount": user.get("pcount", 0) if user else 0
    })

@app.route("/ifs", methods=["GET"])
def ifs():
    name = request.args.get("id")
    t = collection.find_one({"username": name})

    if t:
        t["_id"] = str(t["_id"])  # convert ObjectId to string
        return jsonify(t)
    else:
        return jsonify({"error": "User not found"}), 404


@app.route("/cb",methods=['POST','GET'])
def cb():
    user=request.json.get('cb')
    if len(user.split()) == 1:
        system_prompt = "Ask what the user wants to know if input is a single word."
    else:
        system_prompt = "Answer briefly and clearly."

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user}
        ]
    )

    return jsonify({"message":response.choices[0].message.content})


@app.route("/update_quiz_score", methods=["POST"])
def update_quiz_score():
    data = request.get_json()

    user_id = data.get("id")
    score = int(data.get("score", 0))

    # ✅ Update quizcorrect
    result = db.problem.update_one(
        {"username": user_id},
        {"$set": {"quizcorrect": score}}
    )

    return jsonify({
        "message": "Score updated successfully",
        "modified": result.modified_count
    })


@app.route("/conapi", methods=["POST", "OPTIONS"])
def conapi():
    if request.method == "OPTIONS":
        return jsonify({"message": "OK"}), 200

    user = request.json.get("message").lower()

    # ✅ Detect confusion words
    confusion_words = ["don't understand", "not understand", "confused", "again", "explain"]

    is_confused = any(word in user for word in confusion_words)

    # ✅ Dynamic system prompt
    if is_confused:
        system_prompt = """
You are a friendly teacher.

- Explain in simple words
- Use short sentences
- Be kind and supportive
- Give easy examples
"""
    else:
        system_prompt = """
Answer in ONLY 4 or 5 words.
No explanation.
"""

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user}
        ]
    )

    answer = response.choices[0].message.content

    # ✅ Only trim when NOT confused
    if not is_confused:
        answer = " ".join(answer.split()[:4])

    return jsonify({"message": answer})

@app.route("/apl", methods=['POST'])
def apl():
    data = request.get_json()

    print("RAW DATA:", data)

    name = data.get('id')
    semno = data.get('semno')

    print("Parsed:", name, semno)

    sem = (int(semno) + 1) % 9

    result = db.user.update_one(
        {"username": name},
        {"$set": {"semester": str(sem)}}
    )

    print("Matched:", result.matched_count)
    print("Modified:", result.modified_count)

    return jsonify({"message": True})


@app.route("/paide", methods=['POST', 'GET'])
def paide():

    user = "Give 2 upcoming 2026 symposiums, 2 hackathons, and 2 internships"

    system_prompt = """
    You are an assistant that ONLY responds in JSON format.

    Format:
    {
      "symposiums": [
        {"name": "", "description": ""},
        {"name": "", "description": ""}
      ],
      "hackathons": [
        {"name": "", "description": ""},
        {"name": "", "description": ""}
      ],
      "internships": [
        {"name": "", "description": ""},
        {"name": "", "description": ""}
      ]
    }

    Rules:
    - Give exactly 2 items in each category
    - Keep descriptions short
    - If no fixed date, mention "No fixed dates announced"
    """

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user}
        ]
    )

    # Convert AI string → JSON
    data = json.loads(response.choices[0].message.content)

    return jsonify(data)


@app.route("/career", methods=['POST', 'GET'])
def career():

    user = "Give the best programming language, best IT domain, and top 2 projects for that domain"

    system_prompt = """
    You are an assistant that ONLY responds in JSON format.

    Format:
    {
      "programming_language": {"name": ""},
      "domain": {
        "name": "",
        "projects": [
          {"name": ""},
          {"name": ""}
        ]
      }
    }

    Rules:
    - Give ONLY 1 best programming language (like Python)
    - Give ONLY 1 best IT domain (like Full Stack or AI)
    - Give exactly 2 best project names for that domain
    - Keep names short (e.g., AI Chatbot, E-commerce App, CRUD App)
    - DO NOT include descriptions
    - Output must be clean JSON only
    """

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user}
        ]
    )

    try:
        data = json.loads(response.choices[0].message.content)
    except:
        return jsonify({
            "error": "Invalid JSON from AI",
            "raw": response.choices[0].message.content
        })


    return jsonify(data)


if __name__=='__main__':
    app.run(debug=True)


