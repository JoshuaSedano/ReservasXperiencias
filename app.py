from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import datetime

app = Flask(__name__)
CORS(app)  # Permite llamadas desde el frontend

# 🔁 Configura tu conexión (Atlas o local)
client = MongoClient("mongodb://localhost:27017")  # O tu string Atlas
db = client["reservas_db"]
coleccion = db["reservas"]

@app.route("/reservar", methods=["POST"])
def reservar():
    data = request.get_json()

    if not data:
        return jsonify({"error": "No se recibieron datos"}), 400

    # Agrega un timestamp
    data['fecha_creacion'] = datetime.datetime.now()

    # Inserta en MongoDB
    resultado = coleccion.insert_one(data)
    return jsonify({"mensaje": "Reserva guardada", "id": str(resultado.inserted_id)}), 200

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)
