"""
ContextGuard Backend - Analytics Module
Track usage statistics for users
"""

from datetime import datetime, timedelta
from typing import Dict, List
import logging

logger = logging.getLogger(__name__)


class AnalyticsTracker:
    """Track user analytics and usage statistics"""
    
    def __init__(self):
        # In production, use Redis or database
        # For now, using in-memory storage
        self.user_stats = {}
    
    def track_action(self, user_id: str, action: str, word_count: int):
        """Track a user action"""
        if user_id not in self.user_stats:
            self.user_stats[user_id] = {
                'actions': [],
                'total_words': 0,
                'total_actions': 0,
                'actions_by_type': {},
                'first_use': datetime.now(),
                'last_use': datetime.now()
            }
        
        stats = self.user_stats[user_id]
        
        # Record action
        stats['actions'].append({
            'type': action,
            'word_count': word_count,
            'timestamp': datetime.now()
        })
        
        # Update totals
        stats['total_words'] += word_count
        stats['total_actions'] += 1
        stats['last_use'] = datetime.now()
        
        # Update action counts
        if action not in stats['actions_by_type']:
            stats['actions_by_type'][action] = 0
        stats['actions_by_type'][action] += 1
    
    def get_user_stats(self, user_id: str) -> Dict:
        """Get statistics for a user"""
        if user_id not in self.user_stats:
            return {
                'total_words': 0,
                'total_actions': 0,
                'time_saved': 0,
                'actions_by_type': {},
                'streak_days': 0,
                'level': 'Beginner'
            }
        
        stats = self.user_stats[user_id]
        
        # Calculate time saved (estimate: 30 seconds per 100 words)
        time_saved_minutes = (stats['total_words'] / 100) * 0.5
        
        # Calculate streak days
        streak_days = self._calculate_streak(stats['actions'])
        
        # Determine user level
        level = self._determine_level(stats['total_actions'])
        
        return {
            'total_words': stats['total_words'],
            'total_actions': stats['total_actions'],
            'time_saved': round(time_saved_minutes, 1),
            'actions_by_type': stats['actions_by_type'],
            'streak_days': streak_days,
            'level': level,
            'first_use': stats['first_use'].strftime('%Y-%m-%d'),
            'last_use': stats['last_use'].strftime('%Y-%m-%d')
        }
    
    def _calculate_streak(self, actions: List[Dict]) -> int:
        """Calculate consecutive days of usage"""
        if not actions:
            return 0
        
        # Get unique dates
        dates = sorted(set(action['timestamp'].date() for action in actions), reverse=True)
        
        if not dates:
            return 0
        
        # Count consecutive days
        streak = 1
        for i in range(len(dates) - 1):
            if (dates[i] - dates[i + 1]).days == 1:
                streak += 1
            else:
                break
        
        return streak
    
    def _determine_level(self, total_actions: int) -> str:
        """Determine user level based on actions"""
        if total_actions < 10:
            return 'Beginner'
        elif total_actions < 50:
            return 'Intermediate'
        elif total_actions < 200:
            return 'Advanced'
        else:
            return 'Expert'
    
    def get_leaderboard(self, limit: int = 10) -> List[Dict]:
        """Get top users by actions"""
        leaderboard = []
        
        for user_id, stats in self.user_stats.items():
            leaderboard.append({
                'user_id': user_id[:8] + '...',  # Anonymize
                'total_actions': stats['total_actions'],
                'total_words': stats['total_words'],
                'level': self._determine_level(stats['total_actions'])
            })
        
        # Sort by total actions
        leaderboard.sort(key=lambda x: x['total_actions'], reverse=True)
        
        return leaderboard[:limit]


# Global instance
analytics_tracker = AnalyticsTracker()
