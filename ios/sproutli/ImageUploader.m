//
//  ImageUploader.m
//  Sproutli
//
//  Created by Kane Rogers on 25/11/2015.
//  Copyright © 2015 Sproutli. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "ImageUploader.h"
@implementation ImageUploader

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(uploadImage:(NSString* )path index:(NSInteger *)index)
{
  RCTLogInfo(@"Pretending to upload image %@ at %ld", path, index);
}

@end