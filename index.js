var { NativeModules, Platform } = require('react-native');
var FileTransfer = require('react-native-file-transfer-android');
var Sha1 = require('./Sha1');

module.exports = {
	config: function(options) {
		/*
			options = {
				apiSecret,
				apiKey,
				cloudName
			}
		*/
		this.options = options;
	},

	upload: function (uri, successCb, errorCb) {

		var timestamp = Date.now(),
			keys = "timestamp=" + timestamp + this.options.apiSecret,
			signature = Sha1.hash( keys ),
			obj = {
			    uri: uri,
			    uploadUrl: "https://api.cloudinary.com/v1_1/" + this.options.cloudName + "/image/upload",
			    data: {
			    	api_key: this.options.apiKey,
			    	timestamp: timestamp,
						upload_preset: this.options.uploadPreset
			    }
			};
			
		var cb = (err, res) => {
			if (res) successCb(res);
			if (err) errorCb(err);
		};
		
		if (Platform.OS === 'ios') {
			NativeModules.FileTransfer.upload(obj, cb);
		} else { // Android
			FileTransfer.upload(obj, cb);
		}
	}
};
