const fetch = require('node-fetch');

exports.handler = async function(event) {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    const { filename, content } = JSON.parse(event.body);
    const repoOwner = "Stark10106";  // Change to your GitHub username
    const repoName = "Jarvis";       // Change to your repo name
    const branch = "main";           // Change if you're using a different branch
    const githubToken = "YOUR_GITHUB_PERSONAL_ACCESS_TOKEN"; // Replace with your token

    const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/content/${filename}`;

    // Get the existing file's SHA hash
    const fileResponse = await fetch(url, {
        headers: { Authorization: `token ${githubToken}` }
    });
    const fileData = await fileResponse.json();
    const sha = fileData.sha;

    // Commit the updated file to GitHub
    const updateResponse = await fetch(url, {
        method: "PUT",
        headers: {
            "Authorization": `token ${githubToken}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: `Updated ${filename}`,
            content: Buffer.from(content).toString("base64"),
            sha
        })
    });

    if (updateResponse.ok) {
        return { statusCode: 200, body: JSON.stringify({ message: "Success" }) };
    } else {
        return { statusCode: 500, body: JSON.stringify({ message: "Failed to update" }) };
    }
};
