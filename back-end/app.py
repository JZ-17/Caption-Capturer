from flask import Flask, request, jsonify
from flask_cors import CORS
import whisper
import os
import tempfile

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

@app.route("/transcribe", methods=["POST"])
def transcribe():
    """
    Endpoint to transcribe audio using Whisper.
    """
    try:
        # Check if the file is provided
        if "audio" not in request.files:
            return jsonify({"error": "No audio file provided"}), 400

        # Save the uploaded file temporarily
        audio_file = request.files["audio"]
        audio_path = save_temp_file(audio_file)

        # Transcribe audio using Whisper
        result = model.transcribe(audio_path)

        # Remove the temporary file
        os.remove(audio_path)

        # Return the transcription
        return jsonify({"transcription": result["text"]})

    except Exception as e:
        print(f"Error during transcription: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)