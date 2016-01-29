package com.sproutli.app;

import java.io.IOException;

import android.app.Activity;
import android.content.Intent;
import android.content.Context;
import android.content.SharedPreferences;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.os.AsyncTask;
import android.os.Bundle;
import android.os.Handler;
import android.view.KeyEvent;
import android.util.Log;

import com.crashlytics.android.Crashlytics;

import com.facebook.react.LifecycleState;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactRootView;
import com.facebook.react.modules.core.DefaultHardwareBackBtnHandler;
import com.facebook.react.shell.MainReactPackage;

import com.google.android.gms.common.GooglePlayServicesUtil;
import com.google.android.gms.gcm.GoogleCloudMessaging;
import com.google.android.gms.common.ConnectionResult;

import com.github.xinthink.rnmk.ReactMaterialKitPackage;
import com.oblador.vectoricons.VectorIconsPackage;

import io.fabric.sdk.android.Fabric;
import io.intercom.android.sdk.Intercom;

public class MainActivity extends Activity implements DefaultHardwareBackBtnHandler {
    private ReactInstanceManager mReactInstanceManager;
    private ReactRootView mReactRootView;
    private final String SENDER_ID = "1034144542573";
    private String regId; 
    private GoogleCloudMessaging gcm;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Fabric.with(this, new Crashlytics());
        Intercom.initialize(getApplication(), "android_sdk-aba6524a84e6953392e1a8583c15970a6dbe851c", "r18lw9fx");
        mReactRootView = new ReactRootView(this);
        setUpGCM();

        mReactInstanceManager = ReactInstanceManager.builder()
                .setApplication(getApplication())
                .setBundleAssetName("index.android.bundle")
                .setJSMainModuleName("index.android")
                .addPackage(new MainReactPackage())
//                .addPackage(new LocationPackage(this))
                .addPackage(new IntercomPackage())
                .addPackage(new VectorIconsPackage())
                .addPackage(new ReactMaterialKitPackage())
                .setUseDeveloperSupport(BuildConfig.DEBUG)
                .setInitialLifecycleState(LifecycleState.RESUMED)
                .build();

        mReactRootView.startReactApplication(mReactInstanceManager, "sproutli", null);


        setContentView(mReactRootView);
        Intercom.client().openGCMMessage(getIntent().getData());
    }

    @Override
    public boolean onKeyUp(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_MENU && mReactInstanceManager != null) {
            mReactInstanceManager.showDevOptionsDialog();
            return true;
        }
        return super.onKeyUp(keyCode, event);
    }

    @Override
    public void onBackPressed() {
      if (mReactInstanceManager != null) {
        mReactInstanceManager.onBackPressed();
      } else {
        super.onBackPressed();
      }
    }

    @Override
    public void invokeDefaultOnBackPressed() {
      super.onBackPressed();
    }

    @Override
    protected void onPause() {
        super.onPause();

        if (mReactInstanceManager != null) {
            mReactInstanceManager.onPause();
        }
    }

    @Override
    protected void onResume() {
      super.onResume();

      if (mReactInstanceManager != null) {
          mReactInstanceManager.onResume(this, this);
      }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
      super.onActivityResult(requestCode, resultCode, data);

      if (mReactInstanceManager != null) {
        mReactInstanceManager.onActivityResult(requestCode, resultCode, data);
      }
    }

    private void setUpGCM() {
      if (checkPlayServices()) { 
        gcm = GoogleCloudMessaging.getInstance(this); 
        regId = getRegistrationId(this); 
        if (regId.isEmpty()) { 
          registerInBackground(this); 
        } else { 
          sendRegistrationIdToBackend(regId); 
        } 
      } else {
        Log.i("GCM_ISSUE", "No valid Google Play Services APK found :(");
      }
    }

    private boolean checkPlayServices() {
      return GooglePlayServicesUtil.isGooglePlayServicesAvailable(this) == ConnectionResult.SUCCESS;
    }

    private String getRegistrationId(Context context) {
        SharedPreferences prefs = getSharedPreferences("my_gcm_details", MODE_PRIVATE);
        String registrationId = prefs.getString("my_gcm_registration_id", "");
        if (registrationId.isEmpty()) {
            Log.d("GCM_ISSUE", "Registration ID not found.");
            return "";
        }
        int registeredVersion = prefs.getInt("my_app_version", Integer.MIN_VALUE);
        int currentVersion = getAppVersion(context);
        if (registeredVersion != currentVersion) {
            Log.d("GCM_ISSUE", "App version changed.");
            return "";
        }
        return registrationId;
    }

    private static int getAppVersion(Context context) {
        try {
             PackageInfo packageInfo = context.getPackageManager()
               .getPackageInfo(context.getPackageName(), 0);
             return packageInfo.versionCode;
        } catch (PackageManager.NameNotFoundException e) {
            throw new RuntimeException("Could not get package name: " + e);
        }
    }

    private void sendRegistrationIdToBackend(String regId) {
      Log.d("Intercom", "Configuring GCM with " + regId);
      Intercom.client().setupGCM(regId, R.drawable.icon);
    }

    private void registerInBackground(Context appContext) {
      final Context context = appContext;
      new AsyncTask<Void, Void, Void>() {
        @Override
        protected Void doInBackground(Void... params) {
          int retryTime = 1000;
          int MAX_RETRY = 10;

          try {
            if (gcm == null) {
              gcm = GoogleCloudMessaging.getInstance(context);
            }
            regId = gcm.register(SENDER_ID);
            sendRegistrationIdToBackend(regId);
            storeRegistrationId(context, regId);
            Log.d("GCM_SUCCESS", "Current Device's Registration ID is: " + regId);
          } catch (IOException ex) {
            Log.d("GCM_ISSUE", "Error :" + ex.getMessage());
            //retry the registration after delay
            new Handler().postDelayed(new Runnable() {
              @Override public void run() {
                registerInBackground(context);
              }
            }, retryTime);
            //increase the time of wait period
            if (retryTime < MAX_RETRY) {
              retryTime *=2;
            }
          }
          return null;
        }
      }.execute(null, null, null);
    }

    private void storeRegistrationId(Context context, String regId) {
        SharedPreferences prefs = getSharedPreferences("my_gcm_details", MODE_PRIVATE);
        int appVersion = getAppVersion(context);
        Log.i("GCM_SUCCESS", "Saving regId on app version " + appVersion);
        SharedPreferences.Editor editor = prefs.edit();
        editor.putString("my_gcm_registration_id", regId);
        editor.putInt("my_app_version", appVersion);
        editor.commit();
    }

}
