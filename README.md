# firebase

Follow the instructions here: https://rnfirebase.io/


# Requirements
https://github.com/zo0r/react-native-push-notification
https://github.com/react-native-push-notification-ios/push-notification-ios


App/index.js

/**
 * @format
 */
import React from 'react'
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

function HeadlessCheck({ isHeadless }) {
  if (isHeadless) {
    // App has been launched in the background by iOS, ignore
    return null;
  }

  return <App />;
}

AppRegistry.registerComponent(appName, () => HeadlessCheck);



# Usage


import { fcmService } from 'services/FCMService';
import { localNotificationService } from 'services/LocalNotificationService';

// cakk firebaseNotification() on componentDidMount()
firebaseNotification(){
  fcmService.registerAppWithFCM()
  fcmService.register(this.onRegister, this.onNotification, this.onOpenNotification)
  localNotificationService.configure(this.onOpenNotification)
  return () => {
    console.log("[App] unRegister")
    fcmService.unRegister()
    localNotificationService.unRegister()
  }
}

onRegister = (token) => {
  console.log("[App] onRegister", token)
}

onNotification = (notify) => {
  console.log("[App] onNotification", notify)
  const options = {
    soundName: 'default',
    playSound: true
  }

  localNotificationService.showNotification(
    0,
    notify.title,
    notify.body,
    notify,
    options,
    "test"
  )
}

onOpenNotification = (notify) => {
  console.log("[App] onOpenNotification", notify )
}
