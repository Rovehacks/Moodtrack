from flask import Flask, request, jsonify
import pandas as pd
from sklearn.tree import DecisionTreeClassifier
from flask_cors import CORS


app = Flask(__name__)
CORS(app) 

# Constantes del Modelo
MIN_RECORDS_FOR_MODEL = 5
FEATURES = [
    'sueno_horas', 'gimnasio', 'correr', 'comidas',
    'trabajo_horas', 'escuela_horas', 'meditacion_min',
    'higiene', 'interaccion_social_min'
]
TARGET = 'estado_animo'

# Recomendaciones
THRESHOLDS = {
    "sueno_horas": (7, "Intenta dormir al menos 7-8 horas para mejorar tu descanso."),
    "gimnasio": (False, "Considera ejercitarte en el gimnasio, es un gran impulso de energía."),
    "correr": (False, "Salir a correr, aunque sea por un corto tiempo, puede mejorar tu ánimo."),
    "comidas": (3, "Asegúrate de tener al menos 3 comidas balanceadas al día."),
    "meditacion_min": (10, "Dedica al menos 10 minutos a la meditación para aclarar tu mente."),
    "higiene": (False, "Una buena higiene personal es clave para sentirse bien."),
    "interaccion_social_min": (30, "Intenta socializar al menos 30 minutos, ¡una charla puede cambiar tu día!")
}

# Entrenar Modelo
def entrenar_modelo(df):
    """
    Entrena un DecisionTreeClassifier si hay suficientes datos y variación.
    """
    if len(df) < MIN_RECORDS_FOR_MODEL:
        return None

    
    if df[TARGET].nunique() < 2:
        return None 

    X = df[FEATURES]
    y = df[TARGET]
    
    clf = DecisionTreeClassifier(max_depth=4, random_state=42)
    clf.fit(X, y)
    return clf

def generar_recomendaciones_con_modelo(modelo, ultimo_registro):
    """
    Genera recomendaciones basadas en la importancia de las características del modelo.
    Se enfoca en los hábitos que más impactan el ánimo del usuario.
    """
    importancias = pd.Series(modelo.feature_importances_, index=FEATURES).sort_values(ascending=False)
    recomendaciones = []
    
   
    for feature in importancias.head(3).index:
        if feature in THRESHOLDS:
            umbral, mensaje = THRESHOLDS[feature]
            valor_actual = ultimo_registro[feature]

            
            if isinstance(umbral, bool) and valor_actual == umbral: 
                 recomendaciones.append(mensaje)
            elif isinstance(umbral, int) and valor_actual < umbral: 
                 recomendaciones.append(mensaje)

    if not recomendaciones:
        recomendaciones.append("¡Tus hábitos clave están muy bien! Sigue con esa constancia.")
        
    return recomendaciones

def generar_recomendaciones_basadas_en_reglas(ultimo_registro):
    """
    Genera recomendaciones usando reglas simples. Ideal para usuarios nuevos.
    """
    recomendaciones = []
    for feature, (umbral, mensaje) in THRESHOLDS.items():
        valor_actual = ultimo_registro[feature]
        if isinstance(umbral, bool) and valor_actual == umbral:
             recomendaciones.append(mensaje)
        elif isinstance(umbral, int) and valor_actual < umbral:
             recomendaciones.append(mensaje)

    if not recomendaciones:
        recomendaciones.append("¡Excelente día! Parece que todos tus hábitos están en orden.")
        
   
    return recomendaciones[:3]


# API
@app.route('/recomendar', methods=['POST'])
def recomendar():
    """
    Endpoint principal para obtener recomendaciones.
    Decide si usar el modelo de ML o las reglas básicas.
    """
    data = request.get_json()
    registros = data.get("registros")

    if not registros:
        return jsonify({"recomendaciones": ["Empieza por añadir tu primer registro de hábitos."]})

    try:
        df = pd.DataFrame(registros)
        for col in ['gimnasio', 'correr', 'higiene']:
            if col in df.columns:
                df[col] = df[col].astype(bool)

    except Exception as e:
        return jsonify({"error": f"Error al procesar los datos: {e}"}), 400

    ultimo_registro = df.iloc[-1].to_dict()
    modelo = entrenar_modelo(df)
    
    if modelo:
        recomendaciones = generar_recomendaciones_con_modelo(modelo, ultimo_registro)
    else:
        recomendaciones = generar_recomendaciones_basadas_en_reglas(ultimo_registro)
        
    return jsonify({"recomendaciones": recomendaciones})

if __name__ == '__main__':
    app.run(port=8000, debug=True)
