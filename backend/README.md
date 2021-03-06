# Distributed Sharit
Website not running because I was dropping $100 per month on this project.

Website updated over the semester.

* Google drive Link
 * https://drive.google.com/open?id=0B8SEHfpAjaYCYXlfWkdCUWZxZGc
 
![distributed_web_app_alpha](https://github.com/WarlonZeng/Distributed-Sharit/blob/master/distributed_web_app_alpha.png)

## Overview
Distributed Sharit follows a new roadmap architecture to provide high availability (no single point of failure) in the distributed system. Sharit is a website developed to share information between users of established organizations. Main features supported are file sharing with threads, comments for users to communicate with one another.

## Technologies Involved
* Nginx
* HTML5
* CSS3
* NodeJS
* Redis
* MySQL + MySQL replication + MySQL auto-failover

## Techniques/Concepts involved
* Horizontal replication of database (peer-to-peer selection factor)
* Replication of frontend and backend (API) servers
* Configuring open source technologies
* Orchestrating componenets and connectors
* Designing software system architecture

## Usage
User will sign in (sign up if haven't done so), look for a thread, and comment on a thread. Users could also create a thread and upvote or downvote other user's comments. 
Files will be shared through threads.

## How to Install and Run
### Installing NodeJS
On Ubuntu 16.04 LTS, download NodeJS and npm. Commands to do so:
```git
sudo apt-get update
sudo apt-get install nodejs
sudo apt-get install npm
```

To update node:
```git
sudo npm cache clean -f
sudo npm install -g n
sudo n stable
sudo n latest
```

### Nginx Configuration:
To install nginx:
```git
sudo apt-get update
sudo apt-get install nginx
sudo ufw allow 'Nginx HTTP'
```
To update nginx (using our nginx.conf file):
```git
cd /etc/nginx
sudo vi nginx.conf \\ manually
```
or:
```git
sudo cp -f /home/ubuntu/GitHub/Sharit/nginx/nginx.conf /etc/nginx
```
To check run/restart/status/stop nginx:
```git
sudo service start nginx
sudo service restart nginx
sudo service stop nginx
sudo service status nginx
```
To check for debug errors running nginx server (due to misconfiguration):
```git
sudo nginx -t -c /etc/nginx/nginx.conf
```

### Running NodeJS and PM2
Browse to /Sharit/src and get all npm dependencies:
```git
sudo npm install
```
Run the server directly by the following command:
```git
node bin/www
```
The server can be automatically restarted upon crash with a production manager module, pm2. Install pm2 by:
```git
sudo npm install pm2 -g
```
And run with:
```git
pm2 start ./bin/www
```
To kill process:
```git
pm2 stop www
```
To delete process from PM2:
```git
pm2 delete www
```

### Update modules
```git
sudo npm install -g npm-check-updates
sudo ncu -u
sudo npm install -g express@latest
```

### MySQL Master-Slave replication:
Edit configuration files
```git
sudo vi /etc/mysql/mysqld.conf.d/mysqld.cnf

server-id               = 1/2/3
log_bin                 = /var/log/mysql/mysql-bin.log
expire_logs_days        = 10
max_binlog_size         = 100M

bind-address            = 172.31.63.231/172.31.52.138/172.31.52.220
```
```git
GRANT REPLICATION SLAVE ON *.* TO 'slave_user'@'%' IDENTIFIED BY 'slave_password';

(create database, table, and insert some data)

mysqldump -uroot --all-databases -p --master-data > sharit.sql
```
```git
change master to master_host='172.31.63.231', master_user='slave_user', master_password='slave_password';
show slave status\G;
mysql -u root -p sharit < sharit.sql // remember to drop if it already exists
show slave status\G;
```

```git
start slave;
stop slave;
show master status; // show current machine mysql server's binary log position
show slave status\G; // check if slave read up to master
show slave hosts; // check slave followers to host
```


### Git Protocols:
To replace all your local files (including edits) with remote repo:
```git
git fetch origin
git reset --hard origin/master
git clean -f -d
```
To get the latest code updates:
```git
git pull
```
To push all your local files (if merge conflict commit first then pull and push):
```git
git add .
git commit -a
git push origin master
```
To replace all the remote files using your local files:
```git
git push -f origin master
```

## Mini-Dev Blog
### 2/10/17
Created plan to separate web server into frontend and backend. Frontend pings the backend, the API, for data in json format.
Backend performs a call to database to retrieve the prepared statement query.
Researching technologies available and whether they fit my needs. Currently, just NodeJS for frontend and backend.
Database could either be MySQL Cluster or Cassandra. 
Authentication could be ExpressJS session or OAuth2.
Primary webserver/load balancer is Nginx.
Caching will be from Redis.
File system will be a CDN of some sort. Currently looking into available options and files will no longer be stored into the production database.


### 3/10/17
Wrote API to send json object instead of rendering a webpage. Need to swap for cassandra or mysql connector - postgres not that good.

### 3/20/17
Settling on cassandra. 1 cluster, 1 data center, 1 rack, 3 servers, 1 node each. In terminology, cluster and data center are somewhat synonymous, but the hierarchy generally looks like this:
```git
cluster
    data center
        racks
            servers
                nodes
```
A cluster holds many data centers and can replicate through all of them. Think of a cluster like a continent or country; i.e., USA.
The data centers would be the west and east coasts. So far I only set up for each coast.
Each data center can hold many racks. I only have one rack and it holds 3 servers. Rack may or may not incur a likely point of failure, the real point of redundancy is the servers.
3 servers. 1 node each. This allows for horizontal replication to have multiple copies of the dataset across commodity machines.

### 4/20/17
Day before due date; 3 cassandra nodes, 3 mysql nodes, 3 backend nodes, 3 frontend nodes, 1 redis node. Frontend has connection to cassandra, mysql, and redis nodes. Deploying to AWS EC2 now.
