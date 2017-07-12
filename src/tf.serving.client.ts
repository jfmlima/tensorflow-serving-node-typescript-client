/**
 * Node gRPC client for TensorFlow Serving server written in Typescript.
 */

const grpc = require("grpc");

/**
 * Exports TensorflowServingClient.
 *
 * @param {string}  serverUrl  Tensorflow Serving connection string. E.g., localhost:9000
 */
export class TensorflowServingClient {
    private readonly PROTO_PATH = __dirname + '/protos/prediction_service.proto';
    private tensorflowServing: any = grpc.load(this.PROTO_PATH).tensorflow.serving;
    private serverUrl: string;
    private client: any;

    public constructor(serverUrl: string) {
        this.serverUrl = serverUrl;
    }


    /**
     * Initializes the gRPC client
     * @returns void
     */
    private Initialize(): void {
        this.client = new this.tensorflowServing.PredictionService(
            this.serverUrl, grpc.credentials.createInsecure()
        );
    }

    /**
     * Makes the prediction of the image present in the buffer
     * @param buffer Array or single buffer with the image
     * @returns Promise with the prediction result or error if any
     */
    public Predict(buffer: Array<any> | any): Promise<any> {
        //Create the buffer
        let buffers: Array<any> = this.InitializeBuffer(buffer);

        // Building PredictRequest proto message
        let message: Object = this.BuildPredictRequestMessage(buffers);

        let result: Promise<any> = new Promise<any>((resolve, reject) => {
            // Calling gRPC method
            this.client.predict(message,
                (error, response) => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        // Decoding response
                        let classes: any = response.outputs.classes.string_val.map((b) => b.toString('utf8'));

                        let i,
                            len = classes.length,
                            chunk = 5,
                            results = [];
                        for (i = 0; i < len; i += chunk) {
                            results.push(classes.slice(i, i + chunk));
                        }
                        resolve(result);
                    }
                })
        });

        return result;
    }

    /**
     * Initializes the buffer
     * @param buffer Array or single buffer with the image
     * @returns Array
     */
    private InitializeBuffer(buffer: Array<any> | any): Array<any> {
        let buffers: Array<any>;

        if (buffer instanceof Array) {
            buffers = buffer;
        }
        else {
            buffers = new Array<any>(buffer);
        }
        return buffers;
    }

    /**
     * Builds the PredictRequestMessage according to the proto
     * @param buffers Buffer with the image
     * @returns Object
     */
    private BuildPredictRequestMessage(buffers: Array<any>): Object {
        let message = {
            model_spec: { name: 'inception', signature_name: 'predict_images' },
            inputs: {
                images: {
                    dtype: 'DT_STRING',
                    tensor_shape: {
                        dim: {
                            size: buffers.length
                        }
                    },
                    string_val: buffers
                }
            }
        };

        return message;
    }
}