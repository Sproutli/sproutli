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

RCT_EXPORT_METHOD(uploadImage:(nonnull NSString *)path
                        index:(nonnull NSNumber *)index
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  RCTLogInfo(@"Pretending to upload image %@ at index %@", path, index);
  
  AWSS3TransferManager *transferManager = [AWSS3TransferManager defaultS3TransferManager];
  AWSS3TransferManagerUploadRequest *uploadRequest = [AWSS3TransferManagerUploadRequest new];
  
  uploadRequest.bucket = @"sproutli-images";
  uploadRequest.key = @"sajdaksljdalksjdalksjd";
  uploadRequest.body = [[NSURL alloc] initWithString:path];
  
  [[transferManager upload:uploadRequest] continueWithBlock:^id(AWSTask *task) {
    if (task.error) {
      RCTLogWarn(@"[ImageUploader] Failed to upload image %@! Error: %@", path, task.error);
      reject(task.error);
    }
    
    if (task.result) {
      RCTLogInfo(@"[ImageUploader] Succesfully uploaded image %@!", path)
      resolve(nil);
    }
    
    return nil;
  }];
}

@end