(flow "main"
  (ws 8 :pre "exec 'killall firefox'" :post "exec 'killall chromium'"
    (horizontal '(80 20)
      (exec "Mozilla Firefox" "firefox" "exec firefox")
      (vertical '(60 40)
         (exec "kitty" "kitty" "exec kitty")
         (exec "kitty" "floater" "exec kitty --class=floater"))))
  (ws 9
    (vertical '(10 90)
      (exec "firefox" "Firefox*" "exec firefox")
      (exec "kitty" "Kitty*" "exec kitty"))))
