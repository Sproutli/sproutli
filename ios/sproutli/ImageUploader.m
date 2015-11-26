//
//  ImageUploader.m
//  Sproutli
//
//  Created by Kane Rogers on 25/11/2015.
//  Copyright © 2015 Sproutli. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "ImageUploader.h"
#import <AWSS3/AWSS3.h>
@implementation ImageUploader

RCT_EXPORT_MODULE();

- (NSString *)uuidString {
  // Returns a UUID
  
  CFUUIDRef uuid = CFUUIDCreate(kCFAllocatorDefault);
  NSString *uuidString = (__bridge_transfer NSString *)CFUUIDCreateString(kCFAllocatorDefault, uuid);
  CFRelease(uuid);
  
  return uuidString;
}

RCT_EXPORT_METHOD(uploadImage:(nonnull NSString *)path
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  RCTLogInfo(@"[ImageUploader] Uploading image %@)", path);
  
  AWSS3TransferManager *transferManager = [AWSS3TransferManager defaultS3TransferManager];
  AWSS3TransferManagerUploadRequest *uploadRequest = [AWSS3TransferManagerUploadRequest new];
  
  NSString *imageName = [NSString stringWithFormat:@"%@.jpg", [self uuidString]];
  
  uploadRequest.bucket = @"sproutli-images";
  uploadRequest.key = imageName;
  uploadRequest.body = [[NSURL alloc] initWithString:path];
  
  [[transferManager upload:uploadRequest] continueWithBlock:^id(AWSTask *task) {
    if (task.error) {
      RCTLogWarn(@"[ImageUploader] Failed to upload image %@! Error: %@", imageName, task.error);
      reject(task.error);
    }
    
    if (task.result) {
      RCTLogInfo(@"[ImageUploader] Succesfully uploaded image %@!", imageName)
      resolve(imageName);
    }
    
    return nil;
  }];
}



@end