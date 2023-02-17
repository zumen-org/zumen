# Zumen

Zumen is a tool that allows you to specify layouts in percentages using a declarative layout on i3.

## Example 1

```lisp
  (ws 9
    (vertical '(30 70)
      (exec "firefox" :class "firefox")
      (exec "kitty" :class "k.*ty"))))
```

This config will open firefox on 30% of the vertical size of the window and kitty on the remaining 70% of the vertical window on workspace 9!

![image](https://user-images.githubusercontent.com/30829387/219503503-1a9ab804-79f6-47e6-97d8-5eb564f34b9d.png)

## Example 2

```lisp
  (ws 8
    (horizontal '(80 20)
      (vertical '(70 30)
        (exec "kitty" :class "kitty")
        (exec "firefox" :class "fi.*x"))
      (vertical '(60 40)
         (exec "firefox" :class "firefox")
         (exec "kitty" :class "kitty"))))
```

This config opens the following on workspace 8:  
```javascript
* on 80% of the horizontal screen  
---- kitty on 70% of the vertical screen  
---- firefox on 30% of the remaining vertical screen  

* on 20% of the remaining horizontal screen  
---- firefox on 60% of the vertical screen  
---- kitty on 40% of the remaining vertical screen  
```

![image](https://user-images.githubusercontent.com/30829387/219504129-6e0d5ec1-1c85-481e-acaf-489e108defef.png)

Please go through the [example config](https://github.com/zumen-org/zumen/blob/master/test.lisp) for more information.

## Tips
If you don't know what to pass for class/name in the config, you can use the `xprop` tool to help you decide.  
```bash
$ xprop WM_CLASS _NET_WM_NAME # click the target window after executing this
WM_CLASS(STRING) = "openrgb", "openrgb"
_NET_WM_NAME(UTF8_STRING) = "OpenRGB"
```
  
`WM_CLASS` (`openrgb`) is the `class`, and `_NET_WM_NAME` (`OpenRGB`) is the `name`.

## Gotchas
If the `name` you obtained from `xprop` does not work, the application likely changes its name after launching. To get around this, you need to find the name the application uses as soon as it launches.

## Compiling

Zumen is written in Typescript, and can be made into an executable binary using [Deno](https://deno.land).  
You can also use a binary from the [releases](https://github.com/zumen-org/zumen/releases).

```bash
$ git clone https://github.com/zumen-org/zumen
$ cd zumen
$ deno compile --unstable --allow-read --allow-run --allow-write --output zumen
```
