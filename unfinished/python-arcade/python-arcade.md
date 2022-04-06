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
Don't Forget To Add SCREEN Properties
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

### 3. Create Draw And Update
Make sure That You Have The Ending Code I Used
```py title="Draw And Update"
    def on_draw(self):
        """Draw"""

        arcade.start_render()

        pass

    def on_update(self, delta_time):
        """Update"""

        pass


if __name__ == "__main__":
    window = Game()
    window.setup()
    arcade.run()


```

### Now You Got Code To Start Coding
If You Want Any Additions Like Keyboard Commands There Is A List Of Them Below:

```py title="Key Press"
def on_key_press(self, key, modifiers):
    """Key Press"""

    pass
```

```py title="Key Release"
def on_key_release(self, key, modifiers):
    """Key Release"""

    pass
```

```py title="Mouse Press"
def on_mouse_press(self, x, y, button, modifiers):
    """Mouse Press"""

    pass
```

```py title="Mouse Release"
def on_mouse_Release(self, x, y, button, modifiers):
    """Mouse Release"""

    pass
```

```py title="Mouse Drag"
def on_mouse_drag(self, x, y, dx, dy, button, modifiers):
    """Mouse Release"""

    pass
```

This Is Not A Complete List Of Additional Commands Made By Arcade.
