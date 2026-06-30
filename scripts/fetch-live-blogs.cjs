const https = require("https");

https.get("https://konstructz.com/data/blogs.json", (res) => {
  let body = "";
  res.on("data", (chunk) => body += chunk);
  res.on("end", () => {
    try {
      const data = JSON.parse(body);
      console.log("Updated at:", data.updated_at);
      console.log("Posts count:", data.posts ? data.posts.length : "undefined");
      if (data.posts) {
        data.posts.forEach((p, i) => {
          console.log(`[${i}] Title: "${p.title}" | Slug: "${p.slug}" | Status: "${p.status}" | Date: "${p.date}" | PublishedAt: "${p.publishedAt || p.published_at}"`);
        });
      }
    } catch (e) {
      console.error("Failed to parse JSON:", e.message);
      console.log("Body snippet:", body.slice(0, 500));
    }
  });
}).on("error", (e) => {
  console.error("Fetch error:", e.message);
});
