var GitHubApi = require("github");
var fs = require('fs');

var github = new GitHubApi({
    version: "3.0.0",
    protocol: "https",
    host: "api.github.com",
    timeout: 5000,
    headers: {
        "user-agent": "mbed-github-notifier"
    }
});

var userName = process.argv[2] || "gogoprog";

var wstream = fs.createWriteStream('/tmp/mytty');
var currentData = {};

function getFollowers()
{
    github.user.getFollowers(
        {
            user: userName
        },
        function(err, res)
        {
            currentData.followers = res.length;
        }
    );
}

function mainLoop()
{
    getFollowers();
    wstream.write(JSON.stringify(currentData) + "\n");
    setTimeout(mainLoop, 2000);
}

mainLoop();
