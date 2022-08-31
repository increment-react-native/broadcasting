import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification from "react-native-push-notification";
import { Platform } from 'react-native';


class  LocalNotificationService{
  configure = (onOpenNotification, channel) => {
    this.createChannel(channel)
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        console.log("[LocalNotificationService] onRegister", token);
      },

      // (required) Called when a remote is received or opened, or local notification is opened
      onNotification: function (notification) {
        // console.log("[LocalNotificationService] onNotification", notification);

        if(!notification?.data){
          return
        }
        notification.userInteraction = true;
        onOpenNotification(Platform.OS === 'ios' ?  notification.data.item : notification.data)

        if(Platform.OS === 'ios'){
          notification.finish(PushNotificationIOS.FetchResult.NoData)
        }
      },

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       * - if you are not using remote notification or do not have Firebase installed, use this:
       *     requestPermissions: Platform.OS === 'ios'
       */
      requestPermissions: true,
    });
  }

  createChannel = (channel) => {
    console.log(`[LocalNotificationService] create channel`)
    PushNotification.createChannel({
        channelId: channel, // (required)
        channelName: channel, // (required)
        channelDescription: channel, // (optional) default: undefined.
        playSound: true, // (optional) default: true
        soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
        importance: 4, // (optional) default: 4. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
      }, created => {
        console.log(`[LocalNotificationService] createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
      });
  }

  setBadge = (number) => {
    if(Platform.OS == 'ios'){
      PushNotificationIOS.setApplicationIconBadgeNumber(number)
    }else{
      PushNotification.setApplicationIconBadgeNumber(number)
    } 
  }

  getBadgeNumber = (callback) => {
    if(Platform.OS == 'ios'){
      PushNotificationIOS.getApplicationIconBadgeNumber(callback)
    }else{
      PushNotification.getApplicationIconBadgeNumber(callback)
    } 
  }

  unRegister = () => {
    PushNotification.unregister();
  }


  showNotification = (id, title, message, data, user) => {

    console.log('[showNotification] data', data.data)
    console.log('[showNotification] user', user)
    if(user == null){
      return
    }
    let options = {
      soundName: 'default',
      playSound: true
    }

    PushNotification.localNotification({
      // Android Only Properties
      ...this.buildAndroidNotification(id, title, message, data, options),
      // iOS and Android Properties
      ...this.buildIOSNotification(id, title, message, data, options),
      // iOS and Android Properties
      title: title || "",
      message: message || "",
      playSound: options.playSound || false,
      soundName: options.soundName || "default",
      userInteraction: false,  // BOOLEAN: If the notification as opened by the usr from the notification
    })
  }

  buildAndroidNotification = (id, title, message, data = {}, options = {}) => {
    return {
      id: id,
      autoCancel: true,
      largeIcon: options.largeIcon || "ic_launcher",
      smallIcon: options.smallIcon || "ic_notification",
      bigText: message || "",
      subText: title || "",
      vibrate: options.vibrate || true,
      vibration: options.vibration || 300,
      priority: options.priority || "high",
      importance: options.importance || "high",
      data: data,
    }
  }

  buildIOSNotification = (id, title, message, data = {}, options = {}) => {
    return{
      alertAction: options.alertAction || 'view',
      category: options.category || "",
      userInfo: {
        id: id,
        item: data
      }
    }
  }

  canceLAllLocalNotification = () => {
    if(Platform.OS == 'ios'){
      PushNotificationIOS.removeAllDeliveredNotifications()
    }else{
      PushNotification.canceLAllLocalNotification()
    }
  }

  removeAllDeliveredNotificationsByID = (notificationId) => {
    console.log("[LocalNotificationService] removeAllDeliveredNotificationsByID", notificationId)
    PushNotification.canceLAllLocalNotification({id: `${notificationId}`})
  }


}

export const localNotificationService = new LocalNotificationService();