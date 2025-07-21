database=`cat ./database/database.sql`
priviles=`cat ./database/privileges.sql`
tables=`cat ./database/tables.sql`
users=`cat ./database/users.sql`
root=`cat ./database/root.sql`

sudo apt update
sudo apt install mysql-server -y
sudo systemctl enable mysql
sudo systemctl start mysql
sudo mysql_secure_installation --use-default

sudo mysql -u root -e "$root $database $tables $users $priviles"
sudo service mysql restart