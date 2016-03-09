//
//  CrashlyticsReporter.m
//  sproutli
//
//  Created by Kane Rogers on 9/03/2016.
//  Copyright © 2016 Sproutli. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "CrashlyticsReporter.h"
#import <Crashlytics/Crashlytics.h>
@implementation CrashlyticsReporter

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(reportError:(nonnull NSString *)message)
{
  NSDictionary *userInfo = @{
                             NSLocalizedDescriptionKey: message
                             };
  
  NSError *error = [NSError errorWithDomain:@"Sproutli" code:-1 userInfo:userInfo];
  [CrashlyticsKit recordError: error];
}

@end