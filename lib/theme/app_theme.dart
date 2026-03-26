import 'package:flutter/material.dart';

class AppTheme {
  // Colors — matching Vonk branding
  static const Color primaryPink = Color(0xFFe94a7a); // Vonk logo pink
  static const Color secondaryOrange = Color(0xFFF8AB21); // Vonk orange
  static const Color tertiaryPink = Color(0xFFe94a7a);
  
  // Light mode
  static const Color lightBg = Color(0xFFffffff);
  static const Color lightBg2 = Color(0xFFececec);
  static const Color lightBg3 = Color(0xFFebebeb);
  static const Color lightCard = Color(0xFFf8f8f8);
  static const Color lightBorder = Color(0xFF2a2a3a);
  static const Color lightText = primaryPink;
  static const Color lightText2 = secondaryOrange;
  static const Color lightText3 = Color(0xFFe94a7a);
  
  // Dark mode
  static const Color darkBg = Color(0xFF0f0f1a);
  static const Color darkBg2 = Color(0xFF191928);
  static const Color darkBg3 = Color(0xFF22223a);
  static const Color darkCard = Color(0xFF1c1c2e);
  static const Color darkBorder = Color(0xFF2e2e48);
  static const Color darkText = Color(0xFFe94a7a);
  static const Color darkText2 = Color(0xFFFFA500);
  static const Color darkText3 = Color(0xFFE8907A);

  static ThemeData get lightTheme => ThemeData(
    useMaterial3: true,
    brightness: Brightness.light,
    scaffoldBackgroundColor: lightBg,
    appBarTheme: const AppBarTheme(
      backgroundColor: lightBg,
      foregroundColor: lightText,
      elevation: 0,
      centerTitle: false,
      titleTextStyle: TextStyle(
        color: lightText,
        fontSize: 24,
        fontWeight: FontWeight.bold,
        fontFamily: 'BebasNeue',
      ),
    ),
    colorScheme: ColorScheme.light(
      primary: primaryPink,
      secondary: secondaryOrange,
      surface: lightCard,
      background: lightBg,
      errorContainer: const Color(0xFFF8AB21),
    ),
    textTheme: const TextTheme(
      headlineLarge: TextStyle(
        color: lightText,
        fontSize: 28,
        fontWeight: FontWeight.w700,
        fontFamily: 'BebasNeue',
      ),
      headlineMedium: TextStyle(
        color: lightText,
        fontSize: 24,
        fontWeight: FontWeight.w700,
        fontFamily: 'BebasNeue',
      ),
      bodyLarge: TextStyle(
        color: lightText,
        fontSize: 16,
        fontFamily: 'Barlow',
      ),
      bodyMedium: TextStyle(
        color: lightText2,
        fontSize: 14,
        fontFamily: 'Barlow',
      ),
      labelMedium: TextStyle(
        color: lightText3,
        fontSize: 12,
        fontWeight: FontWeight.w600,
        fontFamily: 'BarlowCondensed',
      ),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: lightBg2,
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(4),
        borderSide: const BorderSide(color: lightBorder),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(4),
        borderSide: const BorderSide(color: lightBorder),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(4),
        borderSide: const BorderSide(color: primaryPink, width: 2),
      ),
      contentPadding: const EdgeInsets.all(12),
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: secondaryOrange,
        foregroundColor: Colors.white,
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
      ),
    ),
  );

  static ThemeData get darkTheme => ThemeData(
    useMaterial3: true,
    brightness: Brightness.dark,
    scaffoldBackgroundColor: darkBg,
    appBarTheme: const AppBarTheme(
      backgroundColor: darkBg,
      foregroundColor: darkText,
      elevation: 0,
      centerTitle: false,
      titleTextStyle: TextStyle(
        color: darkText,
        fontSize: 24,
        fontWeight: FontWeight.bold,
        fontFamily: 'BebasNeue',
      ),
    ),
    colorScheme: ColorScheme.dark(
      primary: primaryPink,
      secondary: Color(0xFFFFA500),
      surface: darkCard,
      background: darkBg,
      errorContainer: Color(0xFFFFA500),
    ),
    textTheme: const TextTheme(
      headlineLarge: TextStyle(
        color: darkText,
        fontSize: 28,
        fontWeight: FontWeight.w700,
        fontFamily: 'BebasNeue',
      ),
      headlineMedium: TextStyle(
        color: darkText,
        fontSize: 24,
        fontWeight: FontWeight.w700,
        fontFamily: 'BebasNeue',
      ),
      bodyLarge: TextStyle(
        color: darkText,
        fontSize: 16,
        fontFamily: 'Barlow',
      ),
      bodyMedium: TextStyle(
        color: darkText2,
        fontSize: 14,
        fontFamily: 'Barlow',
      ),
      labelMedium: TextStyle(
        color: darkText3,
        fontSize: 12,
        fontWeight: FontWeight.w600,
        fontFamily: 'BarlowCondensed',
      ),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: darkBg2,
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(4),
        borderSide: const BorderSide(color: darkBorder),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(4),
        borderSide: const BorderSide(color: darkBorder),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(4),
        borderSide: const BorderSide(color: primaryPink, width: 2),
      ),
      contentPadding: const EdgeInsets.all(12),
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: Color(0xFFFFA500),
        foregroundColor: Colors.white,
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
      ),
    ),
  );
}
