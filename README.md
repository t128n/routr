# routr &middot; search engine router

`routr` is a simple and fast search engine router. Using [DuckDuckGo Bangs](https://duckduckgo.com/bangs) syntax, you can search any website directly from within your browser - but completely offline.

## Features
- Fast and lightweight
- Simple and easy to use
- Supports DuckDuckGo Bangs syntax
- Optional AI integration

## Installation

To start using `routr`, you just need to visit [t128n/routr](https://t128n.github.io/routr/) and add it as your default search engine.

## Usage

Now you can search any website directly from your browser. Just type your search query in the address bar and put a "bang" (or route, how we call it) somwhere in the query. For example, to search for "hello world" on the German Wikipedia, you would type:

```
hello !dewiki world
```

After configuring your Gemini API Key, you can make use of the AI query optimization
and transform your query from:

```
article about german war in the stone age !!g
```

to:

```
site:de.wikipedia.org "german" AND "war" AND "stone age" 
```