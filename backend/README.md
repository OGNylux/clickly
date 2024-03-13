# How to use:

```shell
go env -w CGO_ENABLED=1 (on Windows)

go run *.go
```

Wenn man es unter Windows startet -> Man ist am Arsch, da cmd *.go nicht rafft. Dafür gibt es dann die .exe
(Auch bei der .exe gilt es zu beachten, sie nicht per Doppelklick zu starten -> kann nicht garantieren, dass es dann funtkioniert.
Ich würde empfehlen sie aus cmd raus zu starten)

Erreichbar unter localhost:8080

Zur Orientierung

1. main.go beeinhaltet das initialisieren der ws-connection und auth -> Somit mittelmäßig relevant
2. websocketHandling beeinhaltet das handling der unterschiedlichen MessageTypes
3. Für Types und json Objekte bitte in types.go schauen
4. generated-requests.http beeinhaltet einen test, den man mit Jet-Brains Produkten ausführen kann