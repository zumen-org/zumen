(flow "main"
  (ws 8
    (horizontal '(80 20)
      (exec "firefox" "Firefox*")
      (vertical '(60 40)
         (exec "telegram" "Telegram*")
         (exec "urxvt" "Urxvt*"))))
  (ws 9
    (vertical '(10 90)
      (exec "firefox" "Firefox*")
      (exec "kitty" "Kitty*"))))
