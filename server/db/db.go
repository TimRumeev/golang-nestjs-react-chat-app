package db

import (
	"github.com/jmoiron/sqlx"

	_ "github.com/lib/pq"
)

type Database struct {
	db *sqlx.DB
}

func NewDataBase() (*Database, error) {
	db, err := sqlx.Open("postgres", "postgresql://root:password@localhost:5433/GolangChat?sslmode=disable")
	if err != nil {
		return nil, err
	}

	return &Database{db: db}, nil
}

func (d *Database) Close() {
	if err := d.db.Close(); err != nil {
		return
	}
}

func (d *Database) GetDB() *sqlx.DB {
	return d.db
}
