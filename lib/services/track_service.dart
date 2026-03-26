import 'package:supabase_flutter/supabase_flutter.dart';

class Track {
  final String id;
  final String name;
  final String location;
  final String layout;
  
  Track({
    required this.id,
    required this.name,
    required this.location,
    required this.layout,
  });
  
  factory Track.fromMap(Map<String, dynamic> map) {
    return Track(
      id: map['id'] as String,
      name: map['name'] as String,
      location: map['location'] as String? ?? '',
      layout: map['layout'] as String? ?? '',
    );
  }
}

class TrackService {
  static final SupabaseClient _client = Supabase.instance.client;
  static final _cache = <Track>[];
  static DateTime? _lastFetch;
  
  static Future<List<Track>> fetchTracks() async {
    try {
      // Return cache if fresh (within 30 seconds)
      if (_cache.isNotEmpty && _lastFetch != null) {
        final diff = DateTime.now().difference(_lastFetch!);
        if (diff.inSeconds < 30) {
          return _cache;
        }
      }
      
      final response = await _client
          .from('tracks')
          .select()
          .timeout(const Duration(seconds: 10));
      
      _cache.clear();
      for (final item in response) {
        _cache.add(Track.fromMap(item));
      }
      _lastFetch = DateTime.now();
      
      return _cache;
    } catch (e) {
      print('Error fetching tracks: $e');
      return _cache; // Return cached data on error
    }
  }
  
  static Future<void> addTrack(String name, String location, String layout) async {
    try {
      await _client.from('tracks').insert({
        'name': name,
        'location': location,
        'layout': layout,
      });
      _cache.clear();
      _lastFetch = null;
      await fetchTracks(); // Refresh cache
    } catch (e) {
      print('Error adding track: $e');
      rethrow;
    }
  }
}
