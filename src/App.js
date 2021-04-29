import React, { Component } from 'react';
import './App.css';
import 'semantic-ui-css/semantic.min.css';
import { Grid, Dropdown, Table } from 'semantic-ui-react';
import Card from './Card';
import Graph from './Graph';
import CoMap from './CoMap'; 
import 'leaflet/dist/leaflet.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCard:'cases',
      mapCountries:[],
      center:{
        lat:34.80746,
        lng:-40.4796
      },
        zoom:2, 
      countries:[
        
        {
          key:'wrld',
          value:'worldwide',
          text:'Worldwide'
        }
      ],
      selectedCountryData:{
        active:0,
        todayCases:0,
        todayDeaths:0,
        todayRecovered:0,
        cases:0,
        recovered:0,
        deaths:0
      },
      tableData:[],
      graphData:[]
     }
  }

  componentDidMount = async () =>{

    await fetch("https://disease.sh/v3/covid-19/countries")
    .then(response => response.json()
    .then(data => {
        const countriesData = data.map(countryData => (
          {
            key:countryData.countryInfo.iso2,
            value:countryData.country,
            text:countryData.country
          }
        ));
        const table = data.map(countryData =>(
          {
            key:countryData.countryInfo.iso2,
            country:countryData.country,
            active:countryData.active,
            activepm:countryData.activePerOneMillion
          }
        ));
        table.sort((a,b)=>b.active-a.active);
        // console.log(countriesData);
        this.setState({
          countries:[ ...this.state.countries ,...countriesData],
          tableData:table,
          mapCountries:data
        });
    }));

    await this.setCountryData('https://disease.sh/v3/covid-19/all','worldwide');
    await this.setGraphData('https://disease.sh/v3/covid-19/historical/all?lastdays=120','worldwide');
  }

  setSelectedCard = (css) =>{
    if(css=='cnf') this.setState({selectedCard:'cases'});
    else if(css=='rec') this.setState({selectedCard:'recovered'});
    else this.setState({selectedCard:'deaths'})
  }
  setCountryData = async(url,value) =>{
    await fetch(url)
    .then(response => response.json())
    .then(data => {
      // console.log(data);
      if(value=='worldwide'){
        this.setState({
          selectedCountryData: data,
          center:{
            lat:34.80746,
            lng:-40.4796
          },
          zoom:3
        });
      }
      else{
        this.setState({
          selectedCountryData: data,
          center:{
            lat:data.countryInfo.lat,
            lng:data.countryInfo.long
          },
          zoom:4
        });
      }


    })
  }
  dropdownChange = async (e,{value}) =>{
    // console.log(value);
    const url1 = value=='worldwide'?'https://disease.sh/v3/covid-19/all':`https://disease.sh/v3/covid-19/countries/${value}`;
    await this.setCountryData(url1,value);
    const url2 =  value=='worldwide'?'https://disease.sh/v3/covid-19/historical/all?lastdays=120':`https://disease.sh/v3/covid-19/historical/${value}?lastdays=120`;
    await this.setGraphData(url2,value);
  }
  setGraphData = async (url,value) => {
    await fetch(url)
    .then(response => response.json())
    .then(data => {
      // console.log(data);
      let graphData =[];
      let cases,recovered,deaths;
      if(value=='worldwide'){
         cases = data.cases;
         recovered = data.recovered;
         deaths = data.deaths;
      }
      else{
        cases=data.timeline.cases;
        recovered=data.timeline.recovered;
        deaths=data.timeline.deaths;
      }

      cases = Object.entries(cases);
      deaths = Object.entries(deaths);
      recovered = Object.entries(recovered);
      // console.log(cases);
      for(let i=0;i<cases.length;i++){
        graphData.push({
          date:cases[i][0],
          cases:cases[i][1],
          recovered:recovered[i][1],
          deaths:deaths[i][1]
        })
      };
      // console.log(graphData);
      this.setState({graphData:graphData});
    })
  }
  render() { 
    // console.log(this.state.selectedCountryData);
    return ( 
      <div className="app">
        <Grid stackable>
          <Grid.Column width='10'>
            <Grid stackable>
              <Grid.Row className="headers">
                <Grid.Column width='8'>
                  <h1 className="app__header">COVID-19 Tracker</h1>
                </Grid.Column>
                <Grid.Column width='8' className="clear">
                <Dropdown
                  name='selectedCountry'
                  search
                  selection
                  className = "app__dropdown"
                  options={this.state.countries}
                  defaultValue="worldwide"
                  onChange={this.dropdownChange}
                />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row className="card__group">
                <Card title="Confirmed Cases" today={this.state.selectedCountryData.todayCases} total={this.state.selectedCountryData.cases} css="cnf" selectedCard={this.setSelectedCard}/>
                <Card title="Recovered" today={this.state.selectedCountryData.todayRecovered} total={this.state.selectedCountryData.recovered} css="rec" selectedCard={this.setSelectedCard}/>
                <Card title="Deaths" today={this.state.selectedCountryData.todayDeaths} total={this.state.selectedCountryData.deaths} css="dea" selectedCard={this.setSelectedCard}/>
              </Grid.Row>
              <Grid.Row className="app__map">
                <CoMap countries={this.state.mapCountries} center={this.state.center} zoom={this.state.zoom} casesType={this.state.selectedCard}/>
              </Grid.Row>
            </Grid>
          </Grid.Column>
          <Grid.Column width='6'>
            <div  className="table">
              <Table striped>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Countries</Table.HeaderCell>
                    <Table.HeaderCell>Active Cases</Table.HeaderCell>
                    <Table.HeaderCell>Active/1M</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {
                    this.state.tableData.map(country => (
                      <Table.Row key={country.key}>
                        <Table.Cell>{country.country}</Table.Cell>
                        <Table.Cell>{country.active}</Table.Cell>
                        <Table.Cell>{country.activepm}</Table.Cell>
                      </Table.Row>
                    ))
                  }
                </Table.Body>
              </Table>
            </div>
            <div className="graph">
              <Graph data={this.state.graphData}/>
            </div>
          </Grid.Column>
        </Grid>
      </div>
     );
  }
}
 
export default App;
