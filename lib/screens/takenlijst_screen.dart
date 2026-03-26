import 'package:flutter/material.dart';

class TakenlijstScreen extends StatefulWidget {
  const TakenlijstScreen({Key? key}) : super(key: key);

  @override
  State<TakenlijstScreen> createState() => _TakenlijstScreenState();
}

class _TakenlijstScreenState extends State<TakenlijstScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Takenlijst'),
      ),
      body: const Center(
        child: Text('Takenlijst screen coming soon'),
      ),
    );
  }
}
