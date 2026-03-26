import 'package:flutter/material.dart';

class PitstopScreen extends StatefulWidget {
  const PitstopScreen({Key? key}) : super(key: key);

  @override
  State<PitstopScreen> createState() => _PitstopScreenState();
}

class _PitstopScreenState extends State<PitstopScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Pitstop Timer'),
      ),
      body: const Center(
        child: Text('Pitstop screen coming soon'),
      ),
    );
  }
}
