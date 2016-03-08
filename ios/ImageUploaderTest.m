//
//  ImageUploaderTest.m
//  Sproutli
//
//  Created by Kane Rogers on 8/03/2016.
//  Copyright © 2016 Sproutli. All rights reserved.
//

#import <XCTest/XCTest.h>
#import "ImageUploader.h"

@interface ImageUploaderTest : XCTestCase

@end

@implementation ImageUploaderTest

- (void)setUp {
  [super setUp];
  // Put setup code here. This method is called before the invocation of each test method in the class.
}

- (void)tearDown {
  // Put teardown code here. This method is called after the invocation of each test method in the class.
  [super tearDown];
}

- (void)testExample {
  ImageUploader *imgUploader = [[ImageUploader alloc] init];
  NSString *uuid = [imgUploader uuidString];
  assert(uuid.length == 36);

}

@end
