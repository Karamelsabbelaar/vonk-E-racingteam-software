import 'package:supabase_flutter/supabase_flutter.dart';

class AgendaItem {
  final String id;
  final String title;
  final String? description;
  final DateTime startTime;
  final DateTime? endTime;
  
  AgendaItem({
    required this.id,
    required this.title,
    this.description,
    required this.startTime,
    this.endTime,
  });
  
  factory AgendaItem.fromMap(Map<String, dynamic> map) {
    return AgendaItem(
      id: map['id'] as String,
      title: map['title'] as String,
      description: map['description'] as String?,
      startTime: DateTime.parse(map['start_time'] as String),
      endTime: map['end_time'] != null 
          ? DateTime.parse(map['end_time'] as String)
          : null,
    );
  }
}

class AgendaService {
  static final SupabaseClient _client = Supabase.instance.client;
  static final _cache = <AgendaItem>[];
  static DateTime? _lastFetch;
  
  static Future<List<AgendaItem>> fetchAgenda() async {
    try {
      // Return cache if fresh
      if (_cache.isNotEmpty && _lastFetch != null) {
        final diff = DateTime.now().difference(_lastFetch!);
        if (diff.inSeconds < 30) {
          return _cache;
        }
      }
      
      final response = await _client
          .from('agenda')
          .select()
          .order('start_time')
          .timeout(const Duration(seconds: 10));
      
      _cache.clear();
      for (final item in response) {
        _cache.add(AgendaItem.fromMap(item));
      }
      _lastFetch = DateTime.now();
      
      return _cache;
    } catch (e) {
      print('Error fetching agenda: $e');
      return _cache;
    }
  }
  
  static Future<void> addEvent(String title, DateTime startTime, 
      {String? description, DateTime? endTime}) async {
    try {
      await _client.from('agenda').insert({
        'title': title,
        'description': description,
        'start_time': startTime.toIso8601String(),
        'end_time': endTime?.toIso8601String(),
      });
      _cache.clear();
      _lastFetch = null;
      await fetchAgenda();
    } catch (e) {
      print('Error adding event: $e');
      rethrow;
    }
  }
}
