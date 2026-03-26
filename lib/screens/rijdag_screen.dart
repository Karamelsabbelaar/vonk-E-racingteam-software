import 'package:flutter/material.dart';

class RijdagScreen extends StatefulWidget {
  const RijdagScreen({Key? key}) : super(key: key);

  @override
  State<RijdagScreen> createState() => _RijdagScreenState();
}

class _RijdagScreenState extends State<RijdagScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Rijdag Schema'),
      ),
      body: const Center(
        child: Text('Rijdag screen coming soon'),
      ),
    );
  }
}
