-- ────────────────────────────────────────────────────────────────────────────
--  Template blog post (DRAFT)
--
--  Inserts one draft post whose body shows every formatting tool the editor
--  supports: headings, subheadings, paragraphs, bold/italic/underline/strike,
--  bulleted + numbered lists, a quote, a divider, an image, a text link, and a
--  CTA button. Open it in the admin (/sour) to use as a reference, then delete.
--
--  Requires 0001 + 0002 to have been run first (needs the `tags` column).
--  Idempotent: re-running does nothing if the slug already exists.
-- ────────────────────────────────────────────────────────────────────────────

insert into public.blog_posts (
  slug, title, excerpt, content, featured_image, author,
  category_id, status, tags, seo_title, seo_description, keywords
) values (
  'template-post',
  'Template Post — How to Format a Professional Blog',
  'A ready-made example showing every formatting tool in the editor. Open it in the admin to learn the layout, then delete it.',
  $html$
<h2>Welcome to your blog template</h2>
<p>This post is a <strong>ready-made template</strong>. It shows how every block in the editor looks once published, so you can copy the structure for real articles and then <em>delete this one</em>.</p>

<h3>Text styles</h3>
<p>Make text <strong>bold</strong>, <em>italic</em>, <u>underlined</u>, or <s>struck through</s>. Combine them to guide the reader and emphasise what matters.</p>

<h3>Bulleted lists</h3>
<ul>
  <li>Easy to scan key points</li>
  <li>Great for features and specs</li>
  <li>Keep each line short</li>
</ul>

<h3>Numbered lists</h3>
<ol>
  <li>First, pick the machine class</li>
  <li>Then check the attachments you need</li>
  <li>Finally, request a quote</li>
</ol>

<h3>Quote</h3>
<blockquote>Great machines are judged on the job site, not in the showroom.</blockquote>

<hr/>

<h3>Images</h3>
<p>Insert any image by URL using the image button in the toolbar:</p>
<img src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80" alt="Excavator working on a construction site" />

<h3>Links and buttons</h3>
<p>Add an inline <a href="/contact">link to any page</a> inside a sentence, or drop in a strong call-to-action button:</p>
<p><a class="blog-cta" href="/contact">Request a quote</a></p>
<p><br/></p>

<h3>Wrap up</h3>
<p>That covers headings, subheadings, paragraphs, styling, lists, quotes, dividers, images, links and buttons. Replace this content with your own — and delete this template when you no longer need it.</p>
  $html$,
  'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80',
  'Konstructz Editorial',
  (select id from public.blog_categories where slug = 'mini-excavator'),
  'draft',
  array['template', 'guide', 'formatting'],
  'How to Format a Professional Blog Post | Konstructz',
  'A ready-made template showing headings, lists, quotes, images, links and CTA buttons in the Konstructz blog editor.',
  'blog template, formatting, mini excavator, konstructz'
)
on conflict (slug) do nothing;
