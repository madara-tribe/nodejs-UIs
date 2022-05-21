# tensorflowjs
tensorflowjs and related libarary version at May 2019 are as follows:
```
tensorflow==1.13
keras==2.2.4
tensorflowjs==1.1.2
```

I trained CNN for image classification at google colaboratory and converted saved weight(h5 file) by tensorflowjs_converter to load by javascript
```
$ tensorflowjs_converter --input_format keras --output_format tfjs_layers_model ep02model.h5 web_model/
```
I build server to access with node.js.
you can predict upload image accuracy and its accuracy is indicated on screen




# hot to build server
In same path of nodejs foloder、install node.js pakeges
```
$ npm install
```
Bild server by below command
```
$ npm start
```

After build server、access to ```http://localhost:8080```


## Result

![tfjs](https://user-images.githubusercontent.com/48679574/120218144-45ebac80-c274-11eb-9636-076df662b0c8.gif)


# Summary

Details logics and please are wrriten below [my blog](http://trafalbad.hatenadiary.jp/entry/2019/05/14/235403).


