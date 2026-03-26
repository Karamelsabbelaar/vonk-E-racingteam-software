import 'package:flutter/material.dart';

class RondetijdScreen extends StatefulWidget {
  const RondetijdScreen({Key? key}) : super(key: key);

  @override
  State<RondetijdScreen> createState() => _RondetijdScreenState();
}

class _RondetijdScreenState extends State<RondetijdScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Rondetijden'),
      ),
      body: const Center(
        child: Text('Rondetijden screen coming soon'),
      ),
    );
  }
}
