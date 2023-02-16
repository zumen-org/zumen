;; Please make sure that you use keyword parameters AFTER the required parameter!
;; For example, do (ws 8 :pre "your-pre-command")
;; and NOT: (ws :pre "your-pre-command" 8)
;; Also please don't use any empty lines in this file
(flow "main"
  (ws 8 :pre "exec bash -c 'echo doing'" :post "exec bash -c 'echo done'"
    (horizontal '(80 20)
      (exec "exec firefox" :class "fi.*x" :name "Mozilla Fir.*x")
      (vertical '(60 40)
         (exec "exec kitty" :class "kitty")
         (exec "exec kitty --class=floater" :class "flo.*er"))))
  (ws 9 :pre "exec bash -c 'echo doing again!'"
    (vertical '(30 70)
      (exec "exec firefox" :class "firefox")
      (exec "exec kitty" :class "k.*ty"))))
