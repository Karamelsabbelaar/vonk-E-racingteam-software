import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

class NavCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final VoidCallback onTap;

  const NavCard({
    Key? key,
    required this.icon,
    required this.title,
    required this.onTap,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;

    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Container(
          decoration: BoxDecoration(
            color: isDarkMode ? AppTheme.darkCard : AppTheme.lightCard,
            border: Border.all(
              color: isDarkMode
                  ? AppTheme.darkBorder
                  : AppTheme.lightBorder,
              width: 1,
            ),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                icon,
                size: 40,
                color: AppTheme.primaryPink,
              ),
              const SizedBox(height: 12),
              Text(
                title,
                textAlign: TextAlign.center,
                style: Theme.of(context).textTheme.labelMedium?.copyWith(
                      fontSize: 13,
                    ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
