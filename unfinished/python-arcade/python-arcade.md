---
sidebar_position: 1
---

# Python Arcade Basics And Setup:

## How to do Python Arcade Basics
First Start With Importing Python Arcade.

### 1. Create A Class
After You Have Imported Arcade Create A Class By Copying The Following Code
```py title="Class Setup"

# Arcade
import arcade

# The Game Class
class Game(arcade.Window):
    """Game"""

    
```

### 2. Create Init And Setup
```py title="Class Setup"

    SCREEN_WIDTH = 1200
    SCREEN_HEIGHT = 800
    SCREEN_TITLE = "Arcade Window"

    def __init__(self):
        """Init"""

        super().__init__(SCREEN_WIDTH, SCREEN_HEIGHT, SCREEN_TITLE)

        pass

    def setup(self):
        """Setup"""

        arcade.set_background_color(arcade.color.OCEAN_BOAT_BLUE)

        pass

```
