const { createClient } = require("@supabase/supabase-js");

const url = "https://hzzcatcehqvpukfxyvuc.supabase.co";
const anon = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6emNhdGNlaHF2cHVrZnh5dnVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzMjc4MTksImV4cCI6MjA5NzkwMzgxOX0.mR9qlSiku6cx2h9M5sILwPZEBGvhCA4N-VHZz56ODS4";

const supabase = createClient(url, anon);

async function checkPosts() {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("id, title, slug, status, published_at, scheduled_at, created_at");
  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Posts count:", data.length);
    console.log(JSON.stringify(data, null, 2));
  }
}

checkPosts();
