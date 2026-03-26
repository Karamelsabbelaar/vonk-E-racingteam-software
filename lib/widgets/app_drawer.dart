import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../theme/app_theme.dart';

class AppDrawer extends StatefulWidget {
  const AppDrawer({Key? key}) : super(key: key);

  @override
  State<AppDrawer> createState() => _AppDrawerState();
}

class _AppDrawerState extends State<AppDrawer> {
  late bool _isDarkMode;

  @override
  void initState() {
    super.initState();
    _isDarkMode =
        Theme.of(context).brightness == Brightness.dark;
  }

  @override
  Widget build(BuildContext context) {
    final user = Supabase.instance.client.auth.currentUser;

    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          DrawerHeader(
            decoration: BoxDecoration(
              color: _isDarkMode ? AppTheme.darkCard : AppTheme.lightCard,
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                Text(
                  'KartPit',
                  style: Theme.of(context).textTheme.headlineSmall,
                ),
                const SizedBox(height: 8),
                if (user != null)
                  Text(
                    user.email ?? 'User',
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
              ],
            ),
          ),
          ListTile(
            leading: const Icon(Icons.home),
            title: const Text('Home'),
            onTap: () {
              context.go('/');
              Navigator.pop(context);
            },
          ),
          ListTile(
            leading: const Icon(Icons.location_on),
            title: const Text('Tracks'),
            onTap: () {
              context.go('/tracks');
              Navigator.pop(context);
            },
          ),
          ListTile(
            leading: const Icon(Icons.calendar_today),
            title: const Text('Agenda'),
            onTap: () {
              context.go('/agenda');
              Navigator.pop(context);
            },
          ),
          ListTile(
            leading: const Icon(Icons.speed),
            title: const Text('Rondetijden'),
            onTap: () {
              context.go('/rondetijd');
              Navigator.pop(context);
            },
          ),
          ListTile(
            leading: const Icon(Icons.mechanical_engineering),
            title: const Text('Pitstop'),
            onTap: () {
              context.go('/pitstop');
              Navigator.pop(context);
            },
          ),
          ListTile(
            leading: const Icon(Icons.checklist),
            title: const Text('Checklist'),
            onTap: () {
              context.go('/checklist');
              Navigator.pop(context);
            },
          ),
          ListTile(
            leading: const Icon(Icons.list),
            title: const Text('Takenlijst'),
            onTap: () {
              context.go('/takenlijst');
              Navigator.pop(context);
            },
          ),
          ListTile(
            leading: const Icon(Icons.directions_car),
            title: const Text('Rijdag'),
            onTap: () {
              context.go('/rijdag');
              Navigator.pop(context);
            },
          ),
          const Divider(),
          ListTile(
            leading: const Icon(Icons.brightness_6),
            title: const Text('Dark Mode'),
            trailing: Switch(
              value: _isDarkMode,
              onChanged: (value) {
                setState(() => _isDarkMode = value);
                // TODO: Implement theme toggle with provider
              },
            ),
          ),
          const Divider(),
          ListTile(
            leading: const Icon(Icons.logout),
            title: const Text('Sign Out'),
            onTap: () async {
              await Supabase.instance.client.auth.signOut();
              if (mounted) {
                context.go('/login');
              }
            },
          ),
        ],
      ),
    );
  }
}
