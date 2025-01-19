## Caption Capturer
The caption Capturer is a Google Chrome extension that records and captures system audio and transcribes it into live captions using the Web Speech API.

![Screenshot 2025-01-18 at 10 35 28 PM](https://github.com/user-attachments/assets/a20fda17-fca1-4da3-bbcf-c78247e48930)

## Features
- Captures and transcribes systems audio into captions in real time.
- Detects whether the active tab's security measures allow for transcription.
- Displays captions as overlay.

## Local Installation (Windows)
1. Clone this repository.
2. On Google Chrome go to chrome://extensions/ .
3. Enable Developer mode in the top right corner.
4. Click Load unpacked and select the directory for the cloned Caption Capturer.
5. The extension should now be visible in your Chrome extension list.
6. Install a Virtual Audio Cable or a virtual machine with audio recording capabilities.
7. Open your computer's control panel.
8. Select Hardware and Sound.
9. Select Sound.
10. Set the Virtual Audio Cable or virtual machine of choice to default in both playback and recording. Screenshot 2025-01-18 110525 Screenshot 2025-01-18 110613
11. 
![404546293-00910dfb-8be6-4f67-981d-47cac959c74f](https://github.com/user-attachments/assets/9ed21c6e-7f86-430c-9301-0929153e5ef8)

![404546337-a1732ac6-24fc-4f13-88da-7c347259642f](https://github.com/user-attachments/assets/5c8a6df2-d2dd-4a1e-95fe-1fdf96aed926)

12. Open Audio Repeater (MME)
13. In the Wave In setting, select the Virtual Audio Cable or choice of virtual machine.
14. In the Wave out setting, select systems speakers or choice audio output. image
![Screenshot 2025-01-18 110838](https://github.com/user-attachments/assets/2991e2a2-7576-4bb3-b16d-978b5aaf7d4f)
15. Press start and enjoy :) If it crashes, retry with Audio Repeater (KS).

## Local Installation (Mac) 
1. Clone this repository.
2. On Google Chrome go to chrome://extensions/ .
3. Enable Developer mode in the top right corner.
4. Click Load unpacked and select the directory for the cloned Caption Capturer.
5. The extension should now be visible in your Chrome extension list.
6. Install your choice of a virtual machine. In our instance, we personally chose to use Blackhole 2ch.
7. Open your computer's Audio Midi Set-Up.
8. Create a Multi-Out device with your Macbook's speakers (or your primary audio output device) being the Primary Device and your downloaded virtual machine as the secondary. This will ensure you are able to hear audio even while using the VM. Ensure to select drift correction for your virtual machine as well.
9. 
<img width="912" alt="404625023-0f36cefd-33d0-4dfd-a023-ad98870a2cdf" src="https://github.com/user-attachments/assets/4c49da14-f6bb-4f77-a75d-70cf63b9e39b" />

<p>9. Go to your device's audio settings and set your newly created Multi-Output device as the audio output and your virtual machine as the input.</p>

<img width="827" alt="404625070-05cca4ef-a2b0-408a-af9f-df34775d75f1" src="https://github.com/user-attachments/assets/140f5449-eea3-42e0-91db-037e7e169fdd" />

<img width="827" alt="404625089-d171dcf1-6e19-4b5e-b57c-fcd3f770ae33" src="https://github.com/user-attachments/assets/9954caf0-424f-4bc4-93c5-3c4b518c03a5" />

<p>10. Press start and have fun :)</p>

## Usage
1. Click on the Caption Captuerer icon from your Chrome toolbar.
2. Select the language you wish to detect and create captions for.
3. Click "Start Captions" to begin the live audio transcription.
4. View Captions as an overlay on the current webpage.
5. Click "Stop Captions" to end the transcription.
