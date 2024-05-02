import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart } from "react-google-charts";

import './App.css';

// Import your background video file
import backgroundVideo from './Assets/bgVideo2.mp4';

function App() {
    const [question, setQuestion] = useState('');
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [chartData, setChartData] = useState(null);
    const [selectedModel, setSelectedModel] = useState('bert');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if(selectedModel === "logistic")
        {
            try {
                const response = await axios.post(`http://127.0.0.1:5000/api/data`, { question });
                setPrediction(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Error classifying question:', error);
            }

        }
        else
        {
            try {
                const response = await axios.post(` https://e135-35-197-122-150.ngrok-free.app/api/data`, { question });
                setPrediction(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Error classifying question:', error);
            }

        }

        setLoading(false);
    };

    useEffect(() => {
        if (prediction ) {
            // const sincereConfidence = prediction.result === "Insincere" ? 100 - prediction.confidence : prediction.confidence;
            // const insincereConfidence = prediction.result === "Insincere" ? prediction.confidence : 100 - prediction.confidence;
            let sincereConfidence;
            let insincereConfidence;
            if(prediction.result  === "Insincere")
            {
                sincereConfidence = 100 - prediction.confidence;

                insincereConfidence = prediction.confidence;

            }
            else
            {
                insincereConfidence = 100 - prediction.confidence;

                sincereConfidence = prediction.confidence;

            }
            setChartData([
                ["Task", "Prediction Confidence"],
                ["Sincere", sincereConfidence],
                ["Insincere", insincereConfidence],
            ]);
        }
    }, [prediction]);

    const options = {
        title: "Confidence Graph",
        is3D: true,
        titleTextStyle: {
            color: 'White', // Set the color of the title
        },
        legend: {
            textStyle: {
                color: 'white' // Set the color of the legend text
            }
        },
        backgroundColor: 'transparent',
        fontSize: 20,
        slices: [
            { color: '#0CAFFF' }, // Green color for sincere slice
            { color: '#E32636' }
        ]
    };

    // const chartStyle = {
    //     backgroundColor: 'transparent', // Set background color to transparent
    //     width: '100%',
    //     height: '400px',
    // };

    return (
        <div className="App">
            {/* Background video */}
            <video className="background-video" autoPlay loop muted>
                <source src={backgroundVideo} type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {/* Main content */}
            <div className="content">
                <h1 className="title">Quora Insincere Question Classification</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        className="input-text"
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Enter your question"
                        style={{ borderRadius: '5px', padding: '10px', marginRight: '10px', border: '1px solid #ccc' }}
                    />
                    <select
                        className="input-text"
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        style={{ borderRadius: '5px', padding: '10px', marginRight: '10px', border: '1px solid #ccc' ,width:'3cm', height:'1cm'}}
                    >
                        <option value="bert">BERT</option>
                        <option value="logistic">Logistic</option>
                    </select>
                    <button className="input-text-button" type="submit" disabled={loading}
                            style={{
                                borderRadius: '5px',
                                padding: '10px 20px',
                                backgroundColor: loading ? '#ccc' : '#007bff',
                                border: 'none',
                                color: 'white',
                                cursor: loading ? 'not-allowed' : 'pointer',
                            }}>
                        {loading ? 'Predicting...' : 'Predict'}
                    </button>
                </form>
                {prediction && (
                    <div style={{ margin:'50px'}}>
                        <div>
                            <p style={{ color: "white", fontSize: 22 }}>Predicted Label: {prediction.result}</p>
                            <p style={{ color: "white", fontSize: 22 }}>Confidence: {prediction.confidence}</p>
                        </div>
                        <div>
                            <Chart
                                chartType="PieChart"
                                data={chartData}
                                options={options}
                                width={"100%"}
                                height={"400px"}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>

    );
}

export default App;