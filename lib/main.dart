import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'config/supabase_config.dart';
import 'routes/app_routes.dart';
import 'theme/app_theme.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize Supabase
  await Supabase.initialize(
    url: supabaseUrl,
    anonKey: supabaseAnonKey,
  );
  
  runApp(const KartPitApp());
}

class KartPitApp extends StatefulWidget {
  const KartPitApp({Key? key}) : super(key: key);

  @override
  State<KartPitApp> createState() => _KartPitAppState();
}

class _KartPitAppState extends State<KartPitApp> {
  late GoRouter _router;
  bool _isDarkMode = false;

  @override
  void initState() {
    super.initState();
    _loadThemePreference();
    _router = AppRoutes.router;
  }

  Future<void> _loadThemePreference() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      _isDarkMode = prefs.getBool('isDarkMode') ?? false;
    });
  }

  void _toggleTheme() {
    setState(() {
      _isDarkMode = !_isDarkMode;
    });
    SharedPreferences.getInstance().then((prefs) {
      prefs.setBool('isDarkMode', _isDarkMode);
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'KartPit — Vonk Racing',
      routerConfig: _router,
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: _isDarkMode ? ThemeMode.dark : ThemeMode.light,
      debugShowCheckedModeBanner: false,
    );
  }
}
