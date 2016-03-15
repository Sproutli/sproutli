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

public class AnswersReporterModule extends ReactContextBaseJavaModule {
  private static String TAG = "Answers";

  public AnswersReporterModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    Log.d(TAG, "GetName called");
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

    Log.d(TAG, "Reporting SearchEvent: " + searchEvent);
  }

}
