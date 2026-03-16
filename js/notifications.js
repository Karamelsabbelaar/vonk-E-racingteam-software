/**
 * KartPit Notifications Utility
 * Handle native notifications for pitstop times, race events, etc.
 */

const Notifications = (() => {
  // Check if Capacitor is available
  const isNative = typeof window !== 'undefined' && window.Capacitor;
  
  async function requestPermission() {
    if (!isNative) return;
    
    try {
      const { LocalNotifications } = window.Capacitor.Plugins;
      const result = await LocalNotifications.requestPermissions();
      return result.display === 'granted';
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  async function sendNotification(options) {
    if (!isNative) {
      console.log('Running in web mode - notification not sent:', options);
      return;
    }

    try {
      const { LocalNotifications } = window.Capacitor.Plugins;
      
      const notification = {
        id: Math.floor(Math.random() * 10000),
        title: options.title || 'KartPit',
        body: options.body || '',
        schedule: {
          at: new Date(Date.now() + 1000)
        },
        sound: options.sound !== false ? 'default' : null,
        ...options
      };

      await LocalNotifications.schedule({ notifications: [notification] });
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }

  async function pitstopComplete(time, label = 'Pitstop') {
    const seconds = (time / 1000).toFixed(2);
    await sendNotification({
      title: '✓ Pitstop Complete!',
      body: `${label} - ${seconds}s`,
      sound: true
    });
  }

  async function targetTimeAchieved(time, targetTime) {
    const seconds = (time / 1000).toFixed(2);
    const target = targetTime.toFixed(2);
    await sendNotification({
      title: '🎯 Target Time Achieved!',
      body: `You hit the target! ${seconds}s (target: ${target}s)`,
      sound: true
    });
  }

  async function personalBest(time, label = 'Personal Best') {
    const seconds = (time / 1000).toFixed(2);
    await sendNotification({
      title: '🏆 ' + label,
      body: `New best time: ${seconds}s`,
      sound: true
    });
  }

  async function raceEvent(eventName, details = '') {
    await sendNotification({
      title: '🏁 ' + eventName,
      body: details,
      sound: false
    });
  }

  return {
    requestPermission,
    sendNotification,
    pitstopComplete,
    targetTimeAchieved,
    personalBest,
    raceEvent,
    isNativeApp: () => isNative
  };
})();
