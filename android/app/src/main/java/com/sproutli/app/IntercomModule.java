package com.sproutli.app;

import java.util.HashMap;
import java.util.Map;

import android.util.Log;

import io.intercom.android.sdk.Intercom;
import io.intercom.android.sdk.identity.Registration;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableType;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class IntercomModule extends ReactContextBaseJavaModule {
  public IntercomModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return "IntercomWrapper";
  }

  @ReactMethod
  public void registerIdentifiedUser(ReadableMap options, Callback callback) {
    try {
      String userID = options.getString("userId");
      Intercom.client().registerIdentifiedUser(new Registration().withUserId(userID));
      callback.invoke();
    } catch(Exception e) {
      callback.invoke("Error registering user with Intercom: " + e);
    }
  }

  @ReactMethod
  public void updateUser(ReadableMap options, Callback callback) {
    try {
      Log.d("Intercom", "updateUser called with " + options);
      Map userMap = Utils.getMapFromOptions(options);
      Intercom.client().updateUser(userMap);
      callback.invoke();
    } catch(Exception e) {
      callback.invoke("Error registering user with Intercom: " + e);
    }
  }

  @ReactMethod
  public void logEvent(String name, ReadableMap options, Callback callback) {
    try {
      Log.d("Intercom", "logEvent called with " + name);
      Map optionsMap = Utils.getMapFromOptions(options);
      Intercom.client().logEvent(name, optionsMap);
      callback.invoke();
    } catch(Exception e) {
      callback.invoke("Error registering user with Intercom: " + e);
    }
  }

  @ReactMethod
  public void displayMessageComposer(Callback callback) {
    try {
      Intercom.client().displayMessageComposer();
    } catch(Exception e) {
      Log.e("Intercom","Error displaying Intercom composer"); 
    }
  }
}
