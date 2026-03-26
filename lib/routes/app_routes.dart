import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../screens/login_screen.dart';
import '../screens/home_screen.dart';
import '../screens/tracks_screen.dart';
import '../screens/agenda_screen.dart';
import '../screens/pitstop_screen.dart';
import '../screens/checklist_screen.dart';
import '../screens/rondetijd_screen.dart';
import '../screens/takenlijst_screen.dart';
import '../screens/rijdag_screen.dart';

class AppRoutes {
  static final GoRouter router = GoRouter(
    initialLocation: '/login',
    redirect: (context, state) async {
      final session = Supabase.instance.client.auth.currentSession;
      
      if (session == null && state.matchedLocation != '/login') {
        return '/login';
      }
      
      if (session != null && state.matchedLocation == '/login') {
        return '/';
      }
      
      return null;
    },
    routes: [
      GoRoute(
        path: '/login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/',
        builder: (context, state) => const HomeScreen(),
      ),
      GoRoute(
        path: '/tracks',
        builder: (context, state) => const TracksScreen(),
      ),
      GoRoute(
        path: '/agenda',
        builder: (context, state) => const AgendaScreen(),
      ),
      GoRoute(
        path: '/pitstop',
        builder: (context, state) => const PitstopScreen(),
      ),
      GoRoute(
        path: '/checklist',
        builder: (context, state) => const ChecklistScreen(),
      ),
      GoRoute(
        path: '/rondetijd',
        builder: (context, state) => const RondetijdScreen(),
      ),
      GoRoute(
        path: '/takenlijst',
        builder: (context, state) => const TakenlijstScreen(),
      ),
      GoRoute(
        path: '/rijdag',
        builder: (context, state) => const RijdagScreen(),
      ),
    ],
  );
}
