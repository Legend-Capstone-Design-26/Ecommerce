-- 로그인용 아이디(username). 기존 DB에 한 번 실행하세요.
ALTER TABLE users ADD COLUMN username VARCHAR(64) NULL;
UPDATE users SET username = CONCAT('user', id) WHERE username IS NULL;
ALTER TABLE users MODIFY username VARCHAR(64) NOT NULL;
CREATE UNIQUE INDEX idx_users_username ON users (username);
