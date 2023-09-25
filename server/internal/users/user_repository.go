package users

import (
	"context"
	"database/sql"
	"github.com/jmoiron/sqlx"
)

type DBTX interface {
	ExecContext(ctx context.Context, query string, args ...interface{}) (sql.Result, error)
	PrepareContext(context.Context, string) (*sql.Stmt, error)
	QueryContext(context.Context, string, ...interface{}) (*sql.Rows, error)
	QueryRowContext(context.Context, string, ...interface{}) *sql.Row
}

type repository struct {
	db *sqlx.DB
}

func NewRepository(db *sqlx.DB) Repository {
	return &repository{db: db}
}

func (r *repository) CreateUser(ctx context.Context, user *User) (*User, error) {
	var lastInsertId int
	query := "INSERT INTO users(username, password, email) VALUES ($1, $2, $3) returning id"
	err := r.db.QueryRowContext(ctx, query, user.Username, user.Password, user.Email).Scan(&lastInsertId)
	if err != nil {
		return &User{}, err
	}

	user.ID = int64(lastInsertId)

	return user, nil
}

func (r *repository) GetAllUsers(ctx context.Context) ([]User, error) {
	var users []User
	query := "SELECT id, email, username, password FROM users"
	if err := r.db.Select(&users, query); err != nil {
		return users, err
	}
	return users, nil
}

func (r *repository) GetUserByEmail(ctx context.Context, email string) (*User, error) {
	u := User{}
	query := "SELECT id, email, username, password FROM users WHERE email = $1"
	if err := r.db.QueryRowContext(ctx, query, email).Scan(&u.ID, &u.Email, &u.Username, &u.Password); err != nil {
		return &User{}, err
	}

	return &u, nil
}

func (r *repository) GetUserById(ctx context.Context, id int) (*User, error) {
	var user *User
	query := "SELECT id FROM users WHERE id = $1"
	err := r.db.Get(&user, query, id)

	return user, err
}
