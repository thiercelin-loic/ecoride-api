USE mysql;
UPDATE USER SET plugin='mysql_native_password' WHERE User='root';
FLUSH PRIVILEGES;
exit;
