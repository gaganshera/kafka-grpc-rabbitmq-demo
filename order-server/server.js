const orderService = require("./services/orders-service")
const PROTO_PATH = __dirname + "/protos/orders.proto";
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
var orderServiceDef = grpc.loadPackageDefinition(packageDefinition).order;

/**
 * Get a new server with the handler functions in this file bound to the methods
 * it serves.
 * @return {Server} The new server object
 */
function getServer() {
  var server = new grpc.Server();
  server.addService(orderServiceDef.Order.service, orderService);
  return server;
}

if (require.main === module) {
  // If this is run as a script, start a server on an unused port
  var routeServer = getServer();
  routeServer.bindAsync("0.0.0.0:50051", grpc.ServerCredentials.createInsecure(), () => {
    routeServer.start();
  });
}

exports.getServer = getServer;
