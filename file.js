var client = new Dropbox.Client({
    key: "IimTyINK8SA=|/dH9rrZxDBjFfZTHvks9htkYT+rT8FK3a+xLAysYIQ==", sandbox: false
});

client.authDriver(new Dropbox.Drivers.Redirect({rememberUser: true}));

client.onError.addListener(function(error) {
  if (window.console) {  // Skip the "if" in node.js code.
    console.error(error);
  }
});

client.authenticate(function(error, client) {
	if(error){
		console.log(error.status)
		alert("Authentication failed with error " + error)
	}

});

dump = function(error){
	if (error) {
		console.log("Error "+ error)
	}
	console.log(arguments)
}

function showStat(err, stat, stats){
	
}

function renderContents(contents){
	for (var i = contents.length - 1; i >= 0; i--) {
		document.JSON.stringify(contents)
	};

}


function readDir(dir, callback){
	return client.stat(dir,{ readDir: true}, function(err, stat, contents){
		callback(contents)
	});
}



function renderFile(){

}

