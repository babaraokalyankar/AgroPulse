import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer


df = pd.read_csv('filter.csv')

# Handle missing disease status
df['crop_disease_status'] = df['crop_disease_status'].fillna('None')
df.loc[df['crop_disease_status'].str.strip() == '', 'crop_disease_status'] = 'None'

# Drop less relevant features
df.drop(columns=['yield_kg_per_hectare', 'NDVI_index', 'sunlight_hours'], inplace=True)

# Fill missing categorical and numerical values
for col in ['irrigation_type', 'fertilizer_type']:
    df[col] = df[col].fillna('Unknown')
df['pesticide_usage_ml'] = df['pesticide_usage_ml'].fillna(df['pesticide_usage_ml'].median())

df = df.dropna()

X = df.drop(columns=['crop_disease_status'])
y = df['crop_disease_status']

le = LabelEncoder()
y_encoded = le.fit_transform(y)

categorical_features = ['irrigation_type', 'fertilizer_type']
numerical_features = [col for col in X.columns if col not in categorical_features]

numeric_transformer = Pipeline([
    ('imputer', SimpleImputer(strategy='median')),
    ('scaler', StandardScaler())
])
categorical_transformer = Pipeline([
    ('imputer', SimpleImputer(strategy='constant', fill_value='Unknown')),
    ('onehot', OneHotEncoder(handle_unknown='ignore'))
])
preprocessor = ColumnTransformer([
    ('num', numeric_transformer, numerical_features),
    ('cat', categorical_transformer, categorical_features)
])

clf = Pipeline([
    ('preprocessor', preprocessor),
    ('classifier', RandomForestClassifier(random_state=42))
])

X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded)

clf.fit(X_train, y_train)

# Load recommendations from a file
def load_recommendations(filepath='recommendations.txt'):
    recommendations = {}
    with open(filepath, 'r') as f:
        content = f.read().strip().split('\n\n')
        for block in content:
            if ':' in block:
                key, value = block.split(':', 1)
                recommendations[key.strip()] = value.strip()
    return recommendations

# Interactive input
def get_input():
    print("\nEnter the following farm details:")

    soil_moisture = float(input("1. Soil moisture %: "))
    soil_pH = float(input("2. Soil pH: "))
    temperature = float(input("3. Temperature (°C): "))
    rainfall = float(input("4. Rainfall (mm): "))
    humidity = float(input("5. Humidity %: "))
    irrigation_type = input("6. Irrigation type (Sprinkler, Manual, Drip, Unknown): ").strip()
    fertilizer_type = input("7. Fertilizer type (Organic, Inorganic, Mixed, Unknown): ").strip()
    pesticide_usage = float(input("8. Pesticide usage (ml): "))

    sample = pd.DataFrame({
        'soil_moisture_%': [soil_moisture],
        'soil_pH': [soil_pH],
        'temperature_C': [temperature],
        'rainfall_mm': [rainfall],
        'humidity_%': [humidity],
        'irrigation_type': [irrigation_type],
        'fertilizer_type': [fertilizer_type],
        'pesticide_usage_ml': [pesticide_usage]
    })

    return sample

# Get input and predict
new_data = get_input()
probs = clf.predict_proba(new_data)[0]

print("\n📊 Chances of disease status:")
for cls, prob in zip(le.classes_, probs):
    print(f" - {cls}: {prob*100:.2f}%")

# Get most likely prediction
predicted_index = probs.argmax()
predicted_class = le.classes_[predicted_index]

# Load and display recommendation
recommendations = load_recommendations()
print(f"\n✅ Most likely disease status: {predicted_class}")
print("\n🌿 Recommended Actions:")
if predicted_class in recommendations:
    print(recommendations[predicted_class])
else:
    print("No specific recommendation found. Please consult an expert or update 'recommendations.txt'.")
