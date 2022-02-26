---
sidebar_position: 2
---
# Tutorial - Markdown Basics
Learn some basic markdown tricks to make your documentation fly! As a game developer, you will need to learn
to write some basic documentation.

Nowadays, using markdown is very convenient and it can result in beautiful tech documentation for everyone
around the world.

The following a list of basic markdown syntax you probably should know 😈

### Headings
```md
#### HEADING 4
##### HEADING 5
```
#### HEADING 4
##### HEADING 5

### Lists
Unordered list
```md
- item 1
- item 2
```
- item 1
- item 2

Ordered list
```md
1. item 1
2. item 2
```
1. item 1
2. item 2

### Links
Use the following to add links
```md
Click [Link Text](https://imini.app) to visit imini
```
Click [Link Text](https://imini.app) to visit imini


### Images
Use the following to add images
Just Do This:
```md
![Some Fat Dinosaur](/img/docusaurus.png)
```
![Some Fat Dinosaur](/img/docusaurus.png)

### Code blocks
You can use the following to add code blocks. And it can be highlighted for different types

#### javascript

    ```js
    const abc
    ```

Result:
```js
const abc
```

#### Python

    ```python
    a = 10
    b = 10
    if a > b:
      print('good')
    ```

Result:
```python
a = 10
b = 10
if a > b:
  print('good')
```

### MDX
You can use javascript directly inside the MD. Like the example below
```js
<button onClick={() => alert('Docusarus incoming, run away! Oh no He Got You!')}>Click me!</button>
```
<button onClick={() => alert('Docusarus incoming, run away! Oh no He Got You!')}>Click me!</button>


### Tip/Warning
You can use the following to add a tip
```md
:::tip TIP!!!
A Useful Tip 🚗
:::
```

:::tip TIP!!!
A Useful Tip 🚗
:::

You can use the following to add a warning

    :::danger WARNING🦴
    Warning stuffs go here
    :::

:::danger WARNING🦴
Warning stuffs go here
:::