## 日志监控server
### 项目描述
本项目基于koa2 + rabbitmq + elasticsearch + kibana做日志信息的收集、存储、查询，运行在docker上，可以通过docker desktop查看各容器的情况

### 步骤
#### 1、npm i
#### 2、docker-compose up
<br>

### 访问rabbitmq
本地访问 localhost:15672
<br>
mq采用了simple模式 其中，data-queue队列负责发送业务上报数据；reply-queue队列负责发送响应返回

### 检查es是否连接
#### 本地访问 localhost:9200
#### post请求/ping接口
<br>

### 访问kibana
#### 本地访问 localhost:5601

