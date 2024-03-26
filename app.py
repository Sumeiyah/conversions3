from flask import Flask, request, jsonify, render_template, send_file
from werkzeug.utils import secure_filename
import os
import mimetypes
from converters import convert_file

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads/'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # Limit file size to 16MB

# Ensure the upload folder exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

@app.route('/')
def welcome():
    return render_template('welcome.html')

@app.route('/home')
def home():
    return render_template('index.html')

@app.route('/convert', methods=['POST'])
def convert_route():
    try:
        if 'file' not in request.files:
            return jsonify(error='No file part'), 400
        file = request.files['file']
        conversion_type = request.form.get('conversion_type')
        if file.filename == '':
            return jsonify(error='No selected file'), 400
        if file:
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            
            # Perform the conversion
            output_filepath, extension = convert_file(conversion_type, filepath)
            if output_filepath and os.path.exists(output_filepath):  # Check if the output file exists
                mimetype = mimetypes.guess_type(output_filepath)[0] or 'application/octet-stream'
                return send_file(output_filepath, mimetype=mimetype, as_attachment=True, download_name=f"{filename}.{extension}")
            else:
                return jsonify(error='Conversion failed or unsupported conversion type'), 500
    except Exception as e:
        app.logger.error(f"Unexpected error during conversion: {e}")
        return jsonify(error='Internal server error'), 500

if __name__ == '_main_':
    app.run(debug=True)
