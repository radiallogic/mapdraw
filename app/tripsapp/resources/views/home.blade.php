<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>Trips-app</title>

    </head>
    <body>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.4.2/react.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.4.2/react-dom.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.21.1/babel.min.js"></script>
    <script type="text/babel">
    class Greeting extends React.Component {
        render() {
            return (<p>Hello world</p>);
        }
    }
    ReactDOM.render(
        <Greeting />,
        document.getElementById('root')
    );
    </script>
    
    <div id="root"></div>
    
    </body>
</html>
