// used to cache file directory data
var FileSystem = {};

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

function readFile(path, callback){
  client.stat(path,null, function(err,info){
    callback(info);
  })
}

function dennisReadDir(path, callback){
	client.stat(path,{ readDir: true}, function(err, info, contents){
		callback(contents)
	});
}


function readDir(path, callback){
    if(FileSystem[path] === undefined) {
        FileSystem[path] = {};
    }
    if(FileSystem[path]['contents'] === undefined) {
        var currentDir = FileSystem[path];
        client.stat(path,{ readDir: true}, function(err, info, contents){
            currentDir.info = info;
            currentDir.contents = [];
            contents.forEach(function (file) {
                FileSystem[file.path] = file;
                currentDir.contents.push(FileSystem[file.path]);
            });
            if(callback !== undefined) {
            	callback(FileSystem[path].contents);
            }
        });

    }
    else{
        console.log("Reading cached contents");
        if(callback !== undefined ) {
        	callback(FileSystem[path].contents);
    	}
    }
}