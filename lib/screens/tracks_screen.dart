import 'package:flutter/material.dart';
import '../services/track_service.dart';
import '../theme/app_theme.dart';

class TracksScreen extends StatefulWidget {
  const TracksScreen({Key? key}) : super(key: key);

  @override
  State<TracksScreen> createState() => _TracksScreenState();
}

class _TracksScreenState extends State<TracksScreen> {
  late Future<List<Track>> _tracksFuture;

  @override
  void initState() {
    super.initState();
    _tracksFuture = TrackService.fetchTracks();
  }

  @override
  Widget build(BuildContext context) {
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Tracks'),
      ),
      body: FutureBuilder<List<Track>>(
        future: _tracksFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          if (snapshot.hasError) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.error_outline,
                    size: 64,
                    color: AppTheme.primaryPink,
                  ),
                  const SizedBox(height: 16),
                  Text('Error: ${snapshot.error}'),
                ],
              ),
            );
          }

          final tracks = snapshot.data ?? [];

          if (tracks.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.location_off,
                    size: 64,
                    color: AppTheme.primaryPink,
                  ),
                  const SizedBox(height: 16),
                  const Text('No tracks found'),
                ],
              ),
            );
          }

          return ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: tracks.length,
            itemBuilder: (context, index) {
              final track = tracks[index];
              return Card(
                color: isDarkMode ? AppTheme.darkCard : AppTheme.lightCard,
                margin: const EdgeInsets.only(bottom: 12),
                child: ListTile(
                  leading: Icon(
                    Icons.location_on,
                    color: AppTheme.primaryPink,
                  ),
                  title: Text(track.name),
                  subtitle: Text(track.location),
                  trailing: const Icon(Icons.chevron_right),
                  onTap: () {
                    // Navigate to track details
                  },
                ),
              );
            },
          );
        },
      ),
    );
  }
}
