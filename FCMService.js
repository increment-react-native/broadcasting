import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import { Helper } from 'common';

class FCMService{
  register = (onRegister, onNotification, onOpenNotification) => {
    this.checkPermission(onRegister)
    this.createNotificationListeners(onRegister, onNotification, onOpenNotification)
  }

  registerOnOpen = (onRegister, onNotification) => {
    this.checkPermission(onRegister)
    this.messageListener(onRegister, onNotification)
  }

  messageListener = (onRegister, onNotification) => {
    // messaging()
    // .onNotificationOpenedApp(remoteMessage  => {
    //   console.log("[FCMServices] onNotificationOpenedApp Notification caused app to open", remoteMessage)
    //   if(remoteMessage){
    //     const notification = remoteMessage.notification
    //     onOpenNotification(notification)
    //   }
    // })

    // messaging()
    // .getInitialNotification()
    // .then(remoteMessage => {
    //   console.log("[FCMServices] getInitialNotification Notification caused app to open", remoteMessage)
    //   if (remoteMessage) {
    //     const notification = remoteMessage.notification
    //     onOpenNotification(notification)
    //   }
    // });

    this.messageListener = messaging().onMessage(async remoteMessage => {
      console.log("[FCMServices] A new FCM message arrived", remoteMessage)
      if(remoteMessage){
        let notification = null
        if(Platform.OS === 'ios'){
          notification = remoteMessage.data.notification
        }else{
          notification = remoteMessage
        }
        console.log("[FCMServices] onNotification", notification)
        onNotification(notification)
      }
    })

    // messaging().onTokenRefresh(fcmToken => {
    //   console.log("[FCMServices] New token refresh", fcmToken)
    //   onRegister(fcmToken)
    // })
  }

  registerAppWithFCM = async() => {
    if(Platform.OS == 'ios'){
      await messaging().registerDeviceForRemoteMessages();
      await messaging().setAutoInitEnabled(true);
    }
  }

  checkPermission = (onRegister) => {
    messaging().hasPermission()
    .then(enabled => {
      if(enabled){
        this.getToken(onRegister)
      }else{
        this.requestPermission(onRegister)
      }
    }).catch(error => {
      console.log('[FCMServices] Permission regected', error)
    })
  }

  getToken = (onRegister) => {
    messaging().getToken()
    .then(fcmToken => {
      if(fcmToken){
        // messaging()
        // .subscribeToTopic(Helper.APP_NAME_BASIC)
        // .then(() => console.log('[FCMServices] Subscribed to topic ' + Helper.APP_NAME_BASIC));
        onRegister(fcmToken)
      }else{
        console.log("[FCMServices] User does not have a device token")
      }
    }).catch(error => {
      console.log("[FCMServices] getToken regected", error)
    })
  }

  subscribeTopic = (topic) => {
    messaging()
    .subscribeToTopic(Helper.APP_NAME_BASIC + '-' + topic)
    .then(() => console.log('[FCMServices] Subscribed to topic ' + Helper.APP_NAME_BASIC  + '-' + topic));
  }

  unsubscribeTopic = (topic) => {
    messaging()
    .unsubscribeFromTopic(Helper.APP_NAME_BASIC + '-' + topic)
    .then(() => console.log('[FCMServices] Subscribed to topic ' + Helper.APP_NAME_BASIC  + '-' + topic));
  }

  onMessage = (onNotification) => {
    this.messageListener = messaging().onMessage(async remoteMessage => {
      console.log("[FCMServices] A new FCM message arrived", remoteMessage)
      if(remoteMessage){
        let notification = null
        if(Platform.OS === 'ios'){
          notification = remoteMessage.data.notification
        }else{
          notification = remoteMessage
        }
        console.log("[FCMServices] onNotification", notification)
        onNotification(notification)
      }
    })
  }

  requestPermission = (onRegister) => {
    messaging().requestPermission()
    .then(() => {
      this.getToken(onRegister)
    }).catch(error => {
      console.log("[FCMServices] Request Permission rejected", error)
    })
  }

  deleteToken = () => {
    console.log("[FCMServices] deleteToken")
    messaging().deleteToken()
    .catch(error => {
      console.log("[FCMServices] Delete token error", error)
    })
  }

  createNotificationListeners = (onRegister, onNotification, onOpenNotification) => {
    messaging()
    .onNotificationOpenedApp(remoteMessage  => {
      console.log("[FCMServices] onNotificationOpenedApp Notification caused app to open", remoteMessage)
      if(remoteMessage){
        const notification = remoteMessage.notification
        onOpenNotification(notification)
      }
    })

    messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      console.log("[FCMServices] getInitialNotification Notification caused app to open", remoteMessage)
      if (remoteMessage) {
        const notification = remoteMessage.notification
        onOpenNotification(notification)
      }
    });

    this.messageListener = messaging().onMessage(async remoteMessage => {
      console.log("[FCMServices] A new FCM message arrived", remoteMessage)
      if(remoteMessage){
        let notification = null
        if(Platform.OS === 'ios'){
          notification = remoteMessage.data.notification
        }else{
          notification = remoteMessage
        }
        console.log("[FCMServices] onNotification", notification)
        onNotification(notification)
      }
    })

    messaging().onTokenRefresh(fcmToken => {
      console.log("[FCMServices] New token refresh", fcmToken)
      onRegister(fcmToken)
    })
  }

  unRegister = () => {
    this.messageListener()
  }
}

export const fcmService = new FCMService()