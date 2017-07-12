# Tensorflow Serving Client 
> Targeting Node.js (v6) and TypeScript


Provides: 

- Prediction of images;
- And that's it so far.


#### Usage Example

```javascript
import TensorflowServingClient = require( "tensorflow-serving-node-typescript-client");
import fs = require('fs');

class TensorflowServing {

    private client: any;
    private imagePath: string = "path/to/image.jpg";

    public constructor() {
        this.client = new TensorflowServingClient.TensorflowServingClient("localhost:9000");
    }

    public predict(): void {
        try {
            let buffer = fs.readFileSync(this.imagePath);
            this.client.Predict(buffer)
                .then((result) => {
                    console.log(result);
                })
                .catch((error) => {
                    console.log(error);
                })
        }
        catch (e) {
            console.log(e);
        }
    }
}

export = TensorflowServing;   
```

##### Notes

- This is a work in progress, feel free to improve it.
