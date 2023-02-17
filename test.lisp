;; Please make sure that you use keyword parameters AFTER the required parameter!
;; For example, do (ws 8 :pre "your-pre-command")
;; and NOT: (ws :pre "your-pre-command" 8)

(flow "main"
  ;; zumen waits for all the applications in your config to launch.
  ;; the pre command is run BEFORE and the post command is run AFTER
  ;; all the specified programs on a workspace open up.
  (ws 8 :pre "exec bash -c 'echo doing'" :post "exec bash -c 'echo done'"
    (horizontal '(80 20)
    (vertical '(70 30)
      ;; it is possible to use regexes for both the class and name!
      ;; i3 uses the class to decide what window goes where.
      (exec "kitty" :class "k.*y")
      ;; you can specify either a name or a class, or both
      ;; it's not possible to specify neither
      (exec "firefox" :class "fi.*x" :name "Mozilla Fir.*x"))
      (vertical '(60 40)
         (exec "firefox" :class "firefox")
         (exec "kitty" :class "kitty")))))
