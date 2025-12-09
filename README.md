# Smart Farming App 🌾

A comprehensive Flutter-based mobile application designed to empower farmers with modern technology. This app integrates AI, Machine Learning, and Real-time data to assist in sustainable and efficient farming.

![App Banner](assets/images/logo.png)

## 🚀 Key Features

*   **🌱 Disease Detection**: AI-powered plant disease detection using TensorFlow Lite and Gemini AI. Simply take a photo of the affected leaf to get an instant diagnosis and remedy.
*   **🤖 AI Chatbot (Agri-Bot)**: Conversational AI assistant powered by Google Gemini to answer farming queries in multiple languages.
*   **🌦️ Weather Updates**: Real-time weather forecasting to help plan farming activities.
*   **💰 Market Prices**: Live update of crop prices (Mandi rates) across different markets.
*   **🚜 Government Schemes**: Information about various government schemes beneficial for farmers.
*   **🗣️ Multi-language Support**: Full support for English, Hindi, Punjabi, and Tamil. Includes Text-to-Speech (TTS) and Speech-to-Text (STT) for accessibility.
*   **📊 Soil Health Analysis**: Tools to analyze soil health and recommend fertilizers (Integration with NPK sensors/data).

## 📸 Screenshots

| Home & Dashboard | Disease Detection | AI Chatbot |
|:---:|:---:|:---:|
| <img src="assets/screenshots/home.png" width="250" /> | <img src="assets/screenshots/disease.png" width="250" /> | <img src="assets/screenshots/chatbot.png" width="250" /> |

| Market Prices | Weather | Language Selection |
|:---:|:---:|:---:|
| <img src="assets/screenshots/market.png" width="250" /> | <img src="assets/screenshots/weather.png" width="250" /> | <img src="assets/screenshots/language.png" width="250" /> |

> *Note: Please add screenshots to `assets/screenshots/` with the filenames mentioned above.*

## 🛠️ Tech Stack

*   **Framework**: [Flutter](https://flutter.dev/)
*   **Language**: Dart
*   **AI/ML**:
    *   Google Gemini AI (`google_generative_ai`)
    *   TensorFlow Lite (`flutter_tflite`)
*   **Backend & Auth**: Firebase (Auth, Firestore, Realtime Database)
*   **State Management**: Provider
*   **Localization**: `easy_localization`

## 🏁 Getting Started

### Prerequisites

*   Flutter SDK installed
*   Java Development Kit (JDK) 17
*   Android Studio / VS Code
*   API Keys (Gemini, OpenWeather, etc.)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Dhanush-M2005/Smart-Farming-App.git
    cd Smart-Farming-App
    ```

2.  **Install dependencies**
    ```bash
    flutter pub get
    ```

3.  **Setup Environment Variables**
    Create a `.env` file in the root directory and add your API keys:
    ```env
    GEMINI_API_KEY=your_api_key_here
    # Add other keys as needed
    ```

4.  **Run the App**
    ```bash
    flutter run
    ```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
