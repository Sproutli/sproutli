//
//  AnswersReporter.m
//  sproutli
//
//  Created by Kane Rogers on 9/03/2016.
//  Copyright © 2016 Sproutli. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "AnswersReporter.h"
#import <Crashlytics/Crashlytics.h>


@implementation AnswersReporter

RCT_EXPORT_MODULE(AnswersReporter)

RCT_EXPORT_METHOD(reportSearch:(nonnull NSString *)query
                  searchAttributes:(nonnull NSDictionary *)searchAttributes)
{
  [Answers logSearchWithQuery:query customAttributes:searchAttributes];
}

RCT_EXPORT_METHOD(reportViewListing:(nonnull NSString*)listingId
                  listingName:(nonnull NSString *)listingName
                  listingCategory:(nonnull NSString *)listingCategory)
{
  [Answers logContentViewWithName:listingName contentType:listingCategory contentId:listingId customAttributes:nil];
}

RCT_EXPORT_METHOD(reportCreateListing:(nonnull NSString*)listingName
                  listingCategory:(nonnull NSString *)listingCategory)
{
  NSDictionary *customAttributes = @{
                                     @"Name": listingName,
                                     @"Category": listingCategory
                                     };
  [Answers logCustomEventWithName:@"Create Listing" customAttributes: customAttributes];
}

RCT_EXPORT_METHOD(reportReview:(nonnull NSString*)listingId
                  listingName:(nonnull NSString*) listingName
                  listingCategory:(nonnull NSString*) listingCategory
                  rating:(nonnull NSNumber*) rating)
{
  [Answers logRating:rating contentName:listingName contentType:listingCategory contentId:listingId customAttributes:nil];
}

@end
