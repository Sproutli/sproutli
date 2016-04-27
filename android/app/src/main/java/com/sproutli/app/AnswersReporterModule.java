package com.sproutli.app;

import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableType;
import com.facebook.react.bridge.ReadableMapKeySetIterator;

import java.util.HashMap;

import com.crashlytics.android.answers.Answers;
import com.crashlytics.android.answers.SearchEvent;
import com.crashlytics.android.answers.ContentViewEvent;
import com.crashlytics.android.answers.CustomEvent;
import com.crashlytics.android.answers.RatingEvent;

public class AnswersReporterModule extends ReactContextBaseJavaModule {
  private static String TAG = "Answers";

  public AnswersReporterModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return "AnswersReporter";
  }

  @ReactMethod
  public void reportSearch(String query, ReadableMap searchAttributes) {
    SearchEvent searchEvent = new SearchEvent()
        .putQuery(query);


    ReadableMapKeySetIterator iterator = searchAttributes.keySetIterator();
    while (iterator.hasNextKey()) {
      String key = iterator.nextKey();
      ReadableType type = searchAttributes.getType(key);

      switch (type) {
        case Null:
          break;

        case String:
          searchEvent.putCustomAttribute(key, searchAttributes.getString(key));
          break;

        case Number:
          searchEvent.putCustomAttribute(key, searchAttributes.getDouble(key));
          break;

        default:
          break;
      }
    }

    Answers.getInstance().logSearch(searchEvent);
    Log.d(TAG, "Reporting SearchEvent: " + searchEvent);
  }

  @ReactMethod
  public void reportViewListing(String listingID, String listingName, String listingCategory) {
    Log.d(TAG, "Report view listing called");
    Answers.getInstance().logContentView(new ContentViewEvent()
          .putContentName(listingName)
          .putContentType(listingCategory)
          .putContentId(listingID));

    Log.d(TAG, "Reporting viewListing");
  }

  @ReactMethod
  public void reportCreateListing(String listingName, String listingCategory) {
    Answers.getInstance().logCustom(new CustomEvent("Create Listing")
          .putCustomAttribute("Name", listingName)
          .putCustomAttribute("Category", listingCategory));

    Log.d(TAG, "Reporting createListing");
  }

  @ReactMethod
  public void reportReview(String listingId, String listingName, String listingCategory, int rating) {
    Answers.getInstance().logRating(new RatingEvent()
          .putRating(rating)
          .putContentName(listingName)
          .putContentType(listingCategory)
          .putContentId(listingId));

    Log.d(TAG, "Reporting review");
  }

}
