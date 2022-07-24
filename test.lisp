(flow "main"
  (ws 1
    (horizontal '(80 20)
      (exec "firefox" "Firefox*")
      (vertical '(60 40)
         (exec "telegram" "Telegram*")
         (exec "urxvt" "urxvt*")))))
