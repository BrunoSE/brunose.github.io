---
layout: default
title: Blog
---

# Blog

{% for post in site.posts %}
  <article>
    <h2><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h2>
    <p>{{ post.date | date: "%B %d, %Y" }}</p>
    {{ post.excerpt }}
  </article>
{% endfor %}
