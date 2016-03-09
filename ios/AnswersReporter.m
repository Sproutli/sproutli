//
//  AnswersReporter.m
//  sproutli
//
//  Created by Kane Rogers on 9/03/2016.
//  Copyright © 2016 Sproutli. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "AnswersReporter.h"
#import <Answers/Answers.h>


@implementation AnswersReporter

RCT_EXPORT_MODULE(AnswersReporter)

RCT_EXPORT_METHOD(reportSearch:(nonnull NSString *)query
                  searchAttributes:(nonnull NSDictionary *)searchAttributes)
{
  [Answers logSearchWithQuery:query customAttributes:searchAttributes];
}

@end