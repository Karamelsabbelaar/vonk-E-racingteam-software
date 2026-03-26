# KartPit Flutter Rewrite

This branch (`flutter-rewrite`) contains a complete rewrite of KartPit using Flutter for better native performance on Android devices.

## Why Flutter?

- **Native performance**: Compiles to ARM native code (faster than WebView)
- **Same Supabase backend**: Reuses existing database
- **Offline support**: Built-in local storage
- **Instant UI**: No render lag compared to WebView
- **All devices**: Works on Android 4.1+

## Project Structure

```
lib/
├── main.dart                 # App entry point
├── screens/                  # Page implementations
│   ├── home_screen.dart
│   ├── login_screen.dart
│   ├── tracks_screen.dart
│   ├── agenda_screen.dart
│   ├── pitstop_screen.dart
│   ├── checklist_screen.dart
│   ├── rondetijd_screen.dart
│   ├── takenlijst_screen.dart
│   └── rijdag_screen.dart
├── services/                 # Supabase & data services
│   ├── track_service.dart
│   └── agenda_service.dart
├── theme/
│   └── app_theme.dart        # Vonk branding colors
├── widgets/                  # Reusable components
│   ├── app_drawer.dart
│   └── nav_card.dart
├── routes/
│   └── app_routes.dart       # Navigation setup
└── config/
    └── supabase_config.dart  # Supabase credentials
```

## Setup

1. **Install Flutter** (if not already installed):
   ```bash
   flutter pub get
   ```

2. **Update Supabase credentials** in `lib/config/supabase_config.dart`:
   ```dart
   const String supabaseUrl = 'https://your-project.supabase.co';
   const String supabaseAnonKey = 'your-anon-key';
   ```

3. **Run the app**:
   ```bash
   flutter run
   ```

## Development

### Available Commands

- `flutter run` — Build and run on connected device/emulator
- `flutter build apk` — Build production APK
- `flutter build appbundle` — Build for Google Play Store
- `dart analyze` — Lint and analyze code
- `dart format lib/` — Format code

### Features to Implement

- [x] Login/Authentication
- [x] Home screen with navigation
- [x] Track listing with Supabase integration
- [ ] Agenda scheduling
- [ ] Pitstop timer with lap tracking
- [ ] Checklist manager
- [ ] Rondetijd (lap time) tracking
- [ ] Takenlijst (task list)
- [ ] Rijdag (race day) schedule
- [ ] Offline data sync
- [ ] Dark/light theme toggle
- [ ] Push notifications

### Performance Notes

- **IDB-first pattern**: Tracks, Agenda, etc. use local cache with background sync
- **Reduced animations**: Fast 60fps animations on all devices
- **Lazy loading**: Screens load data only when needed

## Color Scheme

Matches Vonk Racing branding:
- **Primary Pink**: `#e94a7a` (Vonk V logo color)
- **Secondary Orange**: `#F8AB21` (Vonk brand orange)
- **Tertiary Pink**: `#e94a7a` (blend)

Light & dark modes automatically adapt.

## Testing on Your Device

1. Connect Dimensity 9500 phone via USB
2. Run `flutter run` 
3. Open Chrome DevTools for performance profiling: `flutter run -d <device-id>`

## Next Steps

1. **Finish Screen Implementations**: Populate remaining screens with actual functionality
2. **Data Services**: Expand services for Pitstop, Checklist, etc.
3. **Offline Sync**: Implement background data refresh
4. **Polish**: Add transitions, animations, error handling

## Git Workflow

```bash
# On flutter-rewrite branch
git add .
git commit -m "feat: implement tracks page with Supabase"
git push origin flutter-rewrite

# Create PR against main when ready to merge
```

## Performance Targets

- Page load: **< 500ms** (vs 2-3s with current WebView)
- Button response: **instant** (vs 300ms tap delay)
- Scroll FPS: **60fps** (vs 45-50fps on WebView)
- RAM usage: **< 150MB** (vs 200MB+ WebView)

---

**Status**: Work in progress  
**Started**: March 26, 2026  
**Branch**: `flutter-rewrite`
