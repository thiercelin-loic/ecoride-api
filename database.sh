database=`cat ./sql/database.sql`
priviles=`cat ./sql/privileges.sql`
tables=`cat ./sql/tables.sql`
users=`cat ./sql/user.sql`
root=`cat ./sql/root.sql`

sudo apt update
sudo apt install mysql-server -y
sudo systemctl enable mysql
sudo systemctl start mysql
sudo mysql_secure_installation --use-default

sudo mysql -u root -e "$root $database $tables $users $priviles"
sudo service mysql restart
