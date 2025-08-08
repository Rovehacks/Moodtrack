from flask import Flask, request, jsonify
import pandas as pd
from sklearn.tree import DecisionTreeClassifier
from flask_cors import CORS  # Asegúrate de importar esto

app = Flask(__name__)       # 🔁 Primero define tu app
CORS(app)                   # ✅ Luego habilita CORS

def entrenar_modelo(df):
    if len(df) < 5:
        return None  # Mínimo 5 registros para evitar overfitting

    X = df[['sueno_horas', 'gimnasio', 'correr', 'comidas',
            'trabajo_horas', 'escuela_horas', 'meditacion_min',
            'higiene', 'interaccion_social_min']]
    y = df['estado_animo']
    clf = DecisionTreeClassifier(max_depth=4)
    clf.fit(X, y)
    return clf

def generar_recomendaciones(modelo, ultimo_registro):
    recomendaciones = []
    prediccion = modelo.predict([ultimo_registro])[0]

    if prediccion < 0:
        if ultimo_registro[0] < 6:
            recomendaciones.append("Intenta dormir al menos 7 horas.")
        if not ultimo_registro[1]:
            recomendaciones.append("Considera ejercitarte en el gimnasio.")
        if not ultimo_registro[2]:
            recomendaciones.append("Salir a correr puede mejorar tu ánimo.")
        if ultimo_registro[3] < 3:
            recomendaciones.append("Asegúrate de hacer tus 3 comidas diarias.")
        if ultimo_registro[6] < 10:
            recomendaciones.append("Realiza al menos 10 minutos de meditación.")
        if not ultimo_registro[7]:
            recomendaciones.append("Cuida tu higiene personal.")
        if ultimo_registro[8] < 30:
            recomendaciones.append("Socializa más, incluso una charla breve ayuda.")
    else:
        recomendaciones.append("¡Sigue así! Tus hábitos están contribuyendo positivamente.")

    return recomendaciones

@app.route('/recomendar', methods=['POST'])
def recomendar():
    data = request.get_json()
    registros = data.get("registros")

    if not registros or len(registros) < 5:
        return jsonify({"recomendaciones": []})

    df = pd.DataFrame(registros)

    # Validación básica de columnas esperadas
    columnas_esperadas = ['sueno_horas', 'gimnasio', 'correr', 'comidas',
                          'trabajo_horas', 'escuela_horas', 'meditacion_min',
                          'higiene', 'interaccion_social_min', 'estado_animo']

    if not all(col in df.columns for col in columnas_esperadas):
        return jsonify({"error": "Faltan columnas necesarias"}), 400

    modelo = entrenar_modelo(df)
    if modelo is None:
        return jsonify({"recomendaciones": []})

    ultimo = df.iloc[-1][['sueno_horas', 'gimnasio', 'correr', 'comidas',
                          'trabajo_horas', 'escuela_horas', 'meditacion_min',
                          'higiene', 'interaccion_social_min']].values

    recomendaciones = generar_recomendaciones(modelo, ultimo)
    return jsonify({"recomendaciones": recomendaciones})

if __name__ == '__main__':
    app.run(port=8000)
