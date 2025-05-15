from flask import Flask, render_template, request, jsonify
import os
from utils.hashing import hybrid_hash

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/checker')
def checker():
    return render_template('checker.html')

@app.route('/upload', methods=['POST'])
def upload_and_hash():
    file = request.files.get('file')
    algo1 = request.form.get('algorithm1')
    algo2 = request.form.get('algorithm2')
    
    if not file or not algo1 or not algo2:
        return jsonify({"error": "Missing file or algorithms"}), 400
    
    file_bytes = file.read()
    try:
        result_hash = hybrid_hash(file_bytes, algo1, algo2)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    
    return jsonify({
        "filename": file.filename,
        "algorithm1": algo1,
        "algorithm2": algo2,
        "hybrid_hash": result_hash
    })

@app.route('/check', methods=['POST'])
def check_integrity():
    file = request.files.get('file')
    algo1 = request.form.get('algorithm1')
    algo2 = request.form.get('algorithm2')
    original_hash = request.form.get('original_hash')
    
    if not file or not algo1 or not algo2 or not original_hash:
        return jsonify({"error": "Missing data"}), 400
    
    file_bytes = file.read()
    try:
        new_hash = hybrid_hash(file_bytes, algo1, algo2)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    
    match = (new_hash == original_hash)
    
    return jsonify({
        "match": match,
        "recalculated_hash": new_hash
    })

if __name__ == '__main__':
    app.run(debug=True)
