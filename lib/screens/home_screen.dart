import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../theme/app_theme.dart';
import '../widgets/app_drawer.dart';
import '../widgets/nav_card.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();

  @override
  Widget build(BuildContext context) {
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      key: _scaffoldKey,
      appBar: AppBar(
        title: const Text('KartPit'),
        leading: IconButton(
          icon: const Icon(Icons.menu),
          onPressed: () => _scaffoldKey.currentState?.openDrawer(),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.settings),
            onPressed: () {
              // Theme toggle could go here
            },
          ),
        ],
      ),
      drawer: const AppDrawer(),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Quick Access section
              Text(
                'Quick Access',
                style: Theme.of(context).textTheme.headlineMedium,
              ),
              const SizedBox(height: 16),

              // Navigation grid
              GridView.count(
                crossAxisCount: 2,
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                mainAxisSpacing: 12,
                crossAxisSpacing: 12,
                children: [
                  NavCard(
                    icon: Icons.location_on,
                    title: 'Tracks',
                    onTap: () => context.go('/tracks'),
                  ),
                  NavCard(
                    icon: Icons.calendar_today,
                    title: 'Agenda',
                    onTap: () => context.go('/agenda'),
                  ),
                  NavCard(
                    icon: Icons.speed,
                    title: 'Rondetijden',
                    onTap: () => context.go('/rondetijd'),
                  ),
                  NavCard(
                    icon: Icons.mechanical_engineering,
                    title: 'Pitstop',
                    onTap: () => context.go('/pitstop'),
                  ),
                  NavCard(
                    icon: Icons.checklist,
                    title: 'Checklist',
                    onTap: () => context.go('/checklist'),
                  ),
                  NavCard(
                    icon: Icons.list,
                    title: 'Takenlijst',
                    onTap: () => context.go('/takenlijst'),
                  ),
                  NavCard(
                    icon: Icons.directions_car,
                    title: 'Rijdag',
                    onTap: () => context.go('/rijdag'),
                  ),
                  NavCard(
                    icon: Icons.help_outline,
                    title: 'Handleiding',
                    onTap: () {
                      // Navigate to handleiding when implemented
                    },
                  ),
                ],
              ),
              const SizedBox(height: 32),

              // Recent activity or other info
              Text(
                'Status',
                style: Theme.of(context).textTheme.headlineSmall,
              ),
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: isDarkMode ? AppTheme.darkCard : AppTheme.lightCard,
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(
                    color: isDarkMode
                        ? AppTheme.darkBorder
                        : AppTheme.lightBorder,
                  ),
                ),
                child: Row(
                  children: [
                    Icon(
                      Icons.cloud_done,
                      color: Colors.green,
                      size: 32,
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Synced',
                            style:
                                Theme.of(context).textTheme.bodyLarge,
                          ),
                          Text(
                            'All data is up to date',
                            style:
                                Theme.of(context).textTheme.bodySmall,
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
