(flow "main"
  (ws 8 :pre "exec bash -c 'echo doing'" :post "exec bash -c 'echo done'"
    (horizontal '(80 20)
      (exec "exec firefox" :class "firefox")
      (vertical '(60 40)
         (exec "exec kitty" :class "kitty")
         (exec "exec kitty --class=floater" :class "floater"))))
  (ws 9 :pre "exec bash -c 'echo doing again!'"
    (vertical '(30 70)
      (exec "exec firefox" :class "firefox")
      (exec "exec kitty" :class "kitty"))))
