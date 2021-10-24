# kafka-grpc-rabbitmq-demo

### **Pre-requisites and assumptions**
Following softwares should be installed
- Nodejs >= 10
- npm (bundles with nodejs)
- RabbitMq running
- Kafka (3 brokers), server properties files attached.

Following ports should be available for the nodejs services:
- Product service http server: 8066
- Order service gRPC server: 50051
### **How to install**
- In the 3 folders: order-server, kafka-notification-service, rabbit-mq-notification-service
  1. Rename the `dev.env` to `.env`
  2. Put the appropriate env details in all 3 `.env` files with information for RabbitMq and Kafka clusters, replacing the dummy information
- Run `npm install` in all the 4 services
  1. Go to `product-service` folder and run `npm install`
  2. Go to `order-server` folder and run `npm install`
  3. Go to `kafka-notification-service` folder and run `npm install`
  4. Go to `rabbit-mq-notification-service` folder and run `npm install`

### **Kafka brokers**
1. First start the zookeeper service

```bin/zookeeper-server-start.sh config/zookeeper.properties```

2. Start the 3 kafka brokers

```bin/kafka-server-start.sh config/server.properties```

```bin/kafka-server-start.sh config/server1.properties```

```bin/kafka-server-start.sh config/server2.properties```

### **Kafka topics**
#### Two ways to create kafka topics:
- Create kafka topic manually using the following command:

    ```bin/kafka-topics.sh --create --topic notification-kt-1 --bootstrap-server localhost:9092 --partitions 3 --replication-factor 3```
#### OR
- Kafka topics can also be created automatically while publishing messages. For that, set default broker settings for partition and replicationwith following keys. This will set value for all default partitions and partitions on the broker:

    `num.partitions` and `default.replication.factor`

### **How to run**
#### Preferred way:
- The preferred way is to run each service in a separate terminal
  1. Go to `product-service` folder and run `npm start`
  2. Go to `order-server` folder and run `npm start`
  3. Go to `kafka-notification-service` folder and run `npm start`
  4. Go to `rabbit-mq-notification-service` folder and run `npm start`

#### OR
- Another way is to simply run the project from root folder. However, in this case all the logs in the terminal will be concurrent and it'll be harder to see output of each service separately.
  1. From the root, run `npm start`

### **APIs**
1. List all products  
```
  GET /products/ HTTP/1.1
  Host: localhost:8066
```
```bash
curl --location --request GET 'localhost:8066/products/'
```  

2. Get product details

```bash
  GET /products/:productId HTTP/1.1
  Host: localhost:8066
```
`productId` is id returned from the list all products API
```bash
curl --location --request GET 'localhost:8066/products/332acbc6-aebc-4210-b97d-31ff23768f67'
```

3. Place order
```json
GET /products/order HTTP/1.1
Host: localhost:8066
Content-Type: application/json

{"productId": "332acbc6-aebc-4210-b97d-31ff23768f67", "quantity": 2}
```
```bash
curl --location --request GET 'localhost:8066/products/order' \
--header 'Content-Type: application/json' \
--data-raw '{"productId": "332acbc6-aebc-4210-b97d-31ff23768f67", "quantity": 2}'
```

### Misc Details
- RabbitMQ exchange name: `notification_ex`
- RabbitMQ queue name: `notification_q`
- Kafka topic: `notification-kt-1`