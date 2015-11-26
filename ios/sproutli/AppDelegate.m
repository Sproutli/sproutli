/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"

#import "RCTRootView.h"
#import "RCTLinkingManager.h"
#import "Intercom/intercom.h"
#import <AWSCore/AWSCore.h>
#import <FBSDKCoreKit/FBSDKCoreKit.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation;

  // Define JS Code Location
  //jsCodeLocation = [NSURL URLWithString:@"http://172.20.10.3:8081/index.ios.bundle?platform=ios&dev=true"];
  jsCodeLocation = [NSURL URLWithString:@"http://192.168.1.112:8081/index.ios.bundle?platform=ios&dev=true"];
  //jsCodeLocation = [NSURL URLWithString:@"http://localhost:8081/index.ios.bundle?platform=ios&dev=true"];
  //jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"sproutli"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  
  // Launch React
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [[UIViewController alloc] init];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
  // Initialize Intercom
  [Intercom setApiKey:@"ios_sdk-0ded67ded471358f3ace64df38a7e82f0906fa65" forAppId:@"r18lw9fx"];
  
  
  // Initialise S3
  AWSCognitoCredentialsProvider *credentialsProvider = [[AWSCognitoCredentialsProvider alloc] initWithRegionType:AWSRegionAPNortheast1
                                                                                                  identityPoolId:@"ap-northeast-1:2d493c6f-6ebf-4397-ab18-4c930ebc2850"];
  AWSServiceConfiguration *configuration = [[AWSServiceConfiguration alloc] initWithRegion:AWSRegionAPSoutheast2
                                                                       credentialsProvider:credentialsProvider];
  AWSServiceManager.defaultServiceManager.defaultServiceConfiguration = configuration;
  
  // Initialise Facebook SDK
  [[FBSDKApplicationDelegate sharedInstance] application:application
                           didFinishLaunchingWithOptions:launchOptions];
  
  return YES;
}

- (void)applicationDidBecomeActive:(UIApplication *)application {
  if ([application respondsToSelector:@selector(registerUserNotificationSettings:)]){ // iOS 8 (User notifications)
    [application registerUserNotificationSettings:
     [UIUserNotificationSettings settingsForTypes:
      (UIUserNotificationTypeBadge |
       UIUserNotificationTypeSound |
       UIUserNotificationTypeAlert)
                                       categories:nil]];
    [application registerForRemoteNotifications];
  } else { // iOS 7 (Remote notifications)
    [application registerForRemoteNotificationTypes:
     (UIRemoteNotificationType)
     (UIRemoteNotificationTypeBadge |
      UIRemoteNotificationTypeSound |
      UIRemoteNotificationTypeAlert)];
  }
  
  [FBSDKAppEvents activateApp];
}

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation {
  return [RCTLinkingManager application:application openURL:url sourceApplication:sourceApplication annotation:annotation];
}

- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
  [Intercom setDeviceToken:deviceToken];
}

@end
