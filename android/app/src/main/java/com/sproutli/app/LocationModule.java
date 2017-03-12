package com.sproutli.app;

import java.util.Date;
import java.util.concurrent.CopyOnWriteArrayList;

import android.content.Intent;
import android.content.IntentSender.SendIntentException;
import android.content.SharedPreferences;
import android.location.Location;
import android.os.Bundle;
import android.app.Activity;
import android.util.Log;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.common.api.GoogleApiClient.*;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationListener;
import com.google.android.gms.location.LocationSettingsStates;
import com.google.android.gms.location.LocationSettingsResult;
import com.google.android.gms.location.LocationSettingsStatusCodes;
import com.google.android.gms.location.LocationSettingsRequest;
import com.google.android.gms.common.api.Result;
import com.google.android.gms.common.api.PendingResult;
import com.google.android.gms.common.api.Status;
import com.google.android.gms.common.api.ResultCallback;

public class LocationModule extends ReactContextBaseJavaModule implements ConnectionCallbacks, OnConnectionFailedListener, LocationListener, ResultCallback, ActivityEventListener {
  private static final String TAG = "LocationObserver";
  private static final CopyOnWriteArrayList<RCTLocationRequest> pendingRequests = new CopyOnWriteArrayList<>();
  protected static final int REQUEST_CHECK_SETTINGS = 0x1;

  GoogleApiClient mGoogleApiClient;
  Location mLastLocation;
  LocationRequest mLocationRequest;
  long mLastUpdateTime;
  boolean observingLocation;
  boolean userDeclined;

  public LocationModule(ReactApplicationContext reactContext) {
    super(reactContext);

    // Register for ActivityEvent updates.
    reactContext.addActivityEventListener(this);
  }

  @Override
  public String getName() {
    return "SproutliLocation";
  }

  @ReactMethod
  public void getCurrentPosition(Callback successCallback, Callback failureCallback) {
    if (currentLocationValid()) {
      successCallback.invoke(buildResponse(mLastLocation));
    } else if (userDeclined) {
      failureCallback.invoke("User declined to enable location");
    } else {
      RCTLocationRequest request = new RCTLocationRequest(successCallback, failureCallback);
      pendingRequests.add(request);
    }
  }

  @ReactMethod
  public void startObserving(ReadableMap options) {
    buildGoogleApiClient();
    observingLocation = true;
  }

  @ReactMethod
  public void stopObserving() {
    observingLocation = false;

    if (pendingRequests.size() == 0) {
      stopObservingLocation();
    }
  }

  // LocationServices Lifecycle Methods
  @Override
  public void onLocationChanged(Location currentLocation) {
    Log.d(TAG, "Received location!");
    receivedLocation(currentLocation);
  }

  // GoogleAPIService Lifecycle Methods

  @Override
  public void onConnected(Bundle connectionHint) {
    mLocationRequest = createLocationRequest(null);
    LocationSettingsRequest.Builder builder = new LocationSettingsRequest.Builder()
           .addLocationRequest(mLocationRequest)
           .setAlwaysShow(true);

    PendingResult<LocationSettingsResult> result =
               LocationServices.SettingsApi.checkLocationSettings(mGoogleApiClient, builder.build());

    Log.d(TAG, "Checking for Location Settings");
    result.setResultCallback(this);
  }


  @Override
  public void onConnectionSuspended(int something) {
    Log.d(TAG, "Connection suspended?");
    pendingRequests.clear();
  }

  @Override
  public void onConnectionFailed(ConnectionResult connectionResult) {
    try {
      for (RCTLocationRequest request : pendingRequests) {
        request.failureCallback.invoke("[LocationObserver] - Error connecting to Google Services - " + connectionResult);
        pendingRequests.clear();
      }
    } catch (Exception e) {
      Log.e(TAG, "Unable to invoke failure callbacks - " + pendingRequests, e);
      pendingRequests.clear();
    }
  }

  // LocationSettingsRequest Lifecycle Methods
  @Override
  public void onResult(Result result) {
    Activity currentActivity = getCurrentActivity();

    final Status status = result.getStatus();
    Log.d(TAG, "LocationSettingsStates - " + status);
    switch (status.getStatusCode()) {
      case LocationSettingsStatusCodes.SUCCESS:
        Log.d(TAG, "Success, LocationSettingsStates are fine. Requesting location..");
        LocationServices.FusedLocationApi.requestLocationUpdates(
            mGoogleApiClient, mLocationRequest, this);
        break;
      case LocationSettingsStatusCodes.RESOLUTION_REQUIRED:
        Log.d(TAG, "ResolutionRequired. Prompting user.");
        try {
          status.startResolutionForResult(
            currentActivity,
            REQUEST_CHECK_SETTINGS);
        } catch (SendIntentException e) {
        }
        break;
      case LocationSettingsStatusCodes.SETTINGS_CHANGE_UNAVAILABLE:
        Log.d(TAG, "Settings change unavailable.");
        locationFailed("Settings change unavailable.");
        break;
    }
  }

  @Override
  public void onNewIntent(Intent intent) {
    // DO NOTHING!!
  }

  @Override
  public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
    // Defensive programming.
    if (data == null) {
      return;
    }
    
    final LocationSettingsStates states = LocationSettingsStates.fromIntent(data);
    Log.d(TAG, "onActivityResult returned with " + data);
    switch (requestCode) {
      case REQUEST_CHECK_SETTINGS:
        switch (resultCode) {
          case Activity.RESULT_OK:
            Log.d(TAG, "Hooray, user enabled location!");
            LocationServices.FusedLocationApi.requestLocationUpdates(
                mGoogleApiClient, mLocationRequest, this);
            break;
          case Activity.RESULT_CANCELED:
            Log.d(TAG, "Bad news, user declined to turn on location.");
            locationFailed("User declined to enable location");
            userDeclined = true;
            break;
          default:
            break;
        }
        break;
    }
  }

  protected synchronized void buildGoogleApiClient() {
    if (mGoogleApiClient != null) { return; }

    mGoogleApiClient = new GoogleApiClient.Builder(getReactApplicationContext())
      .addConnectionCallbacks(this)
      .addOnConnectionFailedListener(this)
      .addApi(LocationServices.API)
      .build();

    mGoogleApiClient.connect();
  }

  private WritableMap buildResponse(Location location) {
    WritableMap coords = Arguments.createMap();
    coords.putDouble("latitude", location.getLatitude());
    coords.putDouble("longitude", location.getLongitude());

    WritableMap result = Arguments.createMap();
    result.putMap("coords", coords);

    return result;
  }

  private void sendEvent(String eventName, WritableMap params) {
    getReactApplicationContext()
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
      .emit(eventName, params);
  }

  private void receivedLocation(Location location) {
    mLastLocation = location;
    mLastUpdateTime = System.currentTimeMillis();


    for (RCTLocationRequest request : pendingRequests) {
      WritableMap response = buildResponse(location);
      request.successCallback.invoke(response);
    }

    // WritableMaps may only be dispatched once, so create a new one.
    WritableMap response = buildResponse(location);
    response = buildResponse(location);

    pendingRequests.clear();

    if (observingLocation) {
      sendEvent("geolocationDidChange", response);
    } else {
      stopObservingLocation();
    }
  }

  private LocationRequest createLocationRequest(ReadableMap options) {
    //TODO Support reading from options.
    LocationRequest mLocationRequest = new LocationRequest();
    mLocationRequest.setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY);

    return mLocationRequest;
  }

  private void stopObservingLocation() {
    try {
      LocationServices.FusedLocationApi.removeLocationUpdates(mGoogleApiClient, this);
    } catch (Exception e) {
      Log.e(TAG, "Error in stopObservingLocation: ", e);
    }
  }

  private boolean currentLocationValid() {
    return (mLastLocation != null && 
           ((mLastUpdateTime - System.currentTimeMillis()) < 2000));
  }

  private void locationFailed(String error) {
    for (RCTLocationRequest request : pendingRequests) {
      request.failureCallback.invoke(error);
      pendingRequests.clear();
    }
  }

  @Override
  public boolean canOverrideExistingModule() {
    return true;
  }
}

class RCTLocationRequest {
  public Callback successCallback;
  public Callback failureCallback;

  RCTLocationRequest(Callback aSuccessCallback, Callback aFailureCallback) {
    successCallback = aSuccessCallback;
    failureCallback = aFailureCallback;
  }
}
