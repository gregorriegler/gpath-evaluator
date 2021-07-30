import React, {Component} from 'react';
import './App.css';

class App extends Component {

    constructor() {
        super();
        this.state = {
            json: '[\n' +
                '    {\n' +
                '        "code": "HQ",\n' +
                '        "name": "Head Quarter",\n' +
                '        "parent": null\n' +
                '    },\n' +
                '    {\n' +
                '        "code": "AT",\n' +
                '        "name": "Austria",\n' +
                '        "parent": "HQ"\n' +
                '    },\n' +
                '    {\n' +
                '        "code": "GB",\n' +
                '        "name": "United Kingdom",\n' +
                '        "parent": "HQ"\n' +
                '    },\n' +
                '    {\n' +
                '        "code": "FR",\n' +
                '        "name": "France",\n' +
                '        "parent": "HQ"\n' +
                '    },\n' +
                '    {\n' +
                '        "code": "US",\n' +
                '        "name": "United States",\n' +
                '        "parent": "HQ"\n' +
                '    },\n' +
                '    {\n' +
                '        "code": "ZZ",\n' +
                '        "name": "Other",\n' +
                '        "parent": "HQ"\n' +
                '    }\n' +
                ']',
            expression: 'findAll{it.code==\'AT\'}.parent',
            result: ''
        };
    }

    changeJson = e => {
        this.setState({json: e.target.value})
    };

    changeExpression = e => {
        this.setState({expression: e.target.value})
    };

    handleResult = result => {
        this.setState({result: result})
    };

    handleError = error => {
        console.log("error", error)
        this.setState({result: error})
    };

    onSubmit = e => {
        e.preventDefault();
        this.evaluate(this.state.json, this.state.expression);
    };

    evaluate(json, expression) {
        console.log('evaluated', json, expression);
        const xhr = new XMLHttpRequest();
        let that = this;
        xhr.addEventListener('load', () => {
            that.handleResult(xhr.responseText);
        });
        xhr.open('POST', 'https://cors.bridged.cc/https://groovyide.com/api/v1/run')
        xhr.setRequestHeader('content-type', 'text/plain;charset=UTF-8')
        xhr.send(this.createRequest(json, expression))
    };

    createRequest(json, expression) {
        let source = "import groovy.json.JsonSlurper\r\n\r\ndef jsonSlurper = new JsonSlurper()\r\ndef object = jsonSlurper.parseText(\r\n";
        source += "\"\"\"";
        source += json;
        source += "\"\"\")\r\n\r\n";
        source += "def test = object." + expression + "\r\n\r\n";
        source += "print(test)";
        return source;
    }

    render() {
        return (
            <div className="App">
                <div className="form">
                    <form onSubmit={this.onSubmit}>
                        <textarea value={this.state.json} onChange={this.changeJson} placeholder="enter json here"/>
                        <input type="text" value={this.state.expression} onChange={this.changeExpression}
                               placeholder="gpath expression"/>
                        <button type="submit">evaluate</button>
                    </form>
                </div>
                <div className="result">
                    <h1>Result</h1>
                    {this.state.result}
                </div>
            </div>
        )
    }

}

export default App
