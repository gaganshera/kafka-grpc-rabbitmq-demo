const PROTO_PATH = __dirname + "/../protos/orders.proto";

const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const orderServiceDef = grpc.loadPackageDefinition(packageDefinition).order;
const target = "localhost:50051";
const client = new orderServiceDef.Order(target, grpc.credentials.createInsecure());

module.exports = client