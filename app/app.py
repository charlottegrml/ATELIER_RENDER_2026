import os
import psycopg2
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  
def get_db():
    url = os.getenv("DATABASE_URL")
    return psycopg2.connect(url)


def init_db():
    """Crée la table si elle n'existe pas."""
    try:
        conn = get_db()
        cur = conn.cursor()
        cur.execute("""
            CREATE TABLE IF NOT EXISTS students (
                id    SERIAL PRIMARY KEY,
                name  TEXT NOT NULL,
                email TEXT NOT NULL
            )
        """)
        conn.commit()
        cur.close()
        conn.close()
    except Exception as e:
        print(f"[init_db] Erreur : {e}")


@app.route("/")
def index():
    return {"message": "Hello from Flask on Render!"}


@app.route("/info")
def info():
    return {
        "app": "Flask Render",
        "student": "VOTRE_NOM",
        "version": "v1"
    }


@app.route("/env")
def env():
    return {"env": os.getenv("ENV")}



@app.route("/api/students", methods=["GET"])
def get_students():
    """Retourne tous les étudiants."""
    try:
        conn = get_db()
        cur = conn.cursor()
        cur.execute("SELECT id, name, email FROM students ORDER BY id")
        rows = cur.fetchall()
        cur.close()
        conn.close()
        return jsonify([{"id": r[0], "name": r[1], "email": r[2]} for r in rows])
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/students", methods=["POST"])
def add_student():
    """Ajoute un étudiant."""
    try:
        data = request.get_json()
        name  = data.get("name", "").strip()
        email = data.get("email", "").strip()
        if not name or not email:
            return jsonify({"error": "name et email sont requis"}), 400

        conn = get_db()
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO students (name, email) VALUES (%s, %s) RETURNING id",
            (name, email)
        )
        new_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({"id": new_id, "name": name, "email": email}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/students/<int:student_id>", methods=["DELETE"])
def delete_student(student_id):
    """Supprime un étudiant par ID."""
    try:
        conn = get_db()
        cur = conn.cursor()
        cur.execute("DELETE FROM students WHERE id = %s", (student_id,))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({"deleted": student_id})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/health")
def health():
    return {"status": "ok"}


if __name__ == "__main__":
    init_db()
    app.run(host="0.0.0.0", port=5000, debug=True)
