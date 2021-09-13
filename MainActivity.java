package com.sribalaji.androidkeylogger;

import android.animation.ArgbEvaluator;
import android.animation.ValueAnimator;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.os.Bundle;
import android.provider.Settings;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.TextView;
import android.webkit.WebView;

import org.eclipse.paho.android.service.MqttAndroidClient;
import org.eclipse.paho.client.mqttv3.IMqttActionListener;
import org.eclipse.paho.client.mqttv3.IMqttDeliveryToken;
import org.eclipse.paho.client.mqttv3.IMqttToken;
import org.eclipse.paho.client.mqttv3.MqttCallback;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.UnsupportedEncodingException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashSet;
import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class MainActivity extends AppCompatActivity {
    ConfigDAO config = null;
    MqttAndroidClient client = null;
    DBHelper db = null;
    String clientId = MqttClient.generateClientId();
    TextView barcode_status, mqtt_status, db_status, server_status, message_status, scanned;
    WebView mobile_logger;
    HashSet uniqueBarCodes = new HashSet<String>();

    View main_view;
    Button settings, reset;
    String diag_status = "Failed";
    public MqttConnectOptions MQTT_CONNECTION_OPTIONS;
    private  String USERNAME,PASSWORD;
    public String diag_sub,diag_pub,thinPCIP,topicHeartBeat,station_id;
    public String station_l1_box = "RESC_HOSR_AB_IAS_ASSY1_BOX";
    public String station_l2_box = "RESC_HOSR_AB_IAS_ASSY2_BOX";
    public String station_l3_box = "RESC_HOSR_AB_IAS_ASSY3_BOX";
    public String station_l4_box = "RESC_HOSR_AB_IAS_ASSY4_BOX";
    public String station_l5_box = "RESC_HOSR_AB_IAS_ASSY5_BOX";
    public String station_vm2_box = "RESC_HOSR_IB_IAS_IAM2_BOX";
    public String station_vl1_box = "RESC_HOSR_IB_IAS_IAL1_BOX";
    public String station_vl4_box = "RESC_HOSR_IB_IAS_IAL4_BOX";
    public String station_vl6_box = "RESC_HOSR_IB_IAS_IAL6_BOX";
    public String station_vl7_box = "RESC_HOSR_IB_IAS_IAL6_BOX";
    public long scannedItems = 0;


    JSONObject publishData=new JSONObject();

    private class MyBrowser extends WebViewClient {
        @Override
        public boolean shouldOverrideUrlLoading(@org.jetbrains.annotations.NotNull WebView view, String url) {
            view.loadUrl(url);
            return true;
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Log.d("MainActivity", "onCreate");
        setContentView(R.layout.activity_main);
        db = new DBHelper(this);

        SharedPreferences prefs = getSharedPreferences("prefs", MODE_PRIVATE);
        boolean firstStart = prefs.getBoolean("firstStart", true);
        if (firstStart) {
            startActivity(new Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS));
            Intent i = new Intent(MainActivity.this, ConfigCreator.class);
            startActivity(i);
            SharedPreferences.Editor editor = prefs.edit();
            editor.putBoolean("firstStart", false);
            editor.apply();
        }
        startService(new Intent(this, Keylogger.class));
        barcode_status = (TextView) findViewById(R.id.barcode);
        mqtt_status = (TextView) findViewById(R.id.mqtt);
        server_status = (TextView) findViewById(R.id.server);
        message_status = (TextView) findViewById(R.id.data);
        db_status = (TextView) findViewById(R.id.db);
        settings = (Button) findViewById(R.id.settings);
        reset = (Button) findViewById((R.id.reset));
        scanned = (TextView) findViewById(R.id.scanned);
        main_view = findViewById((R.id.assembly));
//        mobile_logger = (WebView) findViewById(R.id.mobileLogger);
//        mobile_logger.setWebViewClient(new MyBrowser());
//        mobile_logger.getSettings().setLoadsImagesAutomatically(true);
//        mobile_logger.getSettings().setJavaScriptEnabled(true);
//        mobile_logger.setScrollBarStyle(View.SCROLLBARS_INSIDE_OVERLAY);
//        mobile_logger.loadUrl("https://www.google.com");

        settings.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent myIntent = new Intent(MainActivity.this, ConfigCreator.class);
                startActivity(myIntent);
            }
        });
    }



    @Override
    public void onResume() {
        super.onResume();
        config = db.getAllConfig();
        if (config != null && !config.getConfig().isEmpty()) {
            db_status.setBackgroundColor(Color.GREEN);
            diag_sub = config.getConfig("diag_sub");
            diag_pub = config.getConfig("diag_pub");
            thinPCIP = config.getConfig("thinPCIP");
            station_id = config.getConfig("station_id");
            topicHeartBeat = config.getConfig("topicPlant");
            if (client == null) {
                client = new MqttAndroidClient(this.getApplicationContext(), "tcp://" + config.getConfig("primary") + ":" + config.getConfig("port"), clientId);
            USERNAME = config.getConfig("username");
            PASSWORD = config.getConfig("password");
                MQTT_CONNECTION_OPTIONS = new MqttConnectOptions();
            MQTT_CONNECTION_OPTIONS.setUserName(USERNAME);
            MQTT_CONNECTION_OPTIONS.setPassword(PASSWORD.toCharArray());

                MqttConnect();
            }
        }
        else {
            db_status.setBackgroundColor(Color.RED);
        }
    }


    String barcode = "";

    void MqttConnect() {
        try {
            final IMqttToken token = client.connect(MQTT_CONNECTION_OPTIONS);
            token.setActionCallback(new IMqttActionListener() {
                @Override
                public void onSuccess(IMqttToken asyncActionToken) {
                    // We are connected
                    Log.d("mqtt:", "connected, token:" + asyncActionToken.toString() + client.toString());
                    subscribe(diag_sub, (byte) 2);
                }
                @Override
                public void onFailure(IMqttToken asyncActionToken, Throwable exception) {
                    // Something went wrong e.g. connection timeout or firewall problems
                    Log.d("mqtt:", exception.getLocalizedMessage());
                }
            });
        } catch (MqttException e) {
            e.printStackTrace();
        }
    }

    void subscribe(String topic, byte qos) {
        try {
            final IMqttToken subToken = client.subscribe(topic, qos);
            subToken.setActionCallback(new IMqttActionListener() {
                @Override
                public void onSuccess(IMqttToken asyncActionToken) {
                    Log.d("mqtt:", "subscribed" + asyncActionToken.toString());
                    Log.d("received: ","some message");
                    client.setCallback(new MqttCallback() {
                        @Override
                        public void connectionLost(Throwable cause) {

                        }

                        @Override
                        public void messageArrived(String topic, MqttMessage message) throws Exception {
                            Log.d("arrived ",message.toString());
                            if(topic.equals("HealthStatus/request")){
                                publishData.put("ip",thinPCIP);
                                publishData.put("topic",topicHeartBeat);
                                publish(diag_pub,publishData.toString());
                                Log.d("sent","alive");
                            }
                        }

                        @Override
                        public void deliveryComplete(IMqttDeliveryToken token) {

                        }
                    });

                }
                @Override
                public void onFailure(IMqttToken asyncActionToken,
                                      Throwable exception) {
                    Log.d("mqtt:", "subscribing error" + exception.getLocalizedMessage());
                }
            });
        } catch (MqttException e) {
            e.printStackTrace();
        }
    }

    void publish(String topic, String msg) {
        //0 is the Qos
        MQTT_CONNECTION_OPTIONS.setWill(topic, msg.getBytes(), 2, false);
        try {
            IMqttToken token = client.connect(MQTT_CONNECTION_OPTIONS);
            final String finalPayload = msg;
            final byte[] encodedPayload = finalPayload.getBytes("UTF-8");
            final MqttMessage message = new MqttMessage(encodedPayload);
            token.setActionCallback(new IMqttActionListener() {
                @Override
                public void onSuccess(IMqttToken asyncActionToken) {
                    try {
                        client.publish(diag_pub,message);
                        message.clearPayload();
                    } catch (MqttException e) {
                        e.printStackTrace();
                    }
                    Log.d("mqtt:", "send done" + asyncActionToken.toString());
                }

                @Override
                public void onFailure(IMqttToken asyncActionToken, Throwable exception) {
                    Log.d("mqtt:", "publish error" + asyncActionToken.toString());
                }
            });
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void changeColor(){
        int colorFrom = (Color.GREEN);
        int colorTo = (Color.WHITE);
        ValueAnimator colorAnimation = ValueAnimator.ofObject(new ArgbEvaluator(), colorFrom, colorTo);
        colorAnimation.setDuration(2000); // milliseconds
        colorAnimation.addUpdateListener(new ValueAnimator.AnimatorUpdateListener() {

            @Override
            public void onAnimationUpdate(ValueAnimator animator) {
                main_view.setBackgroundColor((int) animator.getAnimatedValue());
            }

        });
        colorAnimation.start();
    }

    public void resetMessage(View view){
        scannedItems = 0;
        uniqueBarCodes = new HashSet();
        scanned.setText("0 Barcodes Scanned");
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        final char pressedKey = (char) event.getUnicodeChar();
        Log.d("onKeyDown(91) Key Pressed: ", ""+ keyCode + " " + pressedKey);
        //TODO parallel barcode testing
        if (pressedKey != '/' && pressedKey != '(' && pressedKey != '*') {
            barcode += pressedKey;
        }
        else {
            barcode = barcode.replace("\u0000", "") + pressedKey; //Add the key so that we can take the item boutnd between ^ and ( or /  //.replace("^", ""); //
            String pattern = "\\^(.+)(\\(|/|\\*)";
            Pattern r = Pattern.compile(pattern);
            DateFormat df = new SimpleDateFormat("dd-MM-yyyy, HH:mm:ss", Locale.US);
           final String time = df.format(Calendar.getInstance().getTime());
           // time.replace("\\","-");
            final String topic = config.getConfig("topicPlant");
            String payload = null;
            String payload2 = null;
            Log.d("onKeyDown(101) Topic is: ", topic);

            final String[] diag_status = {"Failed"};
            message_status.setBackgroundColor(Color.GREEN);
            mqtt_status.setBackgroundColor(Color.GREEN);
            server_status.setBackgroundColor(Color.GREEN);

            Matcher m = r.matcher(barcode);
            Log.d("onKeyDown(116) BarCode Value Before match", barcode);

            if (m.find( )) {
                String barcode = m.group(1);
                Log.d("onKeyDown(120) BarCode Value", barcode);
                barcode_status.setText(barcode);
                payload = getMQTTMessage(time, barcode, pressedKey);
                payload2 = getMQTTMessageStationId(time, barcode, pressedKey);


            } else {
                message_status.setBackgroundColor(Color.RED);
            }

            try {
                if (payload != null) {
                    if (client != null) {
                        if (!uniqueBarCodes.contains(barcode) ) {
                            uniqueBarCodes.add(barcode);
                            changeColor();
                            scanned.setText(Long.toString(++scannedItems) + " Barcodes Scanned");

                            IMqttToken token = client.connect(MQTT_CONNECTION_OPTIONS);
                            Log.d("Connect Options: ", MQTT_CONNECTION_OPTIONS.toString());
                            final String finalPayload = payload;
                            Log.d("Payload is: ", payload);
                            final byte[] encodedPayload = finalPayload.getBytes("UTF-8");

                            //for another station id
                            final String finalPayload2 = payload2;
                            Log.d("Payload2 is: ", payload2);
                            final byte[] encodedPayload2 = finalPayload2.getBytes("UTF-8");

                            // final MqttMessage message = new MqttMessage(encodedPayload);
                            // Log.d("message is: ", message.toString());
                            token.setActionCallback(new IMqttActionListener() {
                                @Override
                                public void onSuccess(IMqttToken asyncActionToken) {
                                    try {
                                        //                                client.publish(topic, message);
                                        if (station_id.equals("RESC_HOSR_AB_FAS_ASSY1_SCT")) {
                                            client.publish(topic, encodedPayload2, 2, false);
                                            Log.d("station_id inside if", station_l1_box);
                                        } else if (station_id.equals("RESC_HOSR_AB_FAS_ASSY2_SCT")) {
                                            client.publish(topic, encodedPayload2, 2, false);
                                            Log.d("station_id inside if", station_l2_box);
                                        } else if (station_id.equals("RESC_HOSR_AB_FAS_ASSY3_SCT")) {
                                            client.publish(topic, encodedPayload2, 2, false);
                                            Log.d("station_id inside if", station_l3_box);
                                        } else if (station_id.equals("RESC_HOSR_AB_FAS_ASSY4_SCT")) {
                                            client.publish(topic, encodedPayload2, 2, false);
                                            Log.d("station_id inside if", station_l4_box);
                                        } else if (station_id.equals("RESC_HOSR_AB_FAS_ASSY5_SCT")) {
                                            client.publish(topic, encodedPayload2, 2, false);
                                            Log.d("station_id inside if", station_l5_box);
                                        } else if (station_id.equals("RESC_HOSR_IB_MAS_M2_SCT")) {
                                            client.publish(topic, encodedPayload2, 2, false);
                                            Log.d("station_id inside if", station_vm2_box);
                                        } else if (station_id.equals("RESC_HOSR_IB_LAS_L1_SCT")) {
                                            client.publish(topic, encodedPayload2, 2, false);
                                            Log.d("station_id inside if", station_vl1_box);
                                        } else if (station_id.equals("RESC_HOSR_IB_LAS_L4_SCT")) {
                                            client.publish(topic, encodedPayload2, 2, false);
                                            Log.d("station_id inside if", station_vl4_box);
                                        } else if (station_id.equals("RESC_HOSR_IB_LAS_L6_SCT")) {
                                            client.publish(topic, encodedPayload2, 2, false);
                                            Log.d("station_id inside if", station_vl6_box);
                                        } else if (station_id.equals("RESC_HOSR_IB_LAS_L7_SCT")) {
                                            client.publish(topic, encodedPayload2, 2, false);
                                            Log.d("station_id inside if", station_vl7_box);
                                        }
                                        client.publish(topic, encodedPayload, 2, false);
                                        Log.d("station_id outside if", station_id);
                                        //message.clearPayload();
                                        Log.d("onKeyDown(122) Successfully Sent message over mqtt for topic", topic);
                                        diag_status[0] = "Success";
                                        /*
                                         * For Failed messages, try to send them now. Since this message went, best we try others.
                                         */
                                        ArrayList<SensorDAO> sensors = db.getFailedMessages();
                                        Log.d("sensors is: ", String.valueOf(sensors.size()));
                                        if (sensors.size() > 0) {
                                            for (SensorDAO sensor : sensors) {
                                                byte[] encodedPayload = sensor.getMessage().getBytes("UTF-8");
                                                MqttMessage failedMsg = new MqttMessage(encodedPayload);
                                                client.publish(sensor.getTopic(), failedMsg);
                                                failedMsg.clearPayload();
                                            }
                                            db.updateFailedMessages();
                                        }
                                    } catch (MqttException | UnsupportedEncodingException e) {
                                        message_status.setBackgroundColor(Color.RED);
                                        mqtt_status.setBackgroundColor(Color.RED);
                                        e.printStackTrace();
                                    } finally {
                                        db.addSensor(time, topic, finalPayload, diag_status[0]);
                                    }
                                }

                                @Override
                                public void onFailure(IMqttToken asyncActionToken, Throwable exception) {
                                    // Something went wrong e.g. connection timeout or firewall problems
                                    Log.d("AXS", "onFailure");
                                    server_status.setBackgroundColor(Color.RED);
                                }
                            });
                        }
                        else {
                            Log.d("Barcode already exists ", barcode);
                        }
                    } else {
                        Log.d("Empty Client.", "MQTT Not set");
                        mqtt_status.setBackgroundColor(Color.RED);
                    }
                    //client.disconnect();
                } else {
                    Log.d("Payload is null. Bad message", barcode);
                    message_status.setBackgroundColor(Color.RED);
                }

            } catch (MqttException | UnsupportedEncodingException e) {
                mqtt_status.setBackgroundColor(Color.RED);
                e.printStackTrace();
            }
            finally {
                barcode = "";
            }
        }
        return true;
    }
//
    private String getMQTTMessage(String time, String barcode, char scannerType) {

        JSONObject obj = new JSONObject();
        JSONObject obj2 = new JSONObject();
        String out = "";

        try {
            obj.put("TIME_STAMP", time);
            Log.d("time",time);
            if (scannerType == '*') {
                String box_station = "";
                switch(station_id) {
                    case "RESC_HOSR_IB_MAS_M1_SCT":
                        box_station = "RESC_HOSR_IB_IAS_IACOS8_BOX";
                        break;
                    case "RESC_HOSR_IB_MAS_M2_SCT":
                        box_station = "RESC_HOSR_IB_IAS_IAM2_BOX";
                        break;
                }
                obj.put("STATION_ID", box_station);
            }
            else {
                obj.put("STATION_ID", station_id);
            }

            if (scannerType == '/') {
                obj.put("BAR_CODE", barcode);
            } else {
                obj.put("LID_CRATE", barcode);
            }

            out = obj.toString();
        }
        catch (JSONException e) {
            message_status.setBackgroundColor(Color.RED);
            e.printStackTrace();
        }

        Log.d("AXS", out);

        return out;
    }

    private String getMQTTMessageStationId(String time, String barcode, char scannerType) {

        JSONObject obj = new JSONObject();
        String out = "";

        try {
            obj.put("TIME_STAMP", time);
            Log.d("time",time);
            if(station_id.equals("RESC_HOSR_AB_FAS_ASSY1_SCT")){
                obj.put("STATION_ID", station_l1_box);
            }
            else if(station_id.equals("RESC_HOSR_AB_FAS_ASSY2_SCT")){
                obj.put("STATION_ID", station_l2_box);
            }
            else if(station_id.equals("RESC_HOSR_AB_FAS_ASSY3_SCT")){
                obj.put("STATION_ID", station_l3_box);
            }
            else if(station_id.equals("RESC_HOSR_AB_FAS_ASSY4_SCT")){
                obj.put("STATION_ID", station_l4_box);
            }
            else if(station_id.equals("RESC_HOSR_AB_FAS_ASSY5_SCT")){
                obj.put("STATION_ID", station_l5_box);
            }
            else if(station_id.equals("RESC_HOSR_IB_MAS_M2_SCT")){
                obj.put("STATION_ID", station_vm2_box);
            }
            else if(station_id.equals("RESC_HOSR_IB_LAS_L1_SCT")){
                obj.put("STATION_ID", station_vl1_box);
            }
            else if(station_id.equals("RESC_HOSR_IB_LAS_L4_SCT")){
                obj.put("STATION_ID", station_vl4_box);
            }
            else if(station_id.equals("RESC_HOSR_IB_LAS_L6_SCT")){
                obj.put("STATION_ID", station_vl6_box);
            }
            else if(station_id.equals("RESC_HOSR_IB_LAS_L7_SCT")){
                obj.put("STATION_ID", station_vl7_box);
            }

            if (scannerType == '/') {
                obj.put("BAR_CODE", barcode);
            } else {
                obj.put("LID_CRATE", barcode);
            }

            out = obj.toString();
        }
        catch (JSONException e) {
            message_status.setBackgroundColor(Color.RED);
            e.printStackTrace();
        }

        Log.d("AXS", out);

        return out;
    }

}
