var { NativeModules, Platform } = require('react-native');
var FileUploader = require('react-native-file-uploader');
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

	upload: function (image, successCb, errorCb) {

		var timestamp = Date.now(),
			obj = {
			    uri: image.uri,
			    uploadUrl: "https://api.cloudinary.com/v1_1/" + this.options.cloudName + "/image/upload",
			    data: {
			    	api_key: this.options.apiKey,
			    	timestamp: timestamp,
					upload_preset: this.options.uploadPreset
			    }
			};
			
		var cb = (err, res) => {
			if (res) {
				successCb(res);
			}
			if (err) {
				alert('ERROR: '+err);
 				errorCb(err);
			}
		};
		
		if (Platform.OS === 'ios') {
			NativeModules.FileTransfer.upload(obj, (err, res) => {
				if (err) return cb(err);

				cb(null, JSON.parse(res.data));
			});
		} else { // Android
			let req = new XMLHttpRequest();
			let formData = new FormData();

			formData.append('file', {name: 'profile_image', uri: image.uri, type: image.mime});
			formData.append('api_key', obj.data.api_key);
			formData.append('timestamp', obj.data.timestamp);
			formData.append('upload_preset', obj.data.upload_preset);
			formData.append('resource_type', 'image');

			req.addEventListener('load', (response) => {
				if (req.status == 200 && req.status < 300)
					cb(null, JSON.parse(req.responseText));
				else 
					cb(new Error('Unknown Error'));
			})
			req.addEventListener('error', (err) => {
				cb(err);
			})
			req.open('POST', obj.uploadUrl);
			req.send(formData);
		}
	}
};
