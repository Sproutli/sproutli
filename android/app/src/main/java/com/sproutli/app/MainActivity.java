package com.sproutli.app;

import android.app.Activity;
import android.os.Bundle;
import android.view.KeyEvent;

import com.facebook.react.LifecycleState;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactRootView;
import com.facebook.react.modules.core.DefaultHardwareBackBtnHandler;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import com.oblador.vectoricons.VectorIconsPackage;

import com.github.xinthink.rnmk.ReactMaterialKitPackage;

import com.mapbox.reactnativemapboxgl.ReactNativeMapboxGLPackage;

import io.intercom.android.sdk.Intercom;

import com.ivanph.webintent.RNWebIntentPackage;
import com.syarul.callintent.RNCallIntentPackage;
import com.syarul.mapintent.RNMapIntentPackage;


public class MainActivity extends Activity implements DefaultHardwareBackBtnHandler {

    private ReactInstanceManager mReactInstanceManager;
    private ReactRootView mReactRootView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Intercom.initialize(getApplication(), "android_sdk-aba6524a84e6953392e1a8583c15970a6dbe851c", "r18lw9fx");
        mReactRootView = new ReactRootView(this);

        mReactInstanceManager = ReactInstanceManager.builder()
                .setApplication(getApplication())
                .setBundleAssetName("index.android.bundle")
                .setJSMainModuleName("index.android")
                .addPackage(new MainReactPackage())
                .addPackage(new LocationPackage())
                .addPackage(new IntercomPackage())
                .addPackage(new VectorIconsPackage())
                .addPackage(new ReactMaterialKitPackage())
                .addPackage(new ReactNativeMapboxGLPackage())
                .addPackage(new RNCallIntentPackage())
                .addPackage(new RNWebIntentPackage())
                .addPackage(new RNMapIntentPackage())
                .setInitialLifecycleState(LifecycleState.RESUMED)
                .build();

        mReactRootView.startReactApplication(mReactInstanceManager, "sproutli", null);


        setContentView(mReactRootView);
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
            mReactInstanceManager.onResume(this);
        }
    }
}
