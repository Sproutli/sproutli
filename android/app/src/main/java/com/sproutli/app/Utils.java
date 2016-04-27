package com.sproutli.app;

import java.util.HashMap;
import java.util.Map;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableType;
import com.facebook.react.bridge.ReadableMapKeySetIterator;

public class Utils {
  public static Map getMapFromOptions(ReadableMap options) {
    ReadableMapKeySetIterator iterator = options.keySetIterator();
    Map optionsMap = new HashMap<>();
    while (iterator.hasNextKey()) {
      String key = iterator.nextKey();
      ReadableType type = options.getType(key);

      switch (type) {
        case Null:
          break;

        case Boolean:
          Boolean bValue = options.getBoolean(key);
          optionsMap.put(key, bValue);
          break;

        case String:
          String sValue = options.getString(key);
          optionsMap.put(key, sValue);
          break;

        case Number:
          Double dValue = options.getDouble(key);
          optionsMap.put(key, dValue);
          break;

        default:
          break;
      }
    }

    return optionsMap;
  }
}
