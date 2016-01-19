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

github.authenticate({
    type: "oauth",
    key: "e582a76f48a5fcec7bc9",
    secret: "fcc1fa6d9daed8a48150475f851225f3c2287942"
});

var userName = process.argv[2] || "gogoprog";

var wstream = fs.createWriteStream('/dev/ttyACM0');
var currentData = {
    followers: 0,
    userName: userName
};

function getFollowers()
{
    github.user.getFollowers(
        {
            user: userName
        },
        function(err, res)
        {
            if(err)
            {
                console.log(err);
            }

            currentData.followers = res.length;
        }
    );
}

function mainLoop()
{
    var text_content;

    getFollowers();
    //currentData.followers++;

    text_content = JSON.stringify(currentData);
    console.log(text_content);
    wstream.write(text_content + "\n");
    setTimeout(mainLoop, 2000);
}

mainLoop();
