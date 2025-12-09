import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_tflite/flutter_tflite.dart';
import 'package:image_picker/image_picker.dart';
import 'package:google_fonts/google_fonts.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'PLant Disease Detector',
      theme: ThemeData(
        primarySwatch: Colors.green,
        useMaterial3: true,
      ),
      home: const Home(),
    );
  }
}

class Home extends StatefulWidget {
  const Home({super.key});

  @override
  State<Home> createState() => _HomeState();
}

class _HomeState extends State<Home> {
  bool _loading = true;
  File? _image;
  List? _output;
  final _imagePicker = ImagePicker();

  @override
  void initState() {
    super.initState();
    loadModel().then((value) {
      setState(() {});
    });
  }

  @override
  void dispose() {
    Tflite.close();
    super.dispose();
  }

  // 1. Load the TFLite Model
  Future<void> loadModel() async {
    await Tflite.loadModel(
      model: "assets/model.tflite",
      labels: "assets/labels.txt",
      numThreads: 1,
      isAsset: true,
      useGpuDelegate: false,
    );
  }

  // 2. Pick Image (Camera or Gallery)
  Future<void> pickImage(ImageSource source) async {
    var image = await _imagePicker.pickImage(source: source);
    if (image == null) return;

    setState(() {
      _loading = true;
      _image = File(image.path);
    });

    classifyImage(_image!);
  }

  // 3. Run the Logic
  Future<void> classifyImage(File image) async {
    var output = await Tflite.runModelOnImage(
      path: image.path,
      numResults: 2,
      threshold: 0.1,
      imageMean: 127.5,
      imageStd: 127.5,
    );

    setState(() {
      _loading = false;
      _output = output;
    });
  }

  // 4. Helper to get Precautions based on disease name
  // Note: Update these strings to match your labels.txt exactly
  String getPrecaution(String label) {
    String disease = label.toLowerCase();
    if (disease.contains("bacterial spot")) {
      return "Use copper-based fungicides and remove infected leaves.";
    } else if (disease.contains("early blight")) {
      return "Apply mulch, water at base, use fungicides.";
    } else if (disease.contains("healthy")) {
      return "Keep up the good work! Maintain regular watering.";
    } else if (disease.contains("late blight")) {
      return "Remove infected plants immediately. Use fungicides.";
    } else if (disease.contains("leaf mold")) {
      return "Reduce humidity, improve airflow, use fungicides.";
    } else if (disease.contains("septoria")) {
      return "Remove lower leaves, clear debris, apply fungicide.";
    } else if (disease.contains("spider mites")) {
      return "Use insecticidal soap or neem oil.";
    }
    return "Consult an agricultural expert for specific advice.";
  }

  @override
  Widget build(BuildContext context) {
    // UI Structure exactly as per video style
    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Tomato Disease Detector',
          style: GoogleFonts.quicksand(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
        backgroundColor: const Color(0xFF3F7F77),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            const SizedBox(height: 20),
            // Header Text
            Text(
              'Select your option',
              style: GoogleFonts.quicksand(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: const Color(0xFF3F7F77),
              ),
            ),
            const SizedBox(height: 20),

            // Buttons Row
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Camera Button
                GestureDetector(
                  onTap: () => pickImage(ImageSource.camera),
                  child: Container(
                    padding: const EdgeInsets.all(15),
                    decoration: BoxDecoration(
                      color: const Color(0xFF3F7F77),
                      borderRadius: BorderRadius.circular(15),
                    ),
                    child: const Icon(Icons.camera_alt, color: Colors.white, size: 30),
                  ),
                ),
                const SizedBox(width: 30),
                // Gallery Button
                GestureDetector(
                  onTap: () => pickImage(ImageSource.gallery),
                  child: Container(
                    padding: const EdgeInsets.all(15),
                    decoration: BoxDecoration(
                      color: const Color(0xFF3F7F77),
                      borderRadius: BorderRadius.circular(15),
                    ),
                    child: const Icon(Icons.image, color: Colors.white, size: 30),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 30),

            // Main Display Area (Image + Results)
            Container(
              width: MediaQuery.of(context).size.width * 0.9,
              child: Column(
                children: [
                  // Image Container
                  Container(
                    width: double.infinity,
                    height: 300,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(20),
                      color: Colors.grey[200],
                      border: Border.all(color: const Color(0xFF3F7F77), width: 2),
                      image: _image == null
                          ? const DecorationImage(
                        image: AssetImage('assets/upload.png'),
                        scale: 4, // Adjust scale based on your upload.png size
                      )
                          : null,
                    ),
                    child: _image != null
                        ? ClipRRect(
                      borderRadius: BorderRadius.circular(18),
                      child: Image.file(_image!, fit: BoxFit.cover),
                    )
                        : null,
                  ),

                  const SizedBox(height: 20),

                  // Results Section
                  _output != null && !_loading
                      ? Column(
                    children: [
                      // Disease Name
                      Text(
                        "${_output![0]['label']}".replaceAll(RegExp(r'[0-9]'), ''), // Removes index numbers if they exist in label
                        style: GoogleFonts.quicksand(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                          color: Colors.black,
                        ),
                      ),
                      const SizedBox(height: 10),
                      // Accuracy
                      Text(
                        "Confidence: ${(_output![0]['confidence'] * 100).toStringAsFixed(2)}%",
                        style: GoogleFonts.quicksand(
                          fontSize: 18,
                          color: Colors.grey[800],
                        ),
                      ),
                      const SizedBox(height: 20),
                      // Precaution Box
                      Container(
                        padding: const EdgeInsets.all(15),
                        decoration: BoxDecoration(
                          color: Colors.green[50],
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(color: Colors.green),
                        ),
                        child: Column(
                          children: [
                            Text(
                              "Precaution:",
                              style: GoogleFonts.quicksand(
                                fontWeight: FontWeight.bold,
                                fontSize: 16,
                                color: Colors.green[800],
                              ),
                            ),
                            const SizedBox(height: 5),
                            Text(
                              getPrecaution("${_output![0]['label']}"),
                              textAlign: TextAlign.center,
                              style: GoogleFonts.quicksand(
                                fontSize: 15,
                                color: Colors.black87,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  )
                      : Text(
                    _image == null ? "Select an image to start" : "Analyzing...",
                    style: GoogleFonts.quicksand(fontSize: 16, color: Colors.grey),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}