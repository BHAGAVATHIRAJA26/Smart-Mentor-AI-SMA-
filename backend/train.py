import pandas as pd
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.multioutput import MultiOutputRegressor
from xgboost import XGBRegressor

# ====================================
# 1️⃣ QUIZ MODEL TRAINING
# ====================================
def train_quiz_model():

    data = pd.read_csv("training_data.csv")

    X = data[['score','correct','wrong']]
    y = data['difficulty']

    model = RandomForestClassifier(
        n_estimators=200,
        random_state=42
    )

    model.fit(X,y)

    joblib.dump(model,"quiz_model.pkl")

    print("✅ Quiz Model Trained")
    print("✅ Saved as quiz_model.pkl")


# ====================================
# 2️⃣ PROBLEM RECOMMENDATION MODEL
# ====================================
def train_problem_model():

    data = pd.read_csv("problemdataset.csv")

    data['easy_acc'] = data['easy_problems_solved'] / (data['easy_problems_given'] + 1)
    data['medium_acc'] = data['medium_problems_solved'] / (data['medium_problems_given'] + 1)
    data['hard_acc'] = data['hard_problems_solved'] / (data['hard_problems_given'] + 1)
    data['overall_acc'] = data['total_problems_solved'] / (data['total_problems_given'] + 1)

    X = data[
        [
            'easy_acc','medium_acc','hard_acc','overall_acc',
            'easy_problems_solved','medium_problems_solved','hard_problems_solved',
            'easy_problems_given','medium_problems_given','hard_problems_given',
            'total_problems_solved','total_problems_given'
        ]
    ]

    y = data[['next_easy','next_medium','next_hard']]

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    model = MultiOutputRegressor(
        XGBRegressor(
            n_estimators=500,
            learning_rate=0.05,
            max_depth=6,
            subsample=0.8,
            colsample_bytree=0.8,
            random_state=42
        )
    )

    model.fit(X_scaled,y)

    joblib.dump(model,"model.pkl")
    joblib.dump(scaler,"scaler.pkl")

    print("✅ Problem Recommendation Model Trained")
    print("✅ Saved as problem_model.pkl")


# ====================================
# 3️⃣ TOPIC RECOMMENDATION MODEL
# ====================================
def train_topic_model():

    data = pd.read_csv("topicdata.csv")

    topic_encoder = LabelEncoder()
    level_encoder = LabelEncoder()
    output_encoder = LabelEncoder()

    data['topic'] = topic_encoder.fit_transform(data['topic'])
    data['level'] = level_encoder.fit_transform(data['level'])
    data['next_topic'] = output_encoder.fit_transform(data['next_topic'])

    X = data[['topic','level','days_spent']]
    y = data['next_topic']

    model = RandomForestClassifier(
        n_estimators=300,
        max_depth=12,
        random_state=42
    )

    model.fit(X,y)

    joblib.dump(model,"topic_model.pkl")
    joblib.dump(topic_encoder,"topic_encoder.pkl")
    joblib.dump(level_encoder,"level_encoder.pkl")
    joblib.dump(output_encoder,"output_encoder.pkl")

    print("✅ Topic Recommendation Model Trained")
    print("✅ Saved as topic_model.pkl")


# ====================================
# MAIN MENU
# ====================================
print("\nSelect Model Training")

print("1 → Train Quiz Model")
print("2 → Train Problem Recommendation Model")
print("3 → Train Topic Recommendation Model")

choice = int(input("Enter choice: "))

if choice == 1:
    train_quiz_model()

elif choice == 2:
    train_problem_model()

elif choice == 3:
    train_topic_model()

else:
    print("❌ Invalid choice")