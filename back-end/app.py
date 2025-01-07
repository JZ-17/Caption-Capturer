from flask import Flask, request, jsonify
from flask_cors import CORS
import whisper
import os
import tempfile
import googletrans as translator

# Initialize Flask app
app = Flask(__name__)

# Enable Cross-Origin Resource Sharing (CORS) for the app
CORS(app)

# Load Whisper model
model = whisper.load_model("large")

# Save uploaded audio file to a temporary location and return the path
def save_temp_file(file_obj):
    temp_dir = tempfile.gettempdir()
    temp_path = os.path.join(temp_dir, file_obj.filename)
    file_obj.save(temp_path)
    return temp_path

@app.route("/translate", methods=["POST"])
# Translate the transcribed text to the selected language
def translate():
    try:
        if "audio" not in request.files:
            return jsonify({"error": "No audio file provided"}), 400

        language = request.form.get("language", "en")

        audio_file = request.files["audio"]
        audio_path = save_temp_file(audio_file) # Call the save_temp_file function

        result = model.transcribe(audio_path)
        transcription = result["text"]

        os.remove(audio_path)

        # Translate transcription to the selected language
        translated_text = translator.translate(transcription, dest=language).text

        # Return the translated transcription
        return jsonify({"translation": translated_text})

    except Exception as e:
        print(f"Error during translation: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)