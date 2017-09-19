import React, {Component} from 'react';
import {Line} from 'react-chartjs-2';

class RightChart extends Component {

	  constructor(props){
  	super(props);

    this.state = {chartData: null};
  }

  getRandomColor = () => {
    return '#'+(Math.random()*0xFFFFFF<<0).toString(16);
  }

  buildChartData = () => {

    let topCoins = this.props.topCoins
    let priceData;
    let dateData;
    let datasets = [];

    topCoins.forEach((topCoin) => {
      fetch(`http://www.coincap.io/history/365day/${topCoin.symbol}`) 
        .then(result => {
          return result.json()
        })
        .then((coinYearData) => {
          priceData = coinYearData.price.map((price) => {
            return price[1];
          });
          dateData = coinYearData.price.map((price) => {
            return new Date(price[0]).toString().substring(4, 10)
          })
          let coinColour = '#'+(Math.random()*0xFFFFFF<<0).toString(16)

          datasets.push({
            data: priceData, 
            label: topCoin.symbol, 
            borderColor: coinColour,
            backgroundColor: coinColour, 
            fill: false, 
            pointRadius: 1,
            borderCapStyle:"butt",
            borderJoinStyle:"miter",
          })
          this.setState({chartData: { datasets: datasets, labels: dateData }});
        })      
    })

    // fetch(`http://www.coincap.io/history/365day/BTC`) 
    //   .then(result => {
    //     return result.json()
    //   })
    //   .then((coinYearData) => {
    //     priceData = coinYearData.price.map((price) => {
    //       return price[1];
    //     });
    //     dateData = coinYearData.price.map((price) => {
    //       return price[0];
    //     })

    //     this.setState({chartData: { datasets: [{data: priceData}], labels: dateData }});
    //   })

    // topCoins.forEach((topCoin) => {
    //   fetch(`http://www.coincap.io/history/365day/${topCoin.symbol}`) 
    //     .then(result => {
    //       return result.json()
    //     })
    //     .then((coinYearData) => {
    //       coinYearData.price.forEach((coinYearPrice) => {
    //         let newDataset = {}
    //         let dayValues = []

    //         dayValues.push(coinYearPrice[1])
    //         let fullDate = new Date(coinYearPrice[0])
    //         let date = fullDate.toString().substring(4, 10)

    //         newDataset.data = dayValues
    //         newDataset.label = topCoin.symbol
    //         newDataset.backgroundColor = this.getRandomColor()
    //         console.log('here')
    //         newDatasets.push(newDataset)
    //         dayIndex.push(date)
    //         // newDataset = {}

    //       })
    //     })
    // })

    // return {
    //   labels: dateData,
    //   datasets: priceData
    // }
  }


    componentDidUpdate(prevProps) {
      if (prevProps.topCoins.length === 0 && this.props.topCoins.length > 0) {
        this.buildChartData();   
      }
      return true;
    }

    getChartData = () => {
      return this.state.chartData;
    }

    renderLine = () => {
      return (
          <Line 
            data={this.getChartData()} 
            width={100}
            height={100}
            options={{
                maintainAspectRatio: false,
                scales: {
                    xAxes: [{
                                gridLines: {
                                    color: "rgba(0, 0, 0, 0)",
                                }
                            }],
                    yAxes: [{
                                gridLines: {
                                    color: "rgba(0, 0, 0, 0)",
                                }   
                            }]
                    }
            }}  
        />
      )
    }

    render() {
        return (
            <div className='rightChart'>
            {this.state.chartData && this.renderLine()}
            </div>
        );
    }
}

export default RightChart;