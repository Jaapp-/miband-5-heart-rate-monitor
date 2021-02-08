// https://github.com/VladKolerts/miband4/blob/master/constants.js
// https://github.com/vshymanskyy/miband-js/blob/master/src/miband.js

const UUID_BASE = (x) => `0000${x}-0000-3512-2118-0009af100700`


export const UUIDS = {
  miband1: '0000fee0-0000-1000-8000-00805f9b34fb',
  miband2: '0000fee1-0000-1000-8000-00805f9b34fb',
  alert: '00001802-0000-1000-8000-00805f9b34fb',
  devinfo: '0000180a-0000-1000-8000-00805f9b34fb',
  heartrate: '0000180d-0000-1000-8000-00805f9b34fb',
  notifications: '00001811-0000-1000-8000-00805f9b34fb',
};

export const CHAR_UUIDS = {
  hz: '00000002-0000-3512-2118-0009af100700',
  sensor: '00000001-0000-3512-2118-0009af100700',
  auth: '00000009-0000-3512-2118-0009af100700',

  alert: '00002a06-0000-1000-8000-00805f9b34fb',
  current_time: '00002a2b-0000-1000-8000-00805f9b34fb',
  // unknown:         '00002a23-0000-1000-8000-00805f9b34fb',
  serial: '00002a25-0000-1000-8000-00805f9b34fb',
  hrdw_revision: '00002a27-0000-1000-8000-00805f9b34fb',
  revision: '00002a28-0000-1000-8000-00805f9b34fb',
  heartrate_measure: '00002a37-0000-1000-8000-00805f9b34fb',
  heartrate_control: '00002a39-0000-1000-8000-00805f9b34fb',
  notifications: '00002a46-0000-1000-8000-00805f9b34fb',
  // unknown:         '00002a50-0000-1000-8000-00805f9b34fb',
  age: '00002a80-0000-1000-8000-00805f9b34fb',
  le_params: '0000ff09-0000-1000-8000-00805f9b34fb',

  configuration: '00000003-0000-3512-2118-0009af100700',
  fetch: '00000004-0000-3512-2118-0009af100700',
  activity_data: '00000005-0000-3512-2118-0009af100700',
  battery: '00000006-0000-3512-2118-0009af100700',
  steps: '00000007-0000-3512-2118-0009af100700',
  user_settings: '00000008-0000-3512-2118-0009af100700',
  music_notification: '00000010-0000-3512-2118-0009af100700',
  deviceevent: '00000010-0000-3512-2118-0009af100700',
  chunked_transfer: '00000020-0000-3512-2118-0009af100700',

};

export const NOTIFICATION_DESCRIPTOR = 0x2902;

export const NOTIFICATION_TYPES = {
  msg: '\x01\x01',
  call: '\x03\x01',
  missed: '\x04\x01',
  sms: '\x05\x01',
}

export const ADVERTISEMENT_SERVICE = 0xFEE0;
