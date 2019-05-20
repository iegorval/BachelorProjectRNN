var fs = require("fs");
var models_list = fs.readFileSync("models_list.txt").toString('utf-8').split("\n");
configs = models_list.map(model_name => {
    var model_info = model_name.split('_');
    var bid = false;
    var dropout = false;
    var dropoutRate = 0.0;
    var esn_params = {};
    var conv_params = {};

    switch (model_info[0]) {
        case "rnn": {
            layers = model_info.slice(1).map(val => Number(val));
            break;
        }

        case "gru": {
            layers = model_info.slice(1).map(val => Number(val));
            break;
        }

        case "lstm": {
            idx = model_info.indexOf('d');
            if (idx != -1) {
                layers = model_info.slice(1, idx).map(val => Number(val));
                dropout = true;
                dropoutRate = model_info[idx+1];
            } else {
                layers = model_info.slice(1).map(val => Number(val));
            }
            if (model_info.indexOf('bid') != -1) {
                bid = true;
            }
            break;
        }

        case "cnn-lstm": {
            layers = [Number(model_info[1])];
            conv_params = {
                'filters': Number(model_info[2]),
                'kernel': Number(model_info[3]),
                'pooling': Number(model_info[4])
            };
            break;
        }

        case "conv-lstm": {
            layers = [Number(model_info[1])];
            conv_params = {
                'filters': Number(model_info[2]),
                'kernel': Number(model_info[3]),
            }
            break;
        }

        case "esn": {
            esn_params = {
                'reservoirs': Number(model_info[1]),
                'spectral_radius': Number(model_info[2])/10
            }
            break;
        }
    }

    return {
        "model": model_info[0],
        "units": layers,
        "dropout": dropout,
        "dropout_rate": Number(dropoutRate)/100,
        "bidirectional": bid,
        "conv": conv_params,
        "esn": esn_params
    }
});

configs_string = JSON.stringify(configs);

fs.writeFile('models_configuration.json', configs_string, 'utf-8', function (err) { if (err) throw err; });