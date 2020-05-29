package com.toolkit.readerapplication;

import android.app.Application;
import android.content.Context;
import android.content.SharedPreferences;
import android.os.Environment;
import android.preference.PreferenceManager;

public class AppController extends Application {

    public static String VG_URL = "";
    public static boolean isReading = false;
    public static boolean IN_PROCESS = true;
    public static String path;
    private static Context context;

    @Override
    public void onCreate() {
        super.onCreate();
        SharedPreferences sharedPreferences = PreferenceManager.getDefaultSharedPreferences
                (getApplicationContext());
        String url = sharedPreferences.getString("VG_URL", "http://172.16.11.13/ValidationGatewayService");
        VG_URL = url.trim();
        IN_PROCESS = sharedPreferences.getBoolean("IN_PROCESS", true);
        Logger.d("VG_URL__" + VG_URL);
        path = Environment.getExternalStorageDirectory().getAbsolutePath() + "/EIDAToolkit/";
        context = this;
    }

    public static Context getContext() {
        return context.getApplicationContext();
    }
}
