(flow "main"
  (ws 8
    (horizontal '(80 20)
      (exec "Mozilla Firefox" "firefox")
      (vertical '(60 40)
         (exec "kitty" "kitty")
         (exec "kitty" "floater"))))
  (ws 9
    (vertical '(10 90)
      (exec "firefox" "Firefox*")
      (exec "kitty" "Kitty*"))))
