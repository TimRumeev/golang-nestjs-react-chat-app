package main

import (
	"GolangChat/server/db"
	"GolangChat/server/internal/users"
	"GolangChat/server/internal/ws"
	"GolangChat/server/router"
	"log"
)

func main() {
	dbConn, err := db.NewDataBase()
	if err != nil {
		log.Fatalf("could not initialize db connection: %s", err)
	}
	userRep := users.NewRepository(dbConn.GetDB())
	userSrv := users.NewService(userRep)
	userHandler := users.NewHandler(userSrv)

	hub := ws.NewHub()
	wsHandler := ws.NewHandler(hub)
	go hub.Run()

	router.InitRouter(userHandler, wsHandler)
	if err := router.Start("0.0.0.0:8080"); err != nil {
		log.Fatalf("could not initialize user handler: %s", err)
	}
}
